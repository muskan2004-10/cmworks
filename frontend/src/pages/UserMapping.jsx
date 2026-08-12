import { useEffect, useState } from "react";
import "./pages.css";

const UserMapping = () => {
  const [ssoId, setSsoId] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const [formData, setFormData] = useState({
    officerName: "",
    mobile: "",
    postingDepartment: "",
    designation: "",
    email: "",
    userMode: "",
    userType: "",
    departmentName: "",
    district: "",
    active: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchDetails = () => {
    if (!ssoId.trim()) {
      alert("Please enter SSO ID");
      return;
    }
    setShowDetails(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      

      <div className="page-container">
        <div className="page-header">User Mapping</div>

        <div className="page-form">
          {/* SSO FETCH SECTION */}
          <div className="form-grid">
            <div className="form-group">
              <label>SSO ID</label>
              <input
                value={ssoId}
                onChange={(e) => setSsoId(e.target.value)}
                placeholder="Enter SSO ID"
              />
            </div>

            <div className="form-group align-end">
              <button className="btn submit" onClick={fetchDetails}>
                Fetch Details
              </button>
            </div>
          </div>

          {/* DETAILS FORM (AFTER FETCH) */}
          {showDetails && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label>Officer Name</label>
                  <input
                    name="officerName"
                    value={formData.officerName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Mobile</label>
                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Posting Department</label>
                  <input
                    name="postingDepartment"
                    value={formData.postingDepartment}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Designation</label>
                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>User Mode</label>
                  <select
                    name="userMode"
                    value={formData.userMode}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>Internal</option>
                    <option>External</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>User Type</label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>Admin</option>
                    <option>User</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Department Name</label>
                  <select
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>District</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="form-group toggle-group">
                  <label>Active</label>
                  <div
                    className={`toggle ${formData.active ? "active" : ""}`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        active: !formData.active,
                      })
                    }
                  >
                    <span />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn submit">Submit</button>
                <button className="btn new">Discard</button>
                <button
                  className="btn new"
                  onClick={() => {
                    setShowDetails(false);
                    setSsoId("");
                  }}
                >
                  New
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserMapping;
