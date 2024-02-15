import React from "react";
import "./icons1.css";
import { RiProfileLine } from "react-icons/ri";
import { TfiLayoutListThumb } from "react-icons/tfi";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { ImFileMusic } from "react-icons/im";
import { VscSymbolFile } from "react-icons/vsc";
import { CiLocationOn } from "react-icons/ci";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { ImProfile } from "react-icons/im";
import { MdFace } from "react-icons/md";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
//import Timeline from "../Timeline";
import {BiPhotoAlbum} from 'react-icons/bi'
import {BiSolidUserPlus} from 'react-icons/bi'
import {HiUsers} from 'react-icons/hi'
import { BiSolidLike } from "react-icons/bi";
import { FaRegObjectGroup } from "react-icons/fa";
const Icons1 = () => {
  return (
    <>
      <div className="ico">
        <div className="icons1">
          <div className="ul">
            <Link to="/members/:id" style={{ textDecoration: "none" }}>
              <ul>
                <RiProfileLine />
              </ul>
            </Link>
            <Link to="/members/:id/1" style={{ textDecoration: "none" }}>
              <ul>
                <TfiLayoutListThumb />
              </ul>
            </Link>
            <ul>
            <Link to="/members/:id/2" style={{ textDecoration: "none" }}>
              <MdOutlinePhotoSizeSelectActual style={{ color: "green" }} />
              </Link>
            </ul>
            <ul>
              <HiOutlineVideoCamera style={{ color: "blue" }} />
            </ul>
            <ul>
              <ImFileMusic style={{ color: "Maroon" }} />
            </ul>
            <ul>
              <VscSymbolFile style={{ color: "violet" }} />
            </ul>
            <ul>
              <CiLocationOn style={{ color: "red" }} />
            </ul>
          </div>
          <Routes>
            <Route path="/" element={<div>Hi</div>} />
            <Route path="/1" element={<div>Hello1</div>} />
            <Route path="/2" element={<div>Hello2</div>} />
            <Route path="/3" element={<div>Hello3</div>} />
          </Routes>
        </div>
        <div className="list" >
          <div className="list1" style={{ width: "100%" }}>
            <ul>
              <AiOutlineInfoCircle />
              <p style={{ marginBottom: "5px" }}>Info</p>
            </ul>
            <hr style={{ margin: "10px 0px" }} />
            <ul>
              <AiOutlineEye />
              <p style={{ marginBottom: "5px" }}>6 w</p>
            </ul>
            <ul>
              <ImProfile />
              <p style={{ marginBottom: "5px" }}>0 posts</p>
            </ul>
            <hr style={{ margin: "10px 0px" }} />
            <ul>
              <MdFace />
              <p style={{ marginBottom: "5px" }}>Male</p>
            </ul>
          </div>
          <div className="left">
                <form>
                    Search for posts<br/>
                    <input type="text" name="name" placeholder="" style={{width:'16.5vw',borderRadius:'10px',height:'5vh',border:'solid 1px'}}/>
                </form>
          </div>
          {/* <div className="alb">
            <BiPhotoAlbum style={{color:' #174873'}}/><p style={{marginBottom:'0px'}}>Albums</p>
          </div> */}
          <div className="fol">
            <BiSolidUserPlus style={{color:' #174873'}}/><p style={{marginBottom:'0px'}}>Following</p>
          </div>
          <div className="fo">
            <HiUsers style={{color:' #174873'}}/><p style={{marginBottom:'0px'}}>Followers</p>
          </div>
          {/* <div className="fo">
            <BiSolidLike style={{color:' #174873'}}/><p style={{marginBottom:'0px'}}>Likes</p>
          </div> */}
          <div className="fo">
            <FaRegObjectGroup  style={{color:' #174873'}}/><p style={{marginBottom:'0px'}}>Groups</p>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Icons1;
