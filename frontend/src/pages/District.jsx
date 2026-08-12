import { useState, useEffect } from "react";
import "./pages.css";
import axios from "axios";

const DistrictMaster = () => {
  const [formData, setFormData] = useState({
    districtCode: "",
    districtName: "",
    districtNameHindi: "",
    stateId: "",
    divisionId: "",
    shortName: "",
    shortNameHindi: "",
    isActive: true,
  });

  const [states, setStates] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  /* ===============================
     LOAD DATA
  =============================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const stateRes = await axios.get("http://localhost:5000/api/state");
        setStates(stateRes.data);

        const divisionRes = await axios.get("http://localhost:5000/api/division");
        setDivisions(divisionRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    loadData();
  }, []);

  /* ===============================
     HANDLE CHANGE
  =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors({ ...errors, [name]: "" }); // remove error on typing
    setFormData({ ...formData, [name]: value });
  };

  /* =============================== */
  const handleToggle = () => {
    setFormData({ ...formData, isActive: !formData.isActive });
  };

  /* ===============================
     VALIDATION (NO HINDI)
  =============================== */
  const validate = () => {
    let newErrors = {};

    if (!formData.districtCode.trim()) {
      newErrors.districtCode = "District Code is required";
    }

    if (!formData.districtName.trim()) {
      newErrors.districtName = "District Name is required";
    }

    if (!formData.stateId) {
      newErrors.stateId = "Please select a State";
    }

    if (!formData.divisionId) {
      newErrors.divisionId = "Please select a Division";
    }

    return newErrors;
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    try {
      await axios.post("http://localhost:5000/api/district", {
        ...formData,
        isActive: formData.isActive ? 1 : 0,
      });

      setShowSuccess(true); // ✅ show popup
    } catch (err) {
      console.error(err);
      alert("Error saving district");
    }
  };

  /* ===============================
     RESET
  =============================== */
  const handleNew = () => {
    setFormData({
      districtCode: "",
      districtName: "",
      districtNameHindi: "",
      stateId: "",
      divisionId: "",
      shortName: "",
      shortNameHindi: "",
      isActive: true,
    });
    setErrors({});
  };

  return (
    <div className="page-container">
      <div className="page-header">District</div>

      <form className="page-form" onSubmit={handleSubmit}>
        <div className="form-grid">

          {/* DISTRICT CODE */}
          <div className="form-group">
            <label>District Code *</label>
            <input
              name="districtCode"
              value={formData.districtCode}
              onChange={handleChange}
            />
            {errors.districtCode && (
              <span className="error-text">{errors.districtCode}</span>
            )}
          </div>

          {/* DISTRICT NAME */}
          <div className="form-group">
            <label>District Name *</label>
            <input
              name="districtName"
              value={formData.districtName}
              onChange={handleChange}
            />
            {errors.districtName && (
              <span className="error-text">{errors.districtName}</span>
            )}
          </div>

          {/* HINDI (NO VALIDATION) */}
          <div className="form-group">
            <label>District Name (Hindi)</label>
            <input
              name="districtNameHindi"
              value={formData.districtNameHindi}
              onChange={handleChange}
            />
          </div>

          {/* STATE */}
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

          {/* DIVISION */}
          <div className="form-group">
            <label>Division *</label>
            <select
              name="divisionId"
              value={formData.divisionId}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {divisions.map((d) => (
                <option key={d.CM_DIVISIONID} value={d.CM_DIVISIONID}>
                  {d.DIVISION}
                </option>
              ))}
            </select>
            {errors.divisionId && (
              <span className="error-text">{errors.divisionId}</span>
            )}
          </div>

          {/* SHORT NAME */}
          <div className="form-group">
            <label>Short Name</label>
            <input
              name="shortName"
              value={formData.shortName}
              onChange={handleChange}
            />
          </div>

          {/* SHORT NAME HINDI */}
          <div className="form-group">
            <label>Short Name (Hindi)</label>
            <input
              name="shortNameHindi"
              value={formData.shortNameHindi}
              onChange={handleChange}
            />
          </div>
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
            <p>District saved successfully.</p>
            <button
              className="btn submit"
              onClick={() => {
                setShowSuccess(false);
                handleNew(); // reset after OK
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

export default DistrictMaster;