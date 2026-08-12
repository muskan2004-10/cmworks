import "./pages.css";
import { useState } from "react";

const ListOfValue = () => {
  const [listCode, setListCode] = useState("");
  const [listDesc, setListDesc] = useState("");
  const [rows, setRows] = useState([{ id: 1, code: "", desc: "", active: true }]);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false); // for success popup

  // Add new row
  const addRow = () => {
    setRows([...rows, { id: rows.length + 1, code: "", desc: "", active: true }]);
  };

  // Submit handler with validation
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};

  if (!listCode.trim()) newErrors.listCode = "List Code is required";
  if (!listDesc.trim()) newErrors.listDesc = "List Description is required";

  rows.forEach((r, i) => {
    if (!r.code.trim()) newErrors[`code${i}`] = "Value Code is required";
    if (!r.desc.trim()) newErrors[`desc${i}`] = "Description is required";
  });

  setErrors(newErrors);

  if (Object.keys(newErrors).length !== 0) return;

  try {

    const response = await fetch("http://localhost:5000/api/lov", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        listCode,
        listDesc,
        rows
      })
    });

    const data = await response.json();

    if (response.ok) {
      setShowSuccess(true);
    } else {
      alert(data.error);
    }

  } catch (err) {
    console.error(err);
    alert("Server Error");
  }
};


  // Reset form
  const handleNew = () => {
    setListCode("");
    setListDesc("");
    setRows([{ id: 1, code: "", desc: "", active: true }]);
    setErrors({});
    setShowSuccess(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">List of Value</div>

      <form className="page-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>List Code</label>
          <input value={listCode} onChange={(e) => setListCode(e.target.value)} />
          {errors.listCode && <span className="error-text">{errors.listCode}</span>}
        </div>

        <div className="form-group">
          <label>List Description</label>
          <input value={listDesc} onChange={(e) => setListDesc(e.target.value)} />
          {errors.listDesc && <span className="error-text">{errors.listDesc}</span>}
        </div>

        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Value Code</th>
              <th>Description</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>
                  <input
                    value={r.code}
                    onChange={(e) => {
                      const copy = [...rows];
                      copy[i].code = e.target.value;
                      setRows(copy);
                    }}
                  />
                  {errors[`code${i}`] && <span className="error-text">{errors[`code${i}`]}</span>}
                </td>
                <td>
                  <input
                    value={r.desc}
                    onChange={(e) => {
                      const copy = [...rows];
                      copy[i].desc = e.target.value;
                      setRows(copy);
                    }}
                  />
                  {errors[`desc${i}`] && <span className="error-text">{errors[`desc${i}`]}</span>}
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={r.active}
                    onChange={(e) => {
                      const copy = [...rows];
                      copy[i].active = e.target.checked;
                      setRows(copy);
                    }}
                  />
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
          <button type="submit" className="btn submit">
            Submit
          </button>
          <button type="button" className="btn new" onClick={handleNew}>
            New
          </button>
        </div>
      </form>

      {/* Success popup */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Success</h3>
            <p>List of Value saved successfully!</p>
            <button className="btn submit" onClick={() => {
              setShowSuccess(false);
              handleNew(); }}>
              OK
                  </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfValue;