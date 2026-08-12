import { useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import "./Sidebar.css";

const routeMap = {

  "Project Onboarding":
    "/project-onboarding/ProjectOnboarding",

  "Edit Project Onboarding":
    "/project-onboarding/EditProjectOnboarding",

  "Add Meeting":
    "/project-onboarding/add-meeting",
    

  "Dashboard":
    "/project-onboarding/dashboard",

  "Mega Dashboard":
    "/mega-dashboard",

  "GraphicData":
    "/project-onboarding/graphic-data",

  "Financial Year":
    "/masters/financial-year",

  "State":
    "/masters/state",

  "Division":
    "/masters/division",

  "District":
    "/masters/district",

  "Project Department Master":
    "/masters/project-department",

  "List of Value":
    "/masters/list-of-value",

  "Project Stage Master":
    "/masters/project-stage",

  "Assembly Constituency":
    "/masters/assembly",

  "Parliamentary Constituency":
    "/masters/parliamentary",

  "Issue Category And Types":
    "/masters/issue-category",

  "Notifications":
    "/masters/notification",

  "Project Specific ATR":
    "/ATR Details/project-specific-atr",

  "General ATR":
    "/ATR Details/general-atr",

  "User Mapping":
    "/User Management/user-mapping",

  "Edit User Mapping":
    "/User Management/edit-user-mapping",

  "Announcement Entry":
    "/announcement-entry",

  "Add/Update Work Entry":
    "/add-update-work-entry",
};

const menuData = [

  {
    title: "Masters",

    items: [
      "Financial Year",
      "State",
      "Division",
      "District",
      "Project Department Master",
      "List of Value",
      "Project Stage Master",
      "Assembly Constituency",
      "Parliamentary Constituency",
      "Issue Category And Types",
      "Notifications",
    ],
  },

  {
    title: "Project Onboarding",

    items: [
      "Project Onboarding",
      "Edit Project Onboarding",
      "Add Meeting",
      "Dashboard",
      "GraphicData",
    ],
  },
  {
    title: "Mega Dashboard",

    items: [
      "Mega Dashboard",
    ],
  },

  {
    title: "ATR Details",

    items: [
      "Project Specific ATR",
      "General ATR",
    ],
  },

  {
    title: "User Management",

    items: [
      "User Mapping",
      "Edit User Mapping",
    ],
  },

  {
    title: "Announcement Entry",

    items: [
      "Announcement Entry",
    ],
  },

  {
    title:
      "Add/Update Work Entry",

    items: [
      "Add/Update Work Entry",
    ],
  },
];

const Sidebar = ({
  isOpen,
  onClose,
}) => {

  const [
    openSection,
    setOpenSection,
  ] = useState(null);

  const [
    activeItem,
    setActiveItem,
  ] = useState(null);

  const navigate =
    useNavigate();

  // =====================================================
  // HANDLE MENU CLICK
  // =====================================================

  const handleItemClick = (
    item
  ) => {

    // SAVE CURRENT PAGE
    localStorage.setItem(
      "currentPage",
      routeMap[item]
    );

    setActiveItem(item);

    navigate(
      routeMap[item]
    );

    if (
      typeof onClose ===
      "function"
    ) {

      onClose();
    }
  };

  return (

    <aside
      className={`sidebar ${
        isOpen ? "open" : ""
      }`}
    >

      {menuData.map(
        (section) => (

          <div
            className="menu-section"
            key={section.title}
          >

            {/* SECTION TITLE */}

            <div
              className="menu-title"
              onClick={() =>
                setOpenSection(
                  openSection ===
                    section.title
                    ? null
                    : section.title
                )
              }
            >

              {section.title}

              {openSection ===
              section.title ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}

            </div>

            {/* SUB MENU */}

            {openSection ===
              section.title && (

              <ul className="submenu">

                {section.items.map(
                  (item) => (

                    <li
                      key={item}
                      className={
                        activeItem ===
                        item
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        handleItemClick(
                          item
                        )
                      }
                    >

                      {item}

                    </li>
                  )
                )}

              </ul>
            )}

          </div>
        )
      )}

    </aside>
  );
};

export default Sidebar;