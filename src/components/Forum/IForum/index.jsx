import React, { useState, useEffect } from 'react';
import Picture from '../../../images/io.png';
import CommentSection from '../../CommentSection';
import axios from 'axios';
import './IForum.css';
import { useParams } from 'react-router-dom';
import { DeleteRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const IForum = () => {
  const [forum, setForum] = useState(null);
  const { id } = useParams();
  const navigateTo = useNavigate();
  const profile = useSelector((state) => state.profile);

  let admin;
  if (profile.profileLevel === 0) {
    admin = true;
  }

  const refreshComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/forums/${id}`);
      setForum(response.data);
    } catch (error) {
      console.error('Error fetching forum data:', error);
    }
  };

  useEffect(() => {
    refreshComments();
  }, [id]);


  const handleDeletePost = async (forumId) => {

    try {
      await axios.delete(`http://localhost:5000/forums/${forumId}`);
      toast.success('Deleted successfully!');
      navigateTo('/forums')
    } catch (error) {
      console.error('Error deleting post:', error);
    }

    // else{
    //   console.log("Cannot Delete")
    // }
  };




  return (
    <div style={{ width: '60%' }}>
      <h1 style={{ backgroundColor: '#174873', color: 'white', textAlign: 'center', padding: '30px 0px', fontWeight: '600' }}>Forums</h1>
      <div className='iforum'>
        <div className='iforum-1'>
          {forum && (
            <>
              {(forum.userId === profile._id || admin) && (
                <IconButton onClick={() => handleDeletePost(forum._id)} className='delete-button'>
                  <DeleteRounded />
                </IconButton>
              )}
              <h1 style={{ fontFamily: 'sans-serif', fontWeight: 500, fontSize: 30, marginTop: '1em' }}>{forum.title}</h1>
              <p style={{ fontWeight: '500', fontSize: '20' }} dangerouslySetInnerHTML={{ __html: forum.description }}></p>
              {forum.picture && <img src={forum.picture} alt="Forum Image" style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '10px', paddingBottom: '10px' }} />}
            </>
          )}
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: '#F5F5F5', margin: '20px 0px' }}>
        <div style={{ width: '60%', padding: '30px' }}>
          {forum && <CommentSection
            comments={forum ? forum.comments : null}
            entityId={id}
            entityType="forums"
            onCommentSubmit={refreshComments}
            onDeleteComment={refreshComments}
          />}
        </div>
      </div>
    </div>
  );
};

export default IForum;
