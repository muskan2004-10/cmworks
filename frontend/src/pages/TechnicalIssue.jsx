// TechnicalIssue.jsx

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";

const TechnicalIssue = () => {

  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [reportForm, setReportForm] =
    useState("");

  const [relatedIssue, setRelatedIssue] =
    useState("");

  const [
    issueDescription,
    setIssueDescription,
  ] = useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [ticketNo, setTicketNo] =
    useState("");

  const [ticketId, setTicketId] =
    useState("");

  const [showSuccess, setShowSuccess] =
    useState(false);

  const fileInputRef = useRef(null);

  // =====================================================
  // FETCH NEXT TICKET
  // =====================================================

  useEffect(() => {
    fetchNextTicket();
  }, []);

  const fetchNextTicket = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/technical-issue/next-ticket"
      );

      setTicketNo(res.data.ticketNo);

      setTicketId(res.data.newId);

    } catch (error) {

      console.log(error);
    }
  };

  // =====================================================
  // AUTO FILL REPORT FORM
  // =====================================================

  useEffect(() => {

    let currentPage =
      location.state?.fromPage;

    if (!currentPage) {

      currentPage =
        localStorage.getItem(
          "currentPage"
        );
    }

    console.log(
      "CURRENT PAGE:",
      currentPage
    );

    const routeNames = {

      "/project-onboarding/ProjectOnboarding":
        "Project Onboarding",

      "/project-onboarding/EditProjectOnboarding":
        "Edit Project Onboarding",

      "/project-onboarding/dashboard":
        "Dashboard",

      "/project-onboarding/add-meeting":
        "Add Meeting",

      "/project-onboarding/funding-pattern":
        "Funding Pattern",

      "/project-onboarding/graphic-data":
        "Graphic Data",

      "/project-onboarding/new-issue":
        "New Issue",

      "/project-onboarding/view-issue":
        "View Issue",

      "/project-onboarding/project-images":
        "Project Image",

      "/masters/financial-year":
        "Financial Year",

      "/masters/state":
        "State",

      "/masters/division":
        "Division",

      "/masters/district":
        "District",

      "/masters/project-department":
        "Project Department",

      "/masters/list-of-value":
        "List Of Value",

      "/masters/project-stage":
        "Project Stage",

      "/masters/assembly":
        "Assembly Constituency",

      "/masters/parliamentary":
        "Parliamentary Constituency",

      "/masters/issue-category":
        "Issue Category",

      "/masters/notification":
        "Notification",

      "/ATR Details/project-specific-atr":
        "Project Specific ATR",

      "/ATR Details/general-atr":
        "General ATR",

      "/User Management/user-mapping":
        "User Mapping",

      "/User Management/edit-user-mapping":
        "Edit User Mapping",

      "/announcement-entry":
        "Announcement Entry",

      "/add-update-work-entry":
        "Add/Update Work Entry",
    };

    setReportForm(
      routeNames[currentPage] ||
      "Unknown Page"
    );

  }, [location]);

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async () => {

    if (!relatedIssue) {

      alert(
        "Please select related issue"
      );

      return;
    }

    if (
      !issueDescription.trim()
    ) {

      alert(
        "Please enter issue description"
      );

      return;
    }

    try {

      const formData =
        new FormData();

      formData.append(
        "TECHISSUESID",
        ticketId
      );

      formData.append(
        "TICKENO",
        ticketNo
      );

      formData.append(
        "RELATEDISSUE",
        relatedIssue
      );

      formData.append(
        "REPORTFORMNAME",
        reportForm
      );

      formData.append(
        "ISSUEDESCRIPTION",
        issueDescription
      );

      formData.append(
        "STATUS",
        "Pending"
      );

      formData.append(
        "DEPTNAME",
        "ALL"
      );

      formData.append(
        "USERNAME",
        "ADMIN"
      );

      formData.append(
        "CREATEDBY",
        "ADMIN"
      );

      formData.append(
        "ISSTYPE",
        "Technical"
      );

      if (selectedFile) {

        formData.append(
          "file",
          selectedFile
        );
      }

      const response =
        await axios.post(
          "http://localhost:5000/api/technical-issue/create",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      setTicketNo(
        response.data.ticketNo
      );

      setShowSuccess(true);

      handleNew();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Error submitting issue"
      );
    }
  };

  // =====================================================
  // NEW BUTTON
  // =====================================================

  const handleNew = () => {

    fetchNextTicket();

    setRelatedIssue("");

    setIssueDescription("");

    setSelectedFile(null);

    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";
    }
  };

  // =====================================================
  // RETURN BUTTON
  // =====================================================

  const handleReturn = () => {

    const previousPage =
      localStorage.getItem(
        "currentPage"
      );

    if (previousPage) {

      navigate(previousPage);

    } else {

      navigate(
        "/project-onboarding/ProjectOnboarding"
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="page-container">

      <div className="page-header">
        Technical Issue
      </div>

      <div className="page-form">

        <div className="form-grid">

          {/* TICKET */}

          <div className="form-group">

            <label>
              Ticket No
            </label>

            <input
              value={ticketNo}
              readOnly
            />

          </div>

          {/* RELATED ISSUE */}

          <div className="form-group">

            <label>
              Related Issue
            </label>

            <select
              value={relatedIssue}
              onChange={(e) =>
                setRelatedIssue(
                  e.target.value
                )
              }
            >

              <option value="">
                -- Select --
              </option>

              <option value="UI Issue">
                UI Issue
              </option>

              <option value="Validation Error">
                Validation Error
              </option>

              <option value="Data Not Saving">
                Data Not Saving
              </option>

              <option value="Page Crash">
                Page Crash
              </option>

              <option value="Slow Performance">
                Slow Performance
              </option>

              <option value="File Upload Error">
                File Upload Error
              </option>

              <option value="Incorrect Data">
                Incorrect Data
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* REPORT FORM */}

          <div className="form-group full-width">

            <label>
              Report Form
            </label>

            <input
              value={reportForm}
              readOnly
            />

          </div>

          {/* DESCRIPTION */}

          <div className="form-group full-width">

            <label>
              Issue Description
            </label>

            <textarea
              rows="5"
              value={
                issueDescription
              }
              onChange={(e) =>
                setIssueDescription(
                  e.target.value
                )
              }
            />

          </div>

          {/* FILE */}

          <div className="form-group full-width">

            <label>
              Attach File
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) =>
                setSelectedFile(
                  e.target.files[0]
                )
              }
            />

          </div>

        </div>

        {/* BUTTONS */}

        <div
          className="form-actions"
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >

          <button
            className="btn new"
            onClick={handleReturn}
          >
            ← Return
          </button>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >

            <button
              className="btn new"
              onClick={handleNew}
            >
              New
            </button>

            <button
              className="btn submit"
              onClick={handleSubmit}
            >
              Submit
            </button>

          </div>

        </div>

      </div>

      {/* SUCCESS POPUP */}

      {showSuccess && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h3>
              Success
            </h3>

            <p>
              Technical Issue Submitted Successfully
            </p>

            <h4>
              {ticketNo}
            </h4>

            <button
              className="btn submit"
              onClick={() =>
                setShowSuccess(false)
              }
            >
              OK
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default TechnicalIssue;