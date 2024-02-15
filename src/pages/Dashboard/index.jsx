import { Route, Routes } from "react-router-dom";
import LeftSidebar from "../../components/left-sidebar";
import TopBar from "../../components/topbar";
import SocialMediaPost from "../../components/Social-wall-post";
import SideWidgets from "../../components/SideWidgets";
import Groups from "../Groups";
import Donations from "../Donations";
import Sponsorships from "../Sponsorships";
import Settings from "../Settings";
import ProfilePage from "../ProfilePage";
import Members from '../Members';
import Profile from '../Profile';
import Events from "../Events";
import Jobs from "../Jobs";
import IndividualJobPost from "../Jobs/IndividualJobPost.jsx";
import Internships from "../Internships";
import News from "../News/index.jsx";
import Forum from "../Forum";
import CreateForum from "../../components/Forum/CreateForum";
import IForum from "../../components/Forum/IForum";
import Chatbox from "../../components/Chatbox"
import { ProfileSettings } from "../ProfilePage/ProfileSettings/index.jsx";
import { Following } from "../../components/Following/index.jsx";
import { Followers } from "../../components/Followers/index.jsx";
import IndividualGroup from "../../components/Groups/IndividualGroup/index.jsx";
import Chat from "../../pages/Chat";
import { WorkExperience } from "../../components/WorkExperience/index.jsx";
import { Archive } from "../Jobs/Archive/index.jsx";
const Dashboard = ({handleLogout}) => {
  return (
    <>
      <TopBar handleLogout={handleLogout}/>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <LeftSidebar />
        <Routes>
          
          <Route path="/groups/*" element={<Groups />} />
          {/* <Route path="/groups/:_id/*" element={<IndividualGroup />} /> */}
          <Route
            path="/"
            element={
              <div
                style={{
                  display: "flex",
                  gap: "2vw",
                  marginLeft: "40px",
                  paddingTop: "20px",
                  width: "55%",
                }}
              >
                <div style={{ width: "65%" }}>
                  <SocialMediaPost showCreatePost={true}/>
                </div>
                <SideWidgets/>
              </div>
            }
          />
          <Route path="/donations/*" element={<Donations />} />
          <Route path="/sponsorships/*" element={<Sponsorships />} />
          <Route path="/members/*" element={<div style={{width: '60%'}}><Members showHeading={true}/></div>} />
          <Route path="/members/:id" element={<Profile />} />
          <Route path="/profile/*" element={<ProfilePage />} />
          <Route path="/events/*" element={<Events />} />
          <Route path="/chat/*" element={<Chat />} />
          <Route path="/jobs/*" element={<Jobs />} />
          <Route path="/internships/*" element={<Internships />} />
          <Route path="/settings/*" element={<Settings />} />
          <Route path="/jobs/:_id/:title" element={<IndividualJobPost />}/>
          <Route path="/internships/:_id/:title" element={<IndividualJobPost />}/>
          <Route path="/forums/*" element={<Forum />} />
          <Route path="/forums/create" element={<CreateForum />} />
          <Route path="/forums/:id" element={<IForum />} />
          <Route path="/profile/following" element={<Following />} />
          <Route path="/profile/followers" element={<Followers />} />
          <Route path="/profile/workExperience" element={<WorkExperience />} />
          <Route path="/profile/profile-settings" element={<ProfileSettings />} />
          {/* <Route path="/socialWall/*" element={
              <div
                style={{
                  display: "flex",
                  gap: "2vw",
                  marginLeft: "40px",
                  paddingTop: "20px",
                  width: "55%",
                }}
              >
                <div style={{ width: "65%" }}>
                  <SocialMediaPost showCreatePost={true}/>
                </div>
              </div>
            }
          /> */}
          <Route path="/news/*" element={
              <div
                style={{
                  display: "flex",
                  gap: "2vw",
                  marginLeft: "40px",
                  paddingTop: "20px",
                  width: "55%",
                }}
              >
                <div style={{ width: "65%" }}>
                  <News/>
                </div>
                <SideWidgets />
              </div>
            }
          />
        </Routes>
        <Chatbox/>
      </div>
    </>
  );
};

export default Dashboard;
