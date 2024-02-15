import React from 'react';
import { IoIosNotificationsOff } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FcApprove } from 'react-icons/fc';
import { FcDisapprove } from 'react-icons/fc';
import { lineSpinner } from 'ldrs'

lineSpinner.register()



export const Notifications = () => {
  const [notificationList, setNotificationList] = useState([]);
  const profile = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false); 
  const isAdmin = profile.profileLevel === 0;

  const handleAddMember = async (notificationId,groupId, memberId) => {
    console.log('not',notificationId)
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/groups/members/${groupId}`, {
        userId: memberId,
        notificationId: notificationId
      });

      if (response.status === 200) {
        const { isUserAdded } = response.data;
        setIsAdded(true); 
        setLoading(false);
        console.log('User added/removed from the group:', isUserAdded);
      } else {
        console.error('Failed to add/remove user from the group');
      }
    } catch (error) {
      console.error('Error adding/removing user from the group:', error);
    }
  };

  const getRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/groups/requests/req`);
      setNotificationList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching request:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequest();
  }, [isAdded]);

  const filteredNotifications = isAdmin
    ? notificationList
    : notificationList.filter((notification) => notification.ownerId === profile._id);

  return (
    <div>
      {loading ? (
        <l-line-spinner size="20" stroke="3" speed="1" color="black"></l-line-spinner>
      ) : filteredNotifications.length ? (
        <ul style={{ paddingLeft: '0', marginBottom: '0' }}>
          {filteredNotifications.map((notification) => (
            <li key={notification.groupId} style={{ listStyleType: 'none', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '75%' }}>
                {console.log("isAdded",isAdded)}
                {isAdded ? (
                  <div>
                    {notification.requestedUserName} has been added to {notification.groupName}
                  </div>
                ) : (
                  `${notification.requestedUserName} has requested to join ${notification.groupName}`
                )}
              </div>
              <div style={{ width: '25%', display: 'flex', justifyContent: 'space-evenly' }}>
                <FcApprove
                  style={{ width: '25px', height: '25px', cursor: 'pointer' }}
                  onClick={() => handleAddMember(notification._id,notification.groupId, notification.userId)}
                />
                <FcDisapprove style={{ width: '25px', height: '25px', cursor: 'pointer' }} 
                onClick={() => handleAddMember(notification._id)}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No Notifications</div>
      )}
    </div>
  );
};
