import './displayPost.css'
import NoGroups from '../Groups/NoGroups'
import picture from '../../images/d-group.jpg'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { lineSpinner } from 'ldrs'

lineSpinner.register()


const DisplayPost = ({ title, groups, loading,joined }) => {
  const profile = useSelector((state) => state.profile);
  const [notificationList, setNotificationList] = useState([]);

  let admin;
  if (profile.profileLevel === 0) {
    admin = true;
  }

  const getRequest = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/groups/requests/req`);
      setNotificationList(response.data);

    } catch (error) {
      console.error("Error fetching request:", error);
    }
  };

  useEffect(() => {
    getRequest();
  }, []);

  const GroupItem = ({ group }) => {
    const [requestStatus, setRequestStatus] = useState('Request');

    useEffect(() => {
      
      const matchingNotification = notificationList.find(
        (notification) => notification.groupId === group._id && notification.userId === profile._id
      );

      if (matchingNotification) {
        setRequestStatus('Requested');
      } else {
        setRequestStatus('Request');
      }
    }, [group._id, notificationList, profile._id]);

    const handleRequest = async (ownerId, groupId, userId, groupName, requestedUserName) => {

      const body = {
        ownerId,
        groupId,
        userId,
        groupName,
        requestedUserName
      };
      setRequestStatus('Loading...');
      try {
        const response = await axios.post(`http://localhost:5000/groups/createRequest`, body);
        console.log('body', response.data);
        if (response.data.requested === true) setRequestStatus('Requested');
        else setRequestStatus('Request');
      } catch (error) {
        console.error("Error creating request:", error);
      }
    };

    return (
      <div key={group._id} className='display-post-card'>
        <Link to={`/groups/${group._id}`} style={{ textDecoration: 'none', color: 'black' }}>
          <div className='display-post-image'>
            <img src={picture} alt="" width="100px" height="100px" />
          </div>
          <div className='display-post-title'>
            <p style={{ marginBottom: '0rem', fontWeight: '600', fontSize: '1em' }}>{group.groupName}</p>
            <p style={{ marginBottom: '0rem', color: '#7b7b7b' }}>{group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}</p>
          </div>
        </Link>
        {(profile._id === group.userId || admin) ? (
          <div className='display-post-edit'>
            <Link to={`/groups/edit/${group._id}`}>
              <button>Edit</button>
            </Link>
          </div>
        ) : !joined && (
          <div className='display-post-edit'>
            <button onClick={() => handleRequest(group.userId, group._id, profile._id, group.groupName, profile.firstName)}>{requestStatus}</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="display-post-container">
      {loading ? (
        <div style={{display: 'flex',width: '100%', height: '40vh', alignItems: 'center', justifyContent: 'center'}}>
        <l-line-spinner
          size="40"
          stroke="3"
          speed="1"
          color="black"
        ></l-line-spinner>
        </div>
      ) : groups && groups.length > 0 ? (
        groups.map((group) => <GroupItem key={group._id} group={group} />)
      ) : (
        <div className='display-post-noGroups'><NoGroups /></div>
      )}
    </div>
  );
};

export default DisplayPost;


