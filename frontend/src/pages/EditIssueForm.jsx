// =====================================
// FILE: src/pages/EditIssueForm.jsx
// =====================================

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./pages.css";

const EditIssueForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    issueId: "",
    projectId: "",
    projectName: "",
    issueDate: "",
    issueCategory: "",
    issueType: "",
    description: "",
    status: "",
  });

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [allData, setAllData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ===============================
  // REDIRECT IF NO STATE
  // ===============================

  useEffect(() => {
    if (!location.state?.issue) {
      navigate("/project-onboarding/dashboard");
    }
  }, [location, navigate]);

  // ===============================
  // AUTO FILL
  // ===============================

  useEffect(() => {
    const issue = location.state?.issue;

    if (issue) {
      console.log("RECEIVED ISSUE =", issue);

      setForm({
        issueId: issue.PD_ISSUEHDRID || "",
        projectId: issue.PROJECTID || "",
        projectName: location.state?.projectName || "",
        issueDate: issue.ISSUEDT
          ? issue.ISSUEDT.split("T")[0]
          : "",
        issueCategory: issue.ISSUECAT || "",
        issueType: issue.ISSUETYP || "",
        description: issue.ISSUEDESC || "",
        status: issue.ISS_STATUS || "",
      });
    }
  }, [location]);

  // ===============================
  // LOAD MASTER
  // ===============================

  useEffect(() => {
    loadMaster();
  }, []);

  const loadMaster = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/issue-category/list"
      );

      console.log("CATEGORY MASTER =", res.data);

      const data = res.data || [];

      setAllData(data);

      const uniqueCats = [
        ...new Set(
          data
            .map((i) => i.CATNAME)
            .filter((v) => v && v.trim() !== "")
        ),
      ];

      setCategories(uniqueCats);
    } catch (err) {
      console.log("CATEGORY ERROR =", err);
    }
  };

  // ===============================
  // AUTO LOAD TYPES
  // ===============================

  useEffect(() => {
    if (form.issueCategory && allData.length > 0) {
      const filtered = allData.filter(
        (i) =>
          i.CATNAME &&
          i.CATNAME.toLowerCase().trim() ===
            form.issueCategory.toLowerCase().trim()
      );

      const uniqueTypes = [
        ...new Set(
          filtered
            .map((i) => i.SUBCATNAME)
            .filter((v) => v && v.trim() !== "")
        ),
      ];

      setTypes(uniqueTypes);
    }
  }, [form.issueCategory, allData]);

  // ===============================
  // INPUT CHANGE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // ===============================
  // CATEGORY CHANGE
  // ===============================

  const handleCategoryChange = (e) => {
    const selected = e.target.value;

    const filtered = allData.filter(
      (i) =>
        i.CATNAME &&
        i.CATNAME.toLowerCase().trim() ===
          selected.toLowerCase().trim()
    );

    const uniqueTypes = [
      ...new Set(
        filtered
          .map((i) => i.SUBCATNAME)
          .filter((v) => v && v.trim() !== "")
      ),
    ];

    setTypes(uniqueTypes);

    setForm({
      ...form,
      issueCategory: selected,
      issueType: "",
    });
  };

  // ===============================
  // UPDATE ISSUE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      console.log("UPDATE DATA =", form);

      await axios.put(
        `http://localhost:5000/api/newissue/update/${form.issueId}`,
        {
          issueDate: form.issueDate,
          issueCategory: form.issueCategory,
          issueType: form.issueType,
          description: form.description,
          status: form.status,
        }
      );

      setShowSuccess(true);
    } catch (err) {
      console.log("UPDATE ERROR =", err);

      alert(
        err.response?.data?.error ||
          "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UI
  // ===============================

  return (
    <div className="page-container">
      <div className="page-header">
        Edit Issue
      </div>

      <form
        className="page-form"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">

          {/* PROJECT ID */}

          <div className="form-group">
            <label>Project ID</label>

            <input
              value={form.projectId}
              readOnly
            />
          </div>

          {/* PROJECT NAME */}

          <div className="form-group">
            <label>Project Name</label>

            <input
              value={form.projectName}
              readOnly
            />
          </div>

          {/* ISSUE DATE */}

          <div className="form-group">
            <label>Issue Date</label>

            <input
              type="date"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
            />
          </div>

          {/* ISSUE CATEGORY */}

          <div className="form-group">
            <label>Issue Category</label>

            <select
              name="issueCategory"
              value={form.issueCategory}
              onChange={handleCategoryChange}
            >
              <option value="">
                Select
              </option>

              {categories.map((c, i) => (
                <option
                  key={i}
                  value={c}
                >
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* ISSUE TYPE */}

          <div className="form-group">
            <label>Issue Type</label>

            <select
              name="issueType"
              value={form.issueType}
              onChange={handleChange}
            >
              <option value="">
                Select
              </option>

              {types.map((t, i) => (
                <option
                  key={i}
                  value={t}
                >
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS */}

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="">
                Select
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Resolved">
                Resolved
              </option>
            </select>
          </div>
        </div>

        {/* DESCRIPTION */}

        <div className="form-group full-width">
          <label>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        {/* BUTTONS */}

        <div className="form-actions">

          <div className="left-actions">
            <button
              type="button"
              className="btn cancel"
              onClick={() => navigate(-1)}
            >
              Return
            </button>
          </div>

          <div className="right-actions">
            <button
              type="submit"
              className="btn submit"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update"}
            </button>
          </div>

        </div>
      </form>

      {/* SUCCESS POPUP */}

      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">

            <h3>Success</h3>

            <p>
              Issue updated successfully.
            </p>

            <button
              className="btn submit"
              onClick={() => {
                setShowSuccess(false);
                navigate(-1);
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

export default EditIssueForm;