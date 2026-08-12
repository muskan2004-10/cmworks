import "./pages.css";
import { useState } from "react";
import axios from "axios";

const IssueCategoryTypes = () => {
  const [category, setCategory] = useState("");
  const [rows, setRows] = useState([{ id: 1, value: "" }]);

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Add new row
  const addRow = () => {
    setRows([...rows, { id: rows.length + 1, value: "" }]);
  };

  // Handle form submit
 

const handleSubmit = async (e) => {
  e.preventDefault();
  let newErrors = {};

  if (!category.trim()) newErrors.category = "Issue Category is required";

  rows.forEach((r, i) => {
    if (!r.value.trim()) newErrors[`value${i}`] = "Sub Category is required";
  });

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/issue-category",
        {
          category,
          rows
        }
      );

      console.log("Response:", res.data);

      setShowSuccess(true); // ✅ only after API success

    } catch (error) {
      console.error("API Error:", error);
      alert("Data not saved!");
    }
  }
};


  // Reset form
  const handleNew = () => {
    setCategory("");
    setRows([{ id: 1, value: "" }]);
    setErrors({});
  };

  return (
    <div className="page-container">
      <div className="page-header">Issue Category And Types</div>

      <form className="page-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Issue Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        <div className="section-title">Issue Types</div>

        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Issue Sub Category</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>
                  <input
                    value={r.value}
                    onChange={(e) => {
                      const copy = [...rows];
                      copy[i].value = e.target.value;
                      setRows(copy);
                    }}
                  />
                  {errors[`value${i}`] && (
                    <span className="error-text">{errors[`value${i}`]}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="margin-top-10">
          <button type="button" className="btn new" onClick={addRow}>
            + Add Row
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn submit">Submit</button>
          <button type="button" className="btn new" onClick={handleNew}>New</button>
        </div>
      </form>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Success</h3>
            <p>Issue Category saved successfully.</p>
            <button className="btn submit" onClick={() => setShowSuccess(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueCategoryTypes;