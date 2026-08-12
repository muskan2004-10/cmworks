import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./pages.css";

const ViewIssue = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const projectId = location.state?.projectId;

  // ================= DATE FORMAT =================
  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);
    if (isNaN(d)) return "-";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // ================= FETCH =================
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);

        if (!projectId) {
          setIssues([]);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/viewissues/by-project/${projectId}`
        );

        const data = res.data || [];

        const sorted = data.sort(
          (a, b) =>
            Number(a.PD_ISSUEHDRID || 0) -
            Number(b.PD_ISSUEHDRID || 0)
        );

        setIssues(sorted);

      } catch (error) {
        console.log("Issue Fetch Error:", error);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [projectId]);

  // ================= LOADING =================
  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div className="page-container">

      <div className="page-header">
        View Issues
      </div>

      <div className="form-card">

        {/* TABLE */}
        <div className="form-body">

          {issues.length === 0 ? (
            <p>No Issues Found</p>
          ) : (
            <table className="custom-table">

              <thead>
                <tr>
                  <th>Issue No</th>
                  <th>Project ID</th>
                  <th>Issue Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue, index) => (
                  <tr key={issue.PD_ISSUEHDRID}>

                    <td>{index + 1}</td>
                    <td>{issue.PROJECTID || "-"}</td>
                    <td>{formatDate(issue.ISSUEDT)}</td>
                    <td>{issue.ISSUECAT || "-"}</td>
                    <td>{issue.ISSUETYP || "-"}</td>
                    <td>{issue.ISS_STATUS || "-"}</td>
                    <td>{issue.ISSUEDESC || "-"}</td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>

        {/* ✅ FIXED BUTTON ALIGNMENT */}
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

export default ViewIssue;