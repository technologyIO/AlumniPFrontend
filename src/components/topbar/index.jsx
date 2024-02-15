import './topbar.css'
import { FaPlus, FaHome, FaBell } from 'react-icons/fa';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { BiSolidBriefcase } from 'react-icons/bi';
import JobsInt from '../JobsInt';
import { useState, useEffect, useRef } from 'react';
import { HiUserGroup } from 'react-icons/hi';
import { LuMessageSquare } from "react-icons/lu";
import { BsCurrencyRupee } from 'react-icons/bs';
import { GoSponsorTiers } from 'react-icons/go';

import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { Notifications } from './Notifications';
import { closeWebSocket } from '../../store/webSocketSlice';
import WebSocketUtility from '../../utils/webSocketUtility';


const TopBar = ({ handleLogout }) => {
    const [showModal, setShowModal] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [cookie, setCookie, removeCookie] = useCookies(['access_token']);
    const navigateTo = useNavigate();
    const [loading, setLoading] = useState(true);
    const profile = useSelector((state) => state.profile);
   
    const settings = useSelector((state) => {
        if (state.settings[0] === undefined) {
            return state.settings;
        } else {
            return state.settings[0];
        }
    });
    const { brandName, logo } = settings;
    const dispatch = useDispatch();
    const profileOptionsRef = useRef(null);
    const notificationsOptionsRef = useRef(null);

    useEffect(() => {
        if (Object.keys(settings).length > 0) {
            setLoading(false);
        }
    }, [settings]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                !notificationsOptionsRef.current.contains(event.target) &&
                !profileOptionsRef.current.contains(event.target) &&
                !(event.target.closest('.notifications-card'))
            ) {
                setShowNotifications(false);
                setShowProfileOptions(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);



    const onHideModal = (modalVisibility) => {
        setShowModal(modalVisibility);
    };
    const [selectedFile, setSelectedFile] = useState('');
    const handleFileInputChange = (e) => {
        setSelectedFile(e.target.files[0]);
        console.log(selectedFile)

    };
    const popover = (popoverVisibility) => {
        setShowPopover(popoverVisibility);
    }
    const logout = () => {
        removeCookie('token');
        toast.success("Logged out successfully!");
        window.location.href = "/login";
        //handleLogout();
    };

    return (
        <>
            <div className="top-bar">
                <div className="topBar">
                    <div className='top'>
                        <img src={logo} alt="io" width='150px' height='40px' />
                        <div>
                            <a href="/">
                                <button style={{ cursor: 'pointer', backgroundColor: 'rgb(255 255 255 / 15%)' }}><FaHome />Home</button>
                            </a>
                        </div>
                        <div>
                            <OverlayTrigger
                                trigger="click"
                                key='bottom'
                                show={showPopover}
                                placement='bottom'
                                overlay={
                                    <Popover id={`popover-positioned-bottom`}>
                                        <Popover.Body>
                                            <div className='img-job-vide' style={{ flexDirection: 'column', gap: '10px' }}>
                                                <label style={{ backgroundColor: '#f3f3f3', textAlign: 'center', color: 'black', padding: '5px 10px', cursor: 'pointer', borderRadius: '3em' }}>
                                                    <a href="/groups/create" style={{ textDecoration: 'none', color: 'black' }}><HiUserGroup style={{ color: 'ffcf63' }} /> Create Group</a>
                                                </label>
                                                <button style={{ backgroundColor: '#f3f3f3', color: 'black', padding: '5px 10px' }} onClick={() => {
                                                    setShowModal(true);
                                                }}><BiSolidBriefcase style={{ color: 'black' }} />Create Job</button>
                                                {showModal && <JobsInt modalShow={showModal} onHideModal={onHideModal} popover={popover} />}
                                                <label style={{ backgroundColor: '#f3f3f3', textAlign: 'center', color: 'black', padding: '5px 10px', cursor: 'pointer', borderRadius: '3em' }}>
                                                    <a href="/donations/create" style={{ textDecoration: 'none', color: 'black' }}><BsCurrencyRupee style={{ color: 'c8d1da' }} /> Create Donations</a>
                                                </label>
                                                <label style={{ backgroundColor: '#f3f3f3', textAlign: 'center', color: 'black', padding: '5px 10px', cursor: 'pointer', borderRadius: '3em' }}>
                                                    <a href="/sponsorships/create" style={{ textDecoration: 'none', color: 'black' }}><GoSponsorTiers style={{ color: '#d8887d' }} /> Create Sponsorships</a>
                                                </label>
                                            </div>
                                        </Popover.Body>
                                    </Popover>
                                }
                            >
                                <button onClick={() => setShowPopover(!showPopover)} style={{backgroundColor: '#174873'}}><FaPlus />Create</button>
                            </OverlayTrigger>
                        </div>
                    </div>

                    <div className="search">
                        <input type="search" name="search" id="search" placeholder='Search for people,pages and groups' />
                    </div>
                    <div className="profile-list">
                        <LuMessageSquare style={{ cursor: 'pointer', display: 'none' }} onClick={() => {
                            setShowNotifications(false);
                            setShowProfileOptions(false);
                            setShowMessages(!showMessages)
                        }} />
                        {showMessages && (
                            <div className="messages-card">
                                No New Messages
                            </div>
                        )} <div ref={notificationsOptionsRef}>
                            <FaBell style={{ cursor: 'pointer' }} onClick={() => {
                                setShowProfileOptions(false);
                                setShowMessages(false);
                                setShowNotifications(true);
                            }} />
                        </div>
                        {showNotifications && (
                            <div className="notifications-card">

                                <Notifications />
                            </div>
                        )}
                        <img src={profile.profilePicture} alt='Profile' width='40px' height='40px' ref={profileOptionsRef} style={{ borderRadius: '50%', cursor: 'pointer' }} onClick={() => {
                            console.log('clicked image')
                            setShowMessages(false);
                            setShowNotifications(false);
                            setShowProfileOptions(!showProfileOptions);
                        }} />
                        {showProfileOptions && (
                            <ul className="profile-options" >
                                <a href="/profile" style={{ textDecoration: 'none', color: 'black' }}><li>Profile</li></a>
                                <a href="/settings" style={{ textDecoration: 'none', color: 'black' }}><li>Settings</li></a>
                                <li onClick={logout} style={{ cursor: 'pointer' }}><p>Log out</p></li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopBar;