import React, { useEffect, useState } from "react";
import axios from "axios";
import "./pages.css";

const ProjectSpecificATR = () => {

  /* =====================================================
      INITIAL STATE
  ===================================================== */

  const initialState = {
    meetingId: "",
    meetingTitle: "",
    meetingName: "",
    meetingDate: "",

    projectId: "",
    projectName: "",

    financialYear: "",

    status: "",
    concernDept: "",
    directionGiven: "",
    adminResponse: "",
  };

  const [formData, setFormData] = useState(initialState);


  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  /* =====================================================
      MASTER STATES
  ===================================================== */

  const [meetings, setMeetings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  /* =====================================================
      LOAD MASTER DATA
  ===================================================== */

  useEffect(() => {

    fetchMeetings();
    fetchProjects();
    fetchDepartments();

  }, []);

  /* =====================================================
      FETCH MEETINGS
  ===================================================== */

  const fetchMeetings = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/project-specific-atr/meetings"
      );

      console.log("Meetings:", res.data);

      setMeetings(res.data);

    } catch (err) {

      console.error("Meeting Fetch Error:", err);
    }
  };

  /* =====================================================
      FETCH PROJECTS
  ===================================================== */

  const fetchProjects = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/project-specific-atr/projects"
      );

      console.log("Projects:", res.data);

      setProjects(res.data);

    } catch (err) {

      console.error("Project Fetch Error:", err);
    }
  };

  /* =====================================================
      FETCH DEPARTMENTS
  ===================================================== */

  const fetchDepartments = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/project-specific-atr/departments"
      );

      console.log("Departments:", res.data);

      setDepartments(res.data);

    } catch (err) {

      console.error("Department Fetch Error:", err);
    }
  };

  /* =====================================================
    HANDLE MEETING SELECT
===================================================== */

const handleMeetingSelect = (meetingHeaderId) => {

  console.log("Selected Meeting:", meetingHeaderId);

  const selectedMeeting = meetings.find(
    (m) =>
      String(m.MST_MEETHDRID) ===
      String(meetingHeaderId)
  );

  console.log("Matched Meeting:", selectedMeeting);

  if (!selectedMeeting) return;

  setFormData((prev) => ({

    ...prev,

    // dropdown selected value
    meetingTitle:
      selectedMeeting.MST_MEETHDRID,

    // actual meeting id
    meetingId:
      selectedMeeting.MEETINGID || "",

    // actual title string
    meetingName:
      selectedMeeting.MEETINGTITLE || "",

    // date
    meetingDate:
      selectedMeeting.MEETINGDT
        ? selectedMeeting.MEETINGDT
            .split("T")[0]
        : "",

  }));
};
    /* =====================================================
            HANDLE PROJECT SELECT
        ===================================================== */

        const handleProjectSelect = (projectName) => {

          console.log("Selected:", projectName);

          const selectedProject = projects.find(
            (p) => String(p.PRJ_NAME).trim() === String(projectName).trim()
          );

          console.log("Matched Project:", selectedProject);

          if (!selectedProject) return;

          setFormData((prev) => ({

            ...prev,

            // NOW READ PROJECTID
            projectId:
              selectedProject.PROJECTID
                ? String(selectedProject.PROJECTID)
                : "",

            projectName:
              selectedProject.PRJ_NAME || "",

            financialYear:
              selectedProject.FINYR || "",

          }));
        };
        
    /* =====================================================
        HANDLE CHANGE
    ===================================================== */

    const handleChange = (e) => {

      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

  /* =====================================================
      VALIDATION
  ===================================================== */

  const validateForm = () => {

    let newErrors = {};

    if (!formData.meetingId) {
      newErrors.meetingId = "Meeting is required";
    }

    if (!formData.projectId) {
      newErrors.projectId = "Project is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (!formData.concernDept) {
      newErrors.concernDept =
        "Concern Department is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =====================================================
      SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    try {

      const payload = {

        meetingId: formData.meetingId,

        meetingTitle: formData.meetingName,

        meetingDate: formData.meetingDate,

        projectId: formData.projectId,

        projectName: formData.projectName,

        financialYear: formData.financialYear,

        directionGiven: formData.directionGiven,

        adminResponse: formData.adminResponse,

        status: formData.status,

        concernDept: formData.concernDept,
      };

      console.log("Submitting Payload:", payload);

      const res = await axios.post(
        "http://localhost:5000/api/project-specific-atr/save",
        payload
      );

      console.log("Save Response:", res.data);

      if (res.data.success) {

        setShowSuccess(true);
      }

    } catch (err) {

      console.error("Submit Error:", err);

      alert("Error saving ATR");
    }
  };

  /* =====================================================
      RESET FORM
  ===================================================== */

  const handleNew = () => {

    setFormData(initialState);

    setErrors({});

    setShowSuccess(false);
  };

  return (

    <div className="page-container">

      <div className="page-header">
        <span>Project Specific ATR</span>
      </div>

      <form
        className="page-form"
        onSubmit={handleSubmit}
      >

        {/* =====================================================
            MEETING DETAILS
        ===================================================== */}

        <div className="form-grid">

          {/* MEETING TITLE */}

          <div className="form-group">

            <label>Meeting Title</label>

            <select
              value={formData.meetingTitle}
              onChange={(e) =>
                handleMeetingSelect(e.target.value)
              }
            >

              <option value="">
                Select Meeting
              </option>

              {meetings.map((meeting) => (

                <option
                  key={meeting.MST_MEETHDRID}
                  value={meeting.MST_MEETHDRID}
                >
                  {meeting.MEETINGTITLE}
                </option>

              ))}

            </select>

          </div>

          {/* MEETING ID */}

          <div className="form-group">

            <label>Meeting ID</label>

            <input
              type="text"
              value={formData.meetingId}
              disabled
            />

            {errors.meetingId && (
              <span className="error-text">
                {errors.meetingId}
              </span>
            )}

          </div>

          {/* MEETING DATE */}

          <div className="form-group">

            <label>Meeting Date</label>

            <input
              type="date"
              value={formData.meetingDate}
              disabled
            />

          </div>

        </div>

        {/* =====================================================
            PROJECT DETAILS
        ===================================================== */}

        <div className="form-grid">

          {/* PROJECT NAME */}

        <div className="form-group">

          <label>Project Name</label>

          <select
            value={formData.projectName}
            onChange={(e) =>
              handleProjectSelect(e.target.value)
            }
          >

            <option value="">
              Select Project
            </option>

            {projects.map((project) => (

              <option
                key={project.PROJECTID}
                value={project.PRJ_NAME}
              >
                {project.PRJ_NAME}
              </option>

            ))}

          </select>

          {errors.projectId && (
            <span className="error-text">
              {errors.projectId}
            </span>
          )}

        </div>

          

          {/* PROJECT ID */}

          <div className="form-group">

            <label>Project ID</label>

            <input
              type="text"
              value={formData.projectId}
              disabled
            />

          </div>

          {/* FINANCIAL YEAR */}

          <div className="form-group">

            <label>Financial Year</label>

            <input
              type="text"
              value={formData.financialYear}
              disabled
            />

          </div>

        </div>
          {/* =====================================================
              DIRECTION GIVEN
          ===================================================== */}

          <div className="form-group full-width">

            <label>
              Direction Given in Meeting
            </label>

            <textarea
            name="directionGiven"
            value={formData.directionGiven}
            onChange={handleChange}
            rows="5"
            placeholder="Enter Direction Given"
          />

          </div>
        

        {/* =====================================================
              ADMIN RESPONSE
          ===================================================== */}

          <div className="form-group full-width">

            <label>
              Response by Administrative Department
            </label>

            <textarea
            name="adminResponse"
            value={formData.adminResponse}
            onChange={handleChange}
            rows="5"
            placeholder="Enter Administrative Response"
          />

          </div>
       {/* =====================================================
            STATUS + DEPARTMENT
        ===================================================== */}

        <div className="form-grid">

          {/* STATUS */}

          <div className="form-group">

            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >

              <option value="">
                Select Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

            {errors.status && (
              <span className="error-text">
                {errors.status}
              </span>
            )}

          </div>

          {/* CONCERN DEPARTMENT */}

          <div className="form-group">

            <label>
              Concern Department
            </label>

            <select
              name="concernDept"
              value={formData.concernDept}
              onChange={handleChange}
            >

              <option value="">
                Select Department
              </option>

              {departments.map((dept, index) => (

              <option
                key={`${dept.DEPTNAME}-${index}`}
                value={dept.DEPTNAME}
              >
                {dept.DEPTNAME}
              </option>

            ))}

            </select>

            {errors.concernDept && (
              <span className="error-text">
                {errors.concernDept}
              </span>
            )}

          </div>

        </div>

        {/* =====================================================
            SUCCESS POPUP
        ===================================================== */}

        {showSuccess && (

          <div className="popup-overlay">

            <div className="popup-box">

              <h3>Success</h3>

              <p>
                Project Specific ATR saved successfully.
              </p>

              <button
                type="button"
                className="btn submit"
                onClick={() => {

                  setShowSuccess(false);

                  handleNew();
                }}
              >
                OK
              </button>

            </div>

          </div>

        )}

        {/* =====================================================
            ACTION BUTTONS
        ===================================================== */}

        <div className="form-actions">

          <button
            type="button"
            className="btn new"
            onClick={handleNew}
          >
            New
          </button>

          <button
            type="submit"
            className="btn submit"
          >
            Save
          </button>

        </div>

      </form>

    </div>
  );
};

export default ProjectSpecificATR;