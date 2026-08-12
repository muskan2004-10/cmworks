import "./pages.css";
import { useState } from "react";
import axios from "axios";

const ProjectStageMaster = () => {
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stage.trim()) {
      setError("Project Stage is required");
      return;
    }

    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/project-stage",
        { stage }
      );

      if (response.status === 200) {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  const handleNew = () => {
    setStage("");
    setError("");
    setShowSuccess(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">Project Stage Master</div>

      <form className="page-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Stage</label>
          <input
            value={stage}
            autoComplete="off"
            onChange={(e) => setStage(e.target.value)}
          />
          {error && <span className="error-text">{error}</span>}
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

      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Success</h3>
            <p>Project Stage saved successfully!</p>
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

export default ProjectStageMaster;
