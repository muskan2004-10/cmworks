import "./pages.css";
import { useState } from "react";

const ParliamentaryConstituency = () => {
  const [data, setData] = useState({ name: "", hindi: "", pm: "" });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle form submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};

  if (!data.name.trim()) newErrors.name = "Name is required";
  if (!data.hindi.trim()) newErrors.hindi = "Name (Hindi) is required";

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  try {
    const res = await fetch("http://localhost:5000/api/pcmaster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: data.name.trim(),
        hindi: data.hindi.trim(),
        pm: data.pm.trim()
      })
    });

    const result = await res.json();

    if (res.ok) {
      setShowSuccess(true);
    } else {
      alert(result.error);
    }

  } catch (err) {
    console.error(err);
    alert("Server Error");
  }
};


  // Reset form
  const handleNew = () => {
    setData({ name: "", hindi: "", pm: "" });
    setErrors({});
  };

  return (
    <div className="page-container">
      <div className="page-header">Parliamentary Constituency</div>

      <form className="page-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Name (Hindi)</label>
          <input
            value={data.hindi}
            onChange={(e) => setData({ ...data, hindi: e.target.value })}
          />
          {errors.hindi && <span className="error-text">{errors.hindi}</span>}
        </div>

        <div className="form-group">
          <label>PM Name</label>
          <input
            value={data.pm}
            onChange={(e) => setData({ ...data, pm: e.target.value })}
          />
          {errors.pm && <span className="error-text">{errors.pm}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn submit">Submit</button>
          <button type="button" className="btn new" onClick={handleNew}>New</button>
        </div>
      </form>

      {/* Success Popup */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Success</h3>
            <p>Parliamentary Constituency saved successfully.</p>
            <button className="btn submit" onClick={() => setShowSuccess(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParliamentaryConstituency;