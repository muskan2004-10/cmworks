import "./pages.css";
import { useState, useEffect } from "react";

const AssemblyConstituency = () => {

  const [name, setName] = useState("");
  const [nameHindi, setNameHindi] = useState("");
  const [district, setDistrict] = useState("");
  const [mlaName, setMlaName] = useState("");

  const [districts, setDistricts] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load districts
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/district");
        const data = await res.json();
        setDistricts(data);
      } catch (err) {
        console.error("Error loading districts:", err);
      }
    };

    fetchDistricts();
  }, []);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!name.trim()) newErrors.name = "Assembly Name required";
    if (!nameHindi.trim()) newErrors.nameHindi = "Hindi Name required";
    if (!district) newErrors.district = "District required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/assembly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim(),
          nameHindi: nameHindi.trim(),
          district,
          mlaName: mlaName.trim() || null
        })
      });

      const data = await res.json();

      if (res.ok) {
        setShowSuccess(true);
      } else {
        alert(data.error);
      }

    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  // Reset
  const handleNew = () => {
    setName("");
    setNameHindi("");
    setDistrict("");
    setMlaName("");
    setErrors({});
  };

  return (
    <div className="page-container">

      <div className="page-header">Assembly Constituency</div>

      <form className="page-form" onSubmit={handleSubmit}>

        {/* Name */}
        <div className="form-group">
          <label>Assembly Constituency Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Hindi */}
        <div className="form-group">
          <label>Assembly Constituency Name (Hindi)</label>
          <input
            value={nameHindi}
            onChange={(e) => setNameHindi(e.target.value)}
            autoComplete="off"
          />
          {errors.nameHindi && <span className="error-text">{errors.nameHindi}</span>}
        </div>

        {/* District */}
        <div className="form-group">
          <label>District</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="">Select District</option>

            {districts.map((d) => (
              <option key={d.CM_DISTRICTID} value={d.CM_DISTRICTID}>
                {d.DISTRICTNAME}
              </option>
            ))}

          </select>
          {errors.district && <span className="error-text">{errors.district}</span>}
        </div>

        {/* MLA */}
        <div className="form-group">
          <label>MLA Name</label>
          <input
            value={mlaName}
            onChange={(e) => setMlaName(e.target.value)}
            autoComplete="off"
          />
          {errors.mlaName && <span className="error-text">{errors.mlaName}</span>}
        </div>

        {/* Buttons */}
        <div className="form-actions">

          <button type="submit" className="btn submit" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>

          <button type="button" className="btn new" onClick={handleNew}>
            New
          </button>

        </div>

      </form>

      {/* Success Popup */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Success</h3>
            <p>Assembly saved successfully.</p>
            <button
              className="btn submit"
              onClick={() => {
                setShowSuccess(false);
                handleNew();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AssemblyConstituency;
