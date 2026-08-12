import React, { useEffect, useState } from "react";
import axios from "axios";
import "./pages.css";

const GeneralATR = () => {

  /* =====================================================
      INITIAL STATE
  ===================================================== */

  const initialState = {
    meetingId: "",
    meetingTitle: "",
    meetingDate: "",
    selectedMeetingHeaderId: "",
    departmentName: "",

    directionGiven: "",
    adminResponse: "",

    status: "",
  };

  const [formData, setFormData] = useState(initialState);

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  /* =====================================================
      MASTER DATA
  ===================================================== */

  const [meetings, setMeetings] = useState([]);
  const [departments, setDepartments] = useState([]);

  /* =====================================================
      LOAD DATA
  ===================================================== */

  useEffect(() => {

    fetchMeetings();
    fetchDepartments();

  }, []);

  /* =====================================================
      FETCH MEETINGS
  ===================================================== */

  const fetchMeetings = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/general-atr/meetings"
      );

      console.log("Meetings:", res.data);

      setMeetings(res.data);

    } catch (err) {

      console.error("Meeting Fetch Error:", err);
    }
  };

  /* =====================================================
      FETCH DEPARTMENTS
  ===================================================== */

  const fetchDepartments = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/general-atr/departments"
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

  const selectedMeeting = meetings.find(
    (m) =>
      String(m.MST_MEETHDRID) ===
      String(meetingHeaderId)
  );

  console.log("Selected Meeting:", selectedMeeting);

  if (!selectedMeeting) return;

  setFormData((prev) => ({

    ...prev,

    // THIS FIXES DROPDOWN SELECT VALUE
    selectedMeetingHeaderId: meetingHeaderId,

    meetingTitle:
      selectedMeeting.MEETINGTITLE || "",

    meetingId:
      selectedMeeting.MEETINGID || "",

    meetingDate:
      selectedMeeting.MEETINGDT
        ? selectedMeeting.MEETINGDT.split("T")[0]
        : "",

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
      newErrors.meetingId =
        "Meeting ID is required";
    }

    if (!formData.meetingTitle) {
      newErrors.meetingTitle =
        "Meeting Title is required";
    }

    if (!formData.meetingDate) {
      newErrors.meetingDate =
        "Meeting Date is required";
    }

    if (!formData.departmentName) {
      newErrors.departmentName =
        "Department is required";
    }

    if (!formData.directionGiven.trim()) {
      newErrors.directionGiven =
        "Direction is required";
    }

    if (!formData.adminResponse.trim()) {
      newErrors.adminResponse =
        "Response is required";
    }

    if (!formData.status) {
      newErrors.status =
        "Status is required";
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

        meetingTitle: formData.meetingTitle,

        meetingDate: formData.meetingDate,

        departmentName: formData.departmentName,
        
        directionGiven: formData.directionGiven,

        adminResponse: formData.adminResponse,

        status: formData.status,
      };

      console.log("Submitting Payload:", payload);

      const res = await axios.post(
        "http://localhost:5000/api/general-atr/save",
        payload
      );

      console.log("Save Response:", res.data);

      if (res.data.success) {

        setShowSuccess(true);
      }

    } catch (err) {

      console.error("Submit Error:", err);

      alert("Error saving General ATR");
    }
  };

  /* =====================================================
      RESET
  ===================================================== */

  const handleReset = () => {

    setFormData(initialState);

    setErrors({});

    setShowSuccess(false);
  };

  return (

    <div className="page-container">

      {/* HEADER */}

      <div className="page-header">
        <span>General ATR</span>
      </div>

      {/* FORM */}

      <form
        className="page-form"
        onSubmit={handleSubmit}
      >

        {/* =====================================================
            TOP GRID
        ===================================================== */}

        <div className="form-grid">

          {/* MEETING ID */}
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
          

          {/* MEETING TITLE */}

  <div className="form-group">

  <label>Meeting Title</label>

  <select
    value={formData.selectedMeetingHeaderId}
    onChange={(e) =>
      handleMeetingSelect(e.target.value)
    }
  >

    <option value="">
      Select option
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

      {errors.meetingTitle && (
        <span className="error-text">
          {errors.meetingTitle}
        </span>
      )}

    </div>

          {/* MEETING DATE */}

          <div className="form-group">

            <label>Meeting Date</label>

            <input
              type="date"
              name="meetingDate"
              value={formData.meetingDate}
              disabled
            />

            {errors.meetingDate && (
              <span className="error-text">
                {errors.meetingDate}
              </span>
            )}

          </div>

          {/* DEPARTMENT */}

          <div className="form-group">

            <label>Department Name</label>

            <select
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
            >

              <option value="">
                Select option
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

            {errors.departmentName && (
              <span className="error-text">
                {errors.departmentName}
              </span>
            )}

          </div>

        </div>

        {/* =====================================================
            DIRECTION
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
            placeholder="Enter direction given"
          />

          {errors.directionGiven && (
            <span className="error-text">
              {errors.directionGiven}
            </span>
          )}

        </div>

        {/* =====================================================
            RESPONSE
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
            placeholder="Enter response"
          />

          {errors.adminResponse && (
            <span className="error-text">
              {errors.adminResponse}
            </span>
          )}

        </div>

        {/* =====================================================
            STATUS
        ===================================================== */}

        <div className="form-grid">

          <div className="form-group">

            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >

              <option value="">
                Select option
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

        </div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="form-actions">

          <button
            type="submit"
            className="btn submit"
          >
            Submit
          </button>

          <button
            type="button"
            className="btn new"
            onClick={handleReset}
          >
            New
          </button>

        </div>

      </form>

      {/* =====================================================
          SUCCESS POPUP
      ===================================================== */}

      {showSuccess && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h3>Success</h3>

            <p>
              General ATR submitted successfully.
            </p>

            <button
                className="btn submit"
                onClick={() => {
                  setShowSuccess(false);
                  setFormData(initialState);
                  setErrors({});
                }}
              >
                OK
              </button>
          </div>

        </div>

      )}

    </div>
  );
};

export default GeneralATR;