import React from "react";
import "./profile.css";
import picture from "../../images/d-cover.jpg";
import pic from "../../images/profilepic.jpg";
import {BiUserPlus} from 'react-icons/bi'
import {LuMessageSquare} from 'react-icons/lu'
import {BsThreeDotsVertical} from 'react-icons/bs'
import Icons from '../../components/Icons'
import Icons1 from "../../components/Icons1";
const Profile = () => {
  return (
    <>
    <div>
      <div
        className="ple"
        style={{
          backgroundImage: `url(${picture})`,
          height: "35.86vh",
          backgroundSize: "cover",
          borderRadius: "0px 0px 10px 10",
          display:'flex',
          alignItems:'end',
          paddingBottom:'60px'
        }}
      >
        <div>
          <img src={pic}></img>
        </div>
        <div style={{paddingBottom:'1.5em'}}> 
          <h2 style={{ color: "white" }}>alumni1</h2>
          <div style={{display:'flex',gap:'0.5em'}}>
            <button style={{backgroundColor:'#178AC2',color:'white',border:'none'}}><BiUserPlus/> Follow</button>
            <button><LuMessageSquare/>  Message</button>
            <button><BsThreeDotsVertical/></button>
          </div>
        </div>
      </div>
      <Icons/>
      <Icons1/>
      </div>
    </>
  );
};

export default Profile;
