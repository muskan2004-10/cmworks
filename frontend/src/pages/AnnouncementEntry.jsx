import { useEffect, useState } from "react";
import "./pages.css";

const AnnouncementEntry = () => {
  const [form, setForm] = useState({
    announcementType: "",
    announcementDate: "",
    financialYear: "",
    paraNumber: "",
    projectType: "",
    originalText: "",
    estimatedCost: "",
    category: "",
    multipleProjects: false,
    noOfProjects: "",
    beneficiaryDept: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!form.announcementType) newErrors.announcementType = "Announcement type is Required";
    if (!form.announcementDate) newErrors.announcementDate = "Announcement date is Required";
    if (!form.financialYear) newErrors.financialYear = "Financial Year is Required";
    if (!form.paraNumber.trim()) newErrors.paraNumber = "Para Number is Required";
    if (!form.projectType) newErrors.projectType = "Project type is Required";
    if (!form.estimatedCost) newErrors.estimatedCost = "Estimated cost is Required";
    if (!form.category) newErrors.category = "Category is Required";
    if (!form.beneficiaryDept) newErrors.beneficiaryDept = "Beneficiary department is Required";

    if (form.multipleProjects && !form.noOfProjects) {
      newErrors.noOfProjects = "Required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Announcement Saved:", form);
      setShowSuccess(true);
    }
  };

  const handleReset = () => {
    setForm({
      announcementType: "",
      announcementDate: "",
      financialYear: "",
      paraNumber: "",
      projectType: "",
      originalText: "",
      estimatedCost: "",
      category: "",
      multipleProjects: false,
      noOfProjects: "",
      beneficiaryDept: "",
    });
    setErrors({});
  };

  return (
    <div className="page-container">
      <div className="page-header">CM-WMS Announcement Entry</div>

      <form className="page-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Announcement Type</label>
            <select name="announcementType" value={form.announcementType} onChange={handleChange}>
              <option value="">Select an option</option>
              <option>Budget Announcement</option>
              <option>Administrative Approval</option>
            </select>
            {errors.announcementType && <span className="error-text">{errors.announcementType}</span>}
          </div>

          <div className="form-group">
            <label>Announcement Date</label>
            <input type="date" name="announcementDate" value={form.announcementDate} onChange={handleChange} />
            {errors.announcementDate && <span className="error-text">{errors.announcementDate}</span>}
          </div>

          <div className="form-group">
            <label>Financial Year</label>
            <select name="financialYear" value={form.financialYear} onChange={handleChange}>
              <option value="">Select an option</option>
              <option>2019-20</option>
              <option>2020-21</option>
            </select>
            {errors.financialYear && <span className="error-text">{errors.financialYear}</span>}
          </div>

          <div className="form-group">
            <label>Budget Announcement / Decision Para Number</label>
            <input name="paraNumber" value={form.paraNumber} onChange={handleChange} />
            {errors.paraNumber && <span className="error-text">{errors.paraNumber}</span>}
          </div>

          <div className="form-group">
            <label>Announcement Work / Project Type</label>
            <select name="projectType" value={form.projectType} onChange={handleChange}>
              <option value="">Select an option</option>
              <option>Infra</option>
              <option>Building</option>
            </select>
            {errors.projectType && <span className="error-text">{errors.projectType}</span>}
          </div>

          <div className="form-group full-width">
            <label>Announcement Original Text</label>
            <textarea rows="3" name="originalText" value={form.originalText} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Estimated Announcement Cost (in Crore Rs.)</label>
            <input type="number" name="estimatedCost" value={form.estimatedCost} onChange={handleChange} />
            {errors.estimatedCost && <span className="error-text">{errors.estimatedCost}</span>}
          </div>

          <div className="form-group">
            <label>Announcement Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">Select an option</option>
              <option>Building</option>
              <option>Road</option>
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          <div className="form-group toggle-group">
            <label>Multiple Projects?</label>
            <input type="checkbox" name="multipleProjects" checked={form.multipleProjects} onChange={handleChange} />
          </div>

          {form.multipleProjects && (
            <div className="form-group">
              <label>No of Projects</label>
              <input type="number" name="noOfProjects" value={form.noOfProjects} onChange={handleChange} />
              {errors.noOfProjects && <span className="error-text">{errors.noOfProjects}</span>}
            </div>
          )}

          <div className="form-group">
            <label>Beneficiary Department</label>
            <select name="beneficiaryDept" value={form.beneficiaryDept} onChange={handleChange}>
              <option value="">Select an option</option>
              <option>Medical Education</option>
              <option>PWD</option>
            </select>
            {errors.beneficiaryDept && <span className="error-text">{errors.beneficiaryDept}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn submit">Submit</button>
          <button type="button" className="btn new" onClick={handleReset}>New</button>
        </div>
      </form>

      {/* ✅ SUCCESS POPUP */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Success</h3>
            <p>Announcement Entry submitted successfully.</p>
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

export default AnnouncementEntry;
