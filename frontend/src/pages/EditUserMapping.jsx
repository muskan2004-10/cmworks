import { useEffect, useState } from "react";
import "./pages.css";

const EditUserMapping = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // later this will come from API
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <>
      

      <div className="page-container">
        <div className="page-header">Edit User Mapping</div>

        <div className="page-form">
          {/* USER LIST TABLE */}
          <table>
            <thead>
              <tr>
                <th>Officer Name</th>
                <th>SSO ID</th>
                <th>Department</th>
                <th>District</th>
                <th>Status</th>
                <th>Edit</th>
              </tr>
            </thead>

            <tbody>
              {/* Data will be rendered here dynamically */}
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No records found
                </td>
              </tr>
            </tbody>
          </table>

          {/* EDIT FORM */}
          {showEditForm && (
            <>
              <h3 className="section-title">Edit User</h3>

              <div className="form-grid">
                <div className="form-group">
                  <label>Officer Name</label>
                  <input type="text" placeholder="Enter officer name" />
                </div>

                <div className="form-group">
                  <label>SSO ID</label>
                  <input type="text" placeholder="Enter SSO ID" />
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <select>
                    <option value="">Select department</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>District</label>
                  <select>
                    <option value="">Select district</option>
                  </select>
                </div>

                <div className="form-group toggle-group">
                  <label>Active</label>
                  <div className="toggle">
                    <span />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn submit">Save</button>
                <button
                  className="btn new"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EditUserMapping;
