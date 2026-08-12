import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login"; // ← fixed import path
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import ApplicationParameters from "./pages/ApplicationParameters";
// Pages
import ProjectOnboarding from "./pages/ProjectOnboarding";

import FinancialYear from "./pages/FinancialYear";
import State from "./pages/State";
import Division from "./pages/Division";
import District from "./pages/District";
import ProjectDepartment from "./pages/ProjectDepartment";
import ListOfValue from "./pages/ListOfValue";
import ProjectStageMaster from "./pages/ProjectStageMaster";
import AssemblyConstituency from "./pages/AssemblyConstituency";
import ParliamentaryConstituency from "./pages/ParliamentaryConstituency";
import IssueCategoryTypes from "./pages/IssueCategoryTypes";
import Notification from "./pages/Notification"; 

import EditProjectOnboarding from "./pages/EditProjectOnboarding";
import FundingPattern from "./pages/FundingPattern";
import AddMeeting from "./pages/AddMeeting";
import ProjectDashboard from "./pages/ProjectDashboard";
import NewIssue from "./pages/NewIssue";
import EditIssue from "./pages/EditIssue";
import EditIssueForm from "./pages/EditIssueForm";
import ViewIssue from "./pages/ViewIssue";
import ProjectImage from "./pages/ProjectImage";
import GraphicData from "./pages/GraphicData";  


import ProjectSpecificATR from "./pages/ProjectSpecificATR";  
import GeneralATR from "./pages/GeneralATR";

import UserMapping from "./pages/UserMapping";
import EditUserMapping from "./pages/EditUserMapping";

import AnnouncementEntry from "./pages/AnnouncementEntry";
import AddUpdateWorkEntry from "./pages/AddUpdateWorkEntry";

import TechnicalIssue from "./pages/TechnicalIssue";

import MegaDashboard from "./pages/MegaDashboard";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogin = () => setLoggedIn(true);

  const handleLogout = () => {
    setLoggedIn(false);
    setIsSidebarOpen(true); // reset sidebar
  };

  if (!loggedIn) return <Login onLogin={handleLogin} />; // show login initially

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar isOpen={isSidebarOpen} />

      <div
        style={{
          flex: 1,
          marginLeft: isSidebarOpen ? "260px" : "0",
          transition: "0.3s",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onLogout={handleLogout} />

        <div style={contentStyle}>
          <Routes>

      <Route path="/" element={<Navigate to="/project-onboarding/ProjectOnboarding" />} />
      

          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/application-parameters" element={<ApplicationParameters />} />

          <Route path="/project-onboarding/ProjectOnboarding" element={<ProjectOnboarding />} />
          <Route path="/project-onboarding/EditProjectOnboarding" element={<EditProjectOnboarding />} />
          <Route path="/project-onboarding/funding-pattern" element={<FundingPattern />} />
          <Route path="/project-onboarding/add-meeting" element={<AddMeeting />} />
          <Route path="/project-onboarding/dashboard" element={<ProjectDashboard />} />
          <Route path="/project-onboarding/edit/:id"element={<EditProjectOnboarding />}/>
          <Route path="/project-onboarding/new-issue" element={<NewIssue />} />
          <Route path="/project-onboarding/edit-issues"element={<EditIssue />}/>
          <Route path="/project-onboarding/edit-issue-form" element={<EditIssueForm />} /> 
          <Route path="/project-onboarding/view-issue" element={<ViewIssue />} />
           <Route path="/project-onboarding/project-images" element={<ProjectImage />} />
          <Route path="/project-onboarding/graphic-data" element={<GraphicData />} />
         
          <Route path="/mega-dashboard" element={<MegaDashboard />}/>

          <Route path="/masters/financial-year" element={<FinancialYear />} />
          <Route path="/masters/state" element={<State />} />
          <Route path="/masters/division" element={<Division />} />
          <Route path="/masters/district" element={<District />} />
          <Route path="/masters/project-department" element={<ProjectDepartment />} />
          <Route path="/masters/list-of-value" element={<ListOfValue />} />
          <Route path="/masters/project-stage" element={<ProjectStageMaster />} />
          <Route path="/masters/assembly" element={<AssemblyConstituency />} />
          <Route path="/masters/parliamentary" element={<ParliamentaryConstituency />} />
          <Route path="/masters/issue-category" element={<IssueCategoryTypes />} />
          <Route path="/masters/notification" element={<Notification />} />

          <Route path="/ATR Details/project-specific-atr" element={<ProjectSpecificATR />} />
          <Route path="/ATR Details/general-atr" element={<GeneralATR />} />

          <Route path="/User Management/user-mapping" element={<UserMapping />} />
          <Route path="/User Management/edit-user-mapping" element={<EditUserMapping />} />

          <Route path="/announcement-entry" element={<AnnouncementEntry />} />
          <Route path="/add-update-work-entry" element={<AddUpdateWorkEntry />} />
          <Route path="/technical-issue" element={<TechnicalIssue />} />

        </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;

const navbarHeight = 80; // matches Navbar.css

const contentStyle = {
  padding: "20px",
  marginTop: `${navbarHeight}px`,
  flex: 1,
  overflowY: "auto",
};