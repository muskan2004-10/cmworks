import { useState } from "react";
import axios from "axios";
import "./pages.css";

const FinancialYear = () => {
  const [formData, setFormData] = useState({
    financialYear: "",
    value: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleToggle = () => {
    setFormData({ ...formData, isActive: !formData.isActive });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.financialYear.trim()) {
      newErrors.financialYear = "Financial Year is required";
    }

    if (!formData.value.trim()) {
      newErrors.value = "Value is required";
    } else if (isNaN(formData.value)) {
      newErrors.value = "Value must be a number";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) return;

    try {
      setLoading(true);

      // 🔹 API CALL TO BACKEND
      await axios.post("http://localhost:5000/api/financial-year", {
        fy: formData.financialYear,
        fvalue: formData.value,
        isactive: formData.isActive ? 1 : 0,
      });

      setShowSuccess(true);
      handleNew();
    } catch (error) {
      console.error("Error saving financial year:", error);
      alert("Error saving Financial Year. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setFormData({
      financialYear: "",
      value: "",
      isActive: true,
    });
    setErrors({});
  };

  return (
    <div className="page-container">
      <div className="page-header">Financial Year</div>

      <form className="page-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Financial Year <span className="red-text">*</span>
          </label>
          <input
            name="financialYear"
            value={formData.financialYear}
            onChange={handleChange}
          />
          {errors.financialYear && (
            <span className="error-text">{errors.financialYear}</span>
          )}
        </div>

        <div className="form-group">
          <label>
            Value <span className="red-text">*</span>
          </label>
          <input
            name="value"
            value={formData.value}
            onChange={handleChange}
          />
          {errors.value && (
            <span className="error-text">{errors.value}</span>
          )}
        </div>

        <div className="form-group toggle-group">
          <label>Active</label>
          <div
            className={`toggle ${formData.isActive ? "active" : ""}`}
            onClick={handleToggle}
          >
            <span />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn submit" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
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
            <p>Financial Year saved successfully.</p>
            <button
              className="btn submit"
              onClick={() => setShowSuccess(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialYear;
