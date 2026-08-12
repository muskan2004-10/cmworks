import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./pages.css";

const NewIssue = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ================= CURRENT DATE =================
  const today = new Date().toISOString().split("T")[0];

  const initialState = {
    projectId: "",
    projectName: "",
    issueDate: today,
    issueCategory: "",
    issueType: "",
    description: "",
    status: "",
    departments: [{ id: 1, value: "" }]
  };

  const [form, setForm] = useState(initialState);

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [allRows, setAllRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [departments, setDepartments] = useState([]);

  // ================= AUTO FILL =================
  useEffect(() => {
    if (location.state) {
      setForm((prev) => ({
        ...prev,
        projectId:
          location.state.projectId ||
          location.state.fullData?.TRN_CMWORKDATAID ||
          "",

        projectName:
          location.state.projectName ||
          location.state.fullData?.PRJ_NAME ||
          ""
      }));
    }
  }, [location]);

  // ================= LOAD CATEGORY =================
  useEffect(() => {
    loadMaster();
  }, []);

  const loadMaster = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/issue-category/list"
      );

      const data = res.data || [];

      setAllRows(data);

      const uniqueCats = [
        ...new Set(
          data
            .map((i) => i.CATNAME)
            .filter((v) => v && v.trim() !== "")
        )
      ];

      setCategories(uniqueCats);
    } catch (err) {
      console.log("Category Load Error:", err);
    }
  };

  // ================= LOAD DEPARTMENTS =================
  useEffect(() => {
    fetch("http://localhost:5000/api/project-department")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.log(err));
  }, []);

  // ================= AUTO LOAD TYPES =================
  useEffect(() => {
    if (form.issueCategory && allRows.length > 0) {
      const filtered = allRows.filter(
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
        )
      ];

      setTypes(uniqueTypes);
    }
  }, [form.issueCategory, allRows]);

  // ================= VALIDATION =================
  const validate = () => {
    const errors = {};

    // Project
    if (!form.projectId.trim()) {
      errors.projectId = "Project ID is required";
    }

    if (!form.projectName.trim()) {
      errors.projectName = "Project Name is required";
    }

    // Date
    if (!form.issueDate) {
      errors.issueDate = "Issue Date is required";
    }

    // Category
    if (!form.issueCategory) {
      errors.issueCategory = "Please select Issue Category";
    }

    // Type
    if (!form.issueType) {
      errors.issueType = "Please select Issue Type";
    }

    // Status
    if (!form.status) {
      errors.status = "Please select Status";
    }

    // Description
    if (!form.description.trim()) {
      errors.description = "Description is required";
    }

    // Department
    if (!form.departments[0].value) {
      errors.departments = "Please select Department";
    }

    return errors;
  };

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    setFieldErrors({
      ...fieldErrors,
      [name]: ""
    });
  };

  // ================= CATEGORY =================
  const handleCategoryChange = (e) => {
    const selected = e.target.value;

    const filtered = allRows.filter(
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
      )
    ];

    setTypes(uniqueTypes);

    setForm({
      ...form,
      issueCategory: selected,
      issueType: ""
    });

    setFieldErrors({
      ...fieldErrors,
      issueCategory: "",
      issueType: ""
    });
  };

  // ================= DEPARTMENT =================
  const handleDeptChange = (index, value) => {
    const copy = [...form.departments];

    copy[index].value = value;

    setForm({
      ...form,
      departments: copy
    });

    setFieldErrors({
      ...fieldErrors,
      departments: ""
    });
  };

  // ================= NEW =================
  const handleNew = () => {
    setForm({
      ...initialState,
      projectId: form.projectId,
      projectName: form.projectName,
      issueDate: today
    });

    setTypes([]);
    setFieldErrors({});
  };

  // ================= RETURN =================
  const handleReturn = () => {
    navigate("/project-onboarding/dashboard");
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        departments: form.departments
          .map((d) => d.value)
          .filter(Boolean)
          .join(",")
      };

      await axios.post(
        "http://localhost:5000/api/newissue",
        payload
      );

      setShowSuccess(true);
    } catch (err) {
      console.log(err);

      setFieldErrors({
        submit: "Failed to save issue"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">New Issue</div>

      <form className="page-form" onSubmit={handleSubmit}>
        <div className="form-grid">

          {/* ================= PROJECT ID ================= */}
          <div className="form-group">
            <label>Project ID</label>

            <input value={form.projectId} readOnly />

            {fieldErrors.projectId && (
              <span className="error-text">
                {fieldErrors.projectId}
              </span>
            )}
          </div>

          {/* ================= PROJECT NAME ================= */}
          <div className="form-group">
            <label>Project Name</label>

            <input value={form.projectName} readOnly />

            {fieldErrors.projectName && (
              <span className="error-text">
                {fieldErrors.projectName}
              </span>
            )}
          </div>

          {/* ================= ISSUE DATE ================= */}
          <div className="form-group">
            <label>Issue Date</label>

            <input
              type="date"
              name="issueDate"
              value={form.issueDate}
              readOnly
            />

            {fieldErrors.issueDate && (
              <span className="error-text">
                {fieldErrors.issueDate}
              </span>
            )}
          </div>

          {/* ================= CATEGORY ================= */}
          <div className="form-group">
            <label>Issue Category</label>

            <select
              value={form.issueCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Select</option>

              {categories.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {fieldErrors.issueCategory && (
              <span className="error-text">
                {fieldErrors.issueCategory}
              </span>
            )}
          </div>

          {/* ================= TYPE ================= */}
          <div className="form-group">
            <label>Issue Type</label>

            <select
              name="issueType"
              value={form.issueType}
              onChange={handleChange}
            >
              <option value="">Select</option>

              {types.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {fieldErrors.issueType && (
              <span className="error-text">
                {fieldErrors.issueType}
              </span>
            )}
          </div>

          {/* ================= STATUS ================= */}
          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="">Select</option>

              <option value="Pending">
                Pending
              </option>

              <option value="Resolved">
                Resolved
              </option>
            </select>

            {fieldErrors.status && (
              <span className="error-text">
                {fieldErrors.status}
              </span>
            )}
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div className="form-group full-width">
          <label>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter issue description..."
          />

          {fieldErrors.description && (
            <span className="error-text">
              {fieldErrors.description}
            </span>
          )}
        </div>

        {/* ================= DEPARTMENT ================= */}
        <div className="form-group full-width">
          <label>Concerned Department</label>

          <select
            value={form.departments[0].value}
            onChange={(e) =>
              handleDeptChange(0, e.target.value)
            }
          >
            <option value="">
              Select Department
            </option>

            {departments.map((dept, index) => (
              <option
                key={`${dept.DEPTID}-${index}`}
                value={dept.DEPTNAME}
              >
                {dept.DEPTNAME}
              </option>
            ))}
          </select>

          {fieldErrors.departments && (
            <span className="error-text">
              {fieldErrors.departments}
            </span>
          )}
        </div>

        {/* ================= SUBMIT ERROR ================= */}
        {fieldErrors.submit && (
          <div className="submit-error">
            {fieldErrors.submit}
          </div>
        )}

        {/* ================= BUTTONS ================= */}
        <div className="form-actions">
          <div className="left-actions">
            <button
              type="button"
              className="btn cancel"
              onClick={handleReturn}
            >
              Return
            </button>
          </div>

          <div className="right-actions">
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
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>

      {/* ================= SUCCESS POPUP ================= */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Success</h3>

            <p>Issue saved successfully</p>

            <button
              className="btn submit"
              onClick={() =>
                navigate("/project-onboarding/dashboard")
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

export default NewIssue; 