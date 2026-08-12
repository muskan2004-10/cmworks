import { useEffect } from "react";

import "./pages.css";
import "./AddUpdateWorkEntry.css";
import API from "../api/api";



const AddUpdateWorkEntry = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
  API.get("/")
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
}, []);

  return (
    <>
      

      <div className="page-container">
        <div className="page-header">Add / Update Work Entry</div>

        <div className="page-form">

          {/* ================= ANNOUNCEMENT DETAILS ================= */}
          <div className="section-box">
            <div className="section-box-header">Announcement Details</div>
            <div className="section-box-content">

              <div className="form-grid">
                <div className="form-group">
                  <label>Announcement Type</label>
                  <select>
                    <option>Select an option</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Announcement Date</label>
                  <input type="date" />
                </div>

                <div className="form-group">
                  <label>Financial Year</label>
                  <select>
                    <option>Select an option</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Budget Announcement / Decisions Para Number</label>
                  <input />
                </div>

                <div className="form-group">
                  <label>Announcement Work / Project Type</label>
                  <select>
                    <option>Select an option</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Announcement Original Text</label>
                  <textarea rows="3" />
                </div>

                <div className="form-group">
                  <label>Estimated Work / Project Cost (in Lakh Rs.)</label>
                  <input />
                </div>

                <div className="form-group">
                  <label>Estimated Work / Project Cost (in Crore Rs.)</label>
                  <input />
                </div>

                <div className="form-group full-width">
                  <label>Work / Project Details</label>
                  <textarea rows="3" />
                </div>

                <div className="form-group">
                  <label>Work / Project Category</label>
                  <select>
                    <option>Select an option</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Work / Project Sub Category</label>
                  <select>
                    <option>Select an option</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Work Cost (in Lakh Rs.)</label>
                  <input />
                </div>

                <div className="form-group">
                  <label>Name of Beneficiary Department</label>
                  <input />
                </div>
              </div>
            </div>
          </div>

          {/* ================= EXECUTING DEPARTMENT DETAILS ================= */}
          <div className="section-box">
            <div className="section-box-header">Executing Department Details</div>
            <div className="section-box-content">

              <div className="form-grid">
                <div className="form-group">
                  <label>Name of Executing Department</label>
                  <select>
                    <option>Select an option</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Name of Executing Agency</label>
                  <select>
                    <option>Select an option</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Name of Incharge Executive Engineer / Officer</label>
                  <input />
                </div>

                <div className="form-group">
                  <label>Incharge Executive Engineer / Officer Mobile</label>
                  <input />
                </div>

                <div className="form-group">
                  <label>Incharge Executive Engineer / Officer SSO ID</label>
                  <input />
                </div>
              </div>
            </div>
          </div>

          {/* ================= WORK SITE DETAILS ================= */}
          <div className="section-box">
            <div className="section-box-header">Work Site Details</div>
            <div className="section-box-content">

              <div className="form-grid">
                <div className="form-group">
                  <label>District</label>
                  <select>
                    <option>Select an option</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Parliament Constituency</label>
                  <select>
                    <option>Select an option</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Assembly Constituency</label>
                  <select>
                    <option>Select an option</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ================= LAND RELATED DETAILS ================= */}
          <div className="section-box">
            <div className="section-box-header">Land Related Details</div>
            <div className="section-box-content">

              <div className="form-grid">
                <div className="form-group">
                  <label>Land Allotment</label>
                  <select>
                    <option>Select</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>File Pending With</label>
                  <select>
                    <option>Select</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>No Reason</label>
                  <input />
                </div>

                <div className="form-group">
                  <label>Site Clear and Available</label>
                  <select>
                    <option>Select</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Reason Related To</label>
                  <select>
                    <option>Select</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>No Reason</label>
                  <input />
                </div>

                <div className="form-group">
                  <label>Any Other Issue?</label>
                  <select>
                    <option>Select</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Reason Related To</label>
                  <select>
                    <option>Select</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Yes Reason</label>
                  <input />
                </div>
              </div>
            </div>
          </div>

          {/* ================= SANCTION RELATED DETAILS ================= */}
          <div className="section-box">
            <div className="section-box-header">Sanction Related Details</div>
            <div className="section-box-content">

              <div className="form-grid">
                <div className="form-group">
                  <label>Is Financial Sanction Generated (Yes/No)</label>
                  <select>
                    <option>Select</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Financial Sanction Date</label>
                  <input type="date" />
                </div>

                <div className="form-group">
                  <label>FS Not Generated Reason</label>
                  <input />
                </div>

                <div className="form-group">
                  <label>Tentative Date of Completion</label>
                  <input type="date" />
                </div>

                <div className="form-group">
                  <label>Work Order Generated (Yes/No)</label>
                  <select>
                    <option>Select</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Work Progress Physical</label>
                  <select>
                    <option>Not Initiated</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Work Order Not Generated Reason</label>
                  <input />
                </div>

                <div className="form-group">
                  <label>Work Not Initiated Reason</label>
                  <input />
                </div>
              </div>
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="form-actions">
            <button className="btn submit">Submit</button>
            <button className="btn new">New</button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AddUpdateWorkEntry;
