import React from "react";
import "./icons.css";
import { CiViewTimeline } from "react-icons/ci";
import { LiaObjectGroupSolid } from "react-icons/lia";
import { AiTwotoneLike } from "react-icons/ai";
import { HiUserAdd } from "react-icons/hi";
import { HiUsers } from "react-icons/hi";
import { HiPhotograph } from "react-icons/hi";
import { BiSolidVideo } from "react-icons/bi";
import { Link } from "react-router-dom";

const icons = () => {
  return (
    <>
      <div style={{display:'flex',justifyContent:'center',marginTop:'-30px'}}>
        <div className="icon">
          <div>
            <center><CiViewTimeline /></center>
            <p style={{marginBottom:'0px' }}>Timeline</p>
          </div>
          <Link to='/groups' style={{textDecoration: 'none', color: 'black'}}>
          <div>
           <center><LiaObjectGroupSolid /></center>
            <p style={{marginBottom: '0px'}}>Groups</p>
          </div>
          </Link>
          <Link to='/profile/following' style={{textDecoration: 'none', color: 'black'}}>
          <div>
          <center><HiUserAdd /></center>
            <p style={{marginBottom: '0px'}}>Following</p>
          </div>
          </Link>
          <Link to='/profile/followers' style={{textDecoration: 'none', color: 'black'}}>
          <div>
          <center><HiUsers /></center>
            <p style={{marginBottom: '0px'}}>Followers</p>
          </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default icons;
