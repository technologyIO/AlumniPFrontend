import React, { useState, useEffect, useRef } from 'react';
import { HiUsers } from "react-icons/hi2";
import PageTitle from '../PageTitle';
import Profilecard from '../Profilecard';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';

export const Followers = () => {
  const title = 'Followers';
  const icon = <HiUsers style={{ color: '#174873' }} />;
  const [members, setMembers] = useState([]);
  const [cookie, setCookie] = useCookies(['access_token']);
  const profile = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const LIMIT = 4;
  const [totalFollowers, setTotalFollowers] = useState(0);
  const activePage = useRef(1);

  const fetchMembers = async (page) => {
    try {
      console.log('page', page);
      const response = await fetch(`http://localhost:5000/alumni/${profile._id}/followers?page=${page}&size=${LIMIT}`);
      if (response.ok) {
        const data = await response.json();
        setTotalFollowers(data.totalFollowers);
        setMembers((prevMembers) => [...prevMembers, ...data.followerDetails]);
      } else {
        console.error("Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchMembers(activePage.current);
  }, []);

  console.log('membersss', members);

  const updateFollowers = () => {
    console.log('Update Followers');
    activePage.current++;
    fetchMembers(activePage.current);
  };

  return (
    <div style={{ width: '60%', marginTop: '20px' }}>
      <PageTitle title={title} icon={icon} />
      {members!== undefined && members.length > 0 ? (
        <>
          <div style={{ marginTop: '15px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            {members.map((member) => (
              <Profilecard key={member._id} member={member} name='follow' />
            ))}
          </div>
          {loading && (
            <div style={{ textAlign: 'center' }}> Loading...</div>
          )}
          {activePage.current < totalFollowers / LIMIT && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button className="load-more-button" onClick={updateFollowers}>
                Load More
              </button>
            </div>
          )}
        </>
      ): (
        <div style={{textAlign: 'center'}}>No Followers</div>
      )}
    </div>
  );
};
