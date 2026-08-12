import { useState, useEffect } from "react";
import axios from "axios";
import "./pages.css";

const DivisionMaster = () => {
  const [formData, setFormData] = useState({
    divisionCode: "",
    divisionName: "",
    divisionHindi: "",
    stateId: "",        // ✅ FIXED (use proper field)
    stateCode: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [states, setStates] = useState([]);

  /* ===============================
     FETCH STATES
  =============================== */
  const fetchStates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/state");
      setStates(res.data);
    } catch (err) {
      console.error("State Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  /* ===============================
     HANDLE CHANGE
  =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors({ ...errors, [name]: "" });

    if (name === "stateId") {
      const selected = states.find(
        (s) => s.CM_STATEID.toString() === value
      );

      setFormData({
        ...formData,
        stateId: value,                         // ✅ store ID properly
        stateCode: selected ? selected.STATECODE : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* =============================== */
  const handleToggle = () => {
    setFormData({ ...formData, isActive: !formData.isActive });
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.divisionCode.trim())
      newErrors.divisionCode = "Division Code is required";

    if (!formData.divisionName.trim())
      newErrors.divisionName = "Division Name is required";

    if (!formData.divisionHindi.trim())
      newErrors.divisionHindi = "Division Name (Hindi) is required";

    if (!formData.stateId)
      newErrors.stateId = "State is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) return;

    try {
      await axios.post("http://localhost:5000/api/division", {
        ...formData,
        isActive: formData.isActive ? 1 : 0,
      });

      setShowSuccess(true);   // ✅ only this
    } catch (error) {
      console.error("Insert Error:", error);
      alert("Error saving division");
    }
  };

  /* ===============================
     RESET
  =============================== */
  const handleNew = () => {
    setFormData({
      divisionCode: "",
      divisionName: "",
      divisionHindi: "",
      stateId: "",
      stateCode: "",
      isActive: true,
    });
    setErrors({});
  };

  return (
    <div className="page-container">
      <div className="page-header">Division</div>

      <form className="page-form" onSubmit={handleSubmit}>

        {/* DIVISION CODE */}
        <div className="form-group">
          <label>Division Code *</label>
          <input
            name="divisionCode"
            value={formData.divisionCode}
            onChange={handleChange}
          />
          {errors.divisionCode && (
            <span className="error-text">{errors.divisionCode}</span>
          )}
        </div>

        {/* DIVISION NAME */}
        <div className="form-group">
          <label>Division Name *</label>
          <input
            name="divisionName"
            value={formData.divisionName}
            onChange={handleChange}
          />
          {errors.divisionName && (
            <span className="error-text">{errors.divisionName}</span>
          )}
        </div>

        {/* HINDI */}
        <div className="form-group">
          <label>Division Name (Hindi) *</label>
          <input
            name="divisionHindi"
            value={formData.divisionHindi}
            onChange={handleChange}
          />
          {errors.divisionHindi && (
            <span className="error-text">{errors.divisionHindi}</span>
          )}
        </div>

        {/* STATE DROPDOWN */}
        <div className="form-group">
          <label>State *</label>
          <select
            name="stateId"
            value={formData.stateId}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {states.map((s) => (
              <option key={s.CM_STATEID} value={s.CM_STATEID}>
                {s.STATENAME}
              </option>
            ))}
          </select>

          {errors.stateId && (
            <span className="error-text">{errors.stateId}</span>
          )}
        </div>

        {/* STATE CODE */}
        <div className="form-group">
          <label>State Code</label>
          <input value={formData.stateCode} readOnly />
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

      {/* ✅ SUCCESS POPUP */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Success</h3>
            <p>Division saved successfully.</p>
            <button
              className="btn submit"
              onClick={() => {
                setShowSuccess(false);
                handleNew();   // ✅ reset AFTER popup
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

export default DivisionMaster;