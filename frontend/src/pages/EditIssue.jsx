// ===============================
// FILE: src/pages/EditIssue.jsx
// ===============================

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./pages.css";

const EditIssue = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // SAFE ACCESS
  const projectId = location.state?.projectId || "";
  const projectName = location.state?.projectName || "";
  const fullData = location.state?.fullData || {};

  // ============================
  // REDIRECT IF NO PROJECT ID
  // ============================

  useEffect(() => {
    if (!projectId) {
      navigate("/project-onboarding/dashboard");
    }
  }, [projectId, navigate]);

  // ============================
  // DATE FORMAT
  // ============================

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (isNaN(d)) return "-";

    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  // ============================
  // FETCH ISSUES
  // ============================

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);

        console.log("FETCH PROJECT ID =", projectId);

        const res = await axios.get(
          `http://localhost:5000/api/viewissues/by-project/${projectId}`
        );

        console.log("ISSUES =", res.data);

        const data = res.data || [];

        const sorted = data.sort(
          (a, b) =>
            Number(a.PD_ISSUEHDRID || 0) -
            Number(b.PD_ISSUEHDRID || 0)
        );

        setIssues(sorted);
      } catch (err) {
        console.log("FETCH ERROR =", err);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchIssues();
    }
  }, [projectId]);

  // ============================
  // EDIT NAVIGATION
  // ============================

  const handleEdit = (issue) => {
    console.log("EDIT ISSUE =", issue);

    navigate("/project-onboarding/edit-issue-form", {
      state: {
        issue,
        projectId,
        projectName,
        fullData,
      },
    });
  };

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="page-container">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  // ============================
  // UI
  // ============================

  return (
    <div className="page-container">
      <div className="page-header">Edit Issues</div>

      <div className="form-card">
        <div className="form-body">
          {issues.length === 0 ? (
            <p>No Issues Found</p>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Project ID</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue, index) => (
                  <tr key={issue.PD_ISSUEHDRID}>
                    <td>{index + 1}</td>

                    <td>{issue.PROJECTID}</td>

                    <td>{formatDate(issue.ISSUEDT)}</td>

                    <td>{issue.ISSUECAT}</td>

                    <td>{issue.ISSUETYP}</td>

                    <td>{issue.ISS_STATUS}</td>

                    <td>{issue.ISSUEDESC}</td>

                    <td>
                      <button
                        className="btn submit small"
                        onClick={() => handleEdit(issue)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* BUTTONS */}

        <div className="form-actions align-left">
          <button
            className="btn cancel"
            onClick={() =>
              navigate("/project-onboarding/dashboard")
            }
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditIssue;