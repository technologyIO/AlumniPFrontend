import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './members.css';
import Profilecard from '../../components/Profilecard';

const Members = ({ addButton, groupMembers,owner }) => {
  const membersred = useSelector((state) => state.member);
  const [displayedMembers, setDisplayedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noUsersFound, setNoUsersFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const activePageRef = useRef(1);
  const LIMIT = 4;
  console.log('group memers MEMBERS',groupMembers)

  const totalMembers = membersred.length;

  
  useEffect(() => {
    if (membersred.length > 0) {
      console.log('members red2')
      const initialBatch = membersred.slice(0, LIMIT);
      setDisplayedMembers(initialBatch);
      
    }
  }, [membersred]);

  useEffect(() => {
    initialMembers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filteredMembers = membersred.filter(
        (member) =>
          member.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedMembers(filteredMembers.slice(0, LIMIT)); 
      setNoUsersFound(filteredMembers.length === 0);
    } else {
      const initialBatch = membersred.slice(0, LIMIT);
      setDisplayedMembers(initialBatch); 
      setNoUsersFound(false);
    }
  }, [searchQuery, membersred]);

  const loadMoreMembers = () => {
    setLoading(true);
    const startIndex = activePageRef.current * LIMIT;
    const endIndex = startIndex + LIMIT;
    const nextBatch = membersred.slice(startIndex, endIndex);
    setDisplayedMembers((prevMembers) => [...prevMembers, ...nextBatch]);
    activePageRef.current++;
    setLoading(false);
  };

  const initialMembers = () => {
    setLoading(true);
    const startIndex = activePageRef.current * LIMIT;
    const endIndex = startIndex + LIMIT;
    const nextBatch = membersred.slice(startIndex, endIndex);
    setDisplayedMembers((prevMembers) => [...prevMembers, ...nextBatch]);
    setLoading(false);
  };


  return (
    <div className="member-container">
      <div
        style={{
          backgroundColor: '#174873',
          paddingBottom: '2em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '17vh',
        }}
      >
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for members"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div
        className="pro"
        style={{
          marginTop: '1em',
          display: 'flex',
          flexWrap: 'wrap',
          paddingBottom: '20px',
        }}
      >
        {displayedMembers.map((member) => (
          <Profilecard
            key={member._id}
            member={member}
            addButton={addButton}
            groupMembers={groupMembers}
            owner={owner}
          />
        ))}
      </div>
      {loading && <div style={{ textAlign: 'center' }}> Loading...</div>}
      {console.log('act',activePageRef.current,LIMIT,totalMembers)}
      {activePageRef.current * LIMIT < totalMembers && (
        <div style={{ textAlign: 'center' }}>
          <button className="load-more-button" onClick={loadMoreMembers}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Members;
