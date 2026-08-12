import { useState, useEffect } from "react";
import axios from "axios";
import "./pages.css";

const StateMaster = () => {
  const [formData, setFormData] = useState({
    stateCode: "",
    stateName: "",
    stateNameHindi: "",   // optional
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [states, setStates] = useState([]);

  /* ===========================
     FETCH STATES
  =========================== */
  const fetchStates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/state");
      setStates(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  /* ===========================
     HANDLE CHANGE
  =========================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleToggle = () => {
    setFormData({ ...formData, isActive: !formData.isActive });
  };

  /* ===========================
     VALIDATION (NO HINDI)
  =========================== */
  const validate = () => {
    let newErrors = {};

    if (!formData.stateCode.trim()) {
      newErrors.stateCode = "State Code is required";
    }

    if (!formData.stateName.trim()) {
      newErrors.stateName = "State Name is required";
    }

    return newErrors;
  };

  /* ===========================
     SUBMIT
  =========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    try {
      await axios.post("http://localhost:5000/api/state", formData);

      setShowSuccess(true);   // ✅ only this
      fetchStates();
    } catch (error) {
      console.error("Insert Error:", error);
      alert("Error saving state. Please try again.");
    }
  };

  /* ===========================
     RESET
  =========================== */
  const handleNew = () => {
    setFormData({
      stateCode: "",
      stateName: "",
      stateNameHindi: "",
      isActive: true,
    });
    setErrors({});
  };

  return (
    <div className="page-container">
      <div className="page-header">State</div>

      <form className="page-form" onSubmit={handleSubmit}>
        {/* STATE CODE */}
        <div className="form-group">
          <label>
            State Code <span className="red-text">*</span>
          </label>
          <input
            name="stateCode"
            value={formData.stateCode}
            onChange={handleChange}
          />
          {errors.stateCode && (
            <span className="error-text">{errors.stateCode}</span>
          )}
        </div>

        {/* STATE NAME */}
        <div className="form-group">
          <label>
            State Name <span className="red-text">*</span>
          </label>
          <input
            name="stateName"
            value={formData.stateName}
            onChange={handleChange}
          />
          {errors.stateName && (
            <span className="error-text">{errors.stateName}</span>
          )}
        </div>

        {/* HINDI (NO VALIDATION) */}
        <div className="form-group">
          <label>State Name Hindi</label>
          <input
            name="stateNameHindi"
            value={formData.stateNameHindi}
            onChange={handleChange}
          />
        </div>

        {/* TOGGLE */}
        <div className="form-group toggle-group">
          <label>Active</label>
          <div
            className={`toggle ${formData.isActive ? "active" : ""}`}
            onClick={handleToggle}
          >
            <span className="circle"></span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="form-actions">
          <button className="btn submit" type="submit">
            Submit
          </button>
          <button className="btn new" type="button" onClick={handleNew}>
            New
          </button>
        </div>
      </form>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Success</h3>
            <p>State saved successfully.</p>
            <button
              className="btn submit"
              onClick={() => {
                setShowSuccess(false);
                handleNew();   // ✅ reset AFTER closing popup
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

export default StateMaster;