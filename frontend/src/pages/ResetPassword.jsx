import { useState } from "react";
import "./pages.css";

const ResetPassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("New Password and Confirm Password do not match");
      return;
    }

    // API call will go here
    console.log("Reset Password Payload:", form);
    alert("Password reset submitted");
  };

  const handleClear = () => {
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        <span>Reset Password</span>
      </div>

      {/* FORM BODY */}
      <div className="page-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="form-actions">
          <button className="btn submit" onClick={handleSubmit}>
            Save
          </button>
          <button className="btn new" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;