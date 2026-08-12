import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaBars, FaBell, FaUserCircle, FaSearch, FaBug } from "react-icons/fa";

const Navbar = ({ toggleSidebar, onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  return (
    <header className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <span className="nav-title">CM - Works Management System</span>
      </div>

      {/* CENTER SEARCH */}
      <div className="navbar-center">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search..." />
      </div>

      {/* RIGHT ICONS */}
      <div className="navbar-right">
        <button className="icon-btn" title="Notifications">
          <FaBell />
        </button>

        <button
          className="icon-btn"
          title="Technical Issue"
          onClick={() => navigate("/technical-issue")}
      >
    <FaBug />
  </button>

  


        {/* PROFILE */}
        <div className="profile-wrapper" ref={profileRef}>
          <button
            className="icon-btn"
            title="Profile"
            onClick={() => setShowProfile((prev) => !prev)}
          >
            <FaUserCircle />
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar">M</div>
                <div>
                  <div className="profile-name">Admin</div>
                  <div className="profile-login">
                    Last Login: 12-01-2026 15:10:45
                  </div>
                </div>
              </div>

              <ul className="profile-menu">
                <li onClick={() => navigate("/application-parameters")}>
                  Application Parameters
                </li>

                <li onClick={() => navigate("/about")}>
                  About
                </li>

                <li onClick={() => navigate("/reset-password")}>
                  Reset Password
                </li>

                <li className="logout" onClick={onLogout}>
                  Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
