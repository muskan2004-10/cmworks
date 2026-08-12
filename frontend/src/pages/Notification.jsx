import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./pages.css"; // global css

const Notification = ({ toggleSidebar }) => {
  const [formData, setFormData] = useState({
    notificationDate: "",
    notificationTitle: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    let newErrors = {};
    if (!formData.notificationDate) newErrors.notificationDate = "Notification Date is required";
    if (!formData.notificationTitle.trim()) newErrors.notificationTitle = "Notification Title is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Notification Submitted:", formData);
      setShowSuccess(true);
    }
  };

  const handleNew = () => {
    setFormData({
      notificationDate: "",
      notificationTitle: "",
    });
    setErrors({});
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="page-container">
        {/* HEADER */}
        <div className="page-header">
          <span>Notification</span>
        </div>

        {/* FORM */}
        <form className="page-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Notification Date */}
            <div className="form-group">
              <label>Notification Date</label>
              <input
                type="date"
                name="notificationDate"
                value={formData.notificationDate}
                onChange={handleChange}
              />
              {errors.notificationDate && <span className="error-text">{errors.notificationDate}</span>}
            </div>

            {/* Empty column for spacing */}
            <div className="form-group" />

            {/* Notification Title */}
            <div className="form-group full-width">
              <label>Notification Title</label>
              <textarea
                rows="3"
                name="notificationTitle"
                value={formData.notificationTitle}
                onChange={handleChange}
              />
              {errors.notificationTitle && <span className="error-text">{errors.notificationTitle}</span>}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="form-actions">
            <button type="submit" className="btn submit">Submit</button>
            <button type="button" className="btn new" onClick={handleNew}>New</button>
          </div>
        </form>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Success</h3>
            <p>Notification saved successfully.</p>
            <button className="btn submit" onClick={() => setShowSuccess(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;