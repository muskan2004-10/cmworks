import { useEffect, useState } from "react";
import axios from "axios";
import "./pages.css";

const AddMeeting = () => {
  const initialState = {
    date: "",
    title: ""
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.date || !form.title.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/meeting",
        {
          meetingDate: form.date,
          meetingTitle: form.title
        }
      );

      console.log("Response:", res.data);

      setShowSuccess(true);

    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to save meeting");
    } finally {
      setLoading(false);
    }
  };

  // ================= NEW BUTTON =================
  const handleNew = () => {
    setForm(initialState);
    setError("");
  };

  return (
    <div className="page-container">
      <div className="page-header">Add Meeting</div>

      <form className="page-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Meeting ID</label>
            <input disabled value="Auto" />
          </div>

          <div className="form-group">
            <label>Meeting Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Meeting Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        {/* ===== ACTIONS (MATCHED UI) ===== */}
        <div className="form-actions">
          <button
            type="button"
            className="btn new"
            onClick={handleNew}
          >
            New
          </button>

          <button
            type="submit"
            className="btn submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {/* ===== SUCCESS POPUP ===== */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Success</h3>
            <p>Meeting saved successfully.</p>
            <button
              className="btn submit"
              onClick={() => {
                setShowSuccess(false);
                setForm(initialState); // reset like other forms
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

export default AddMeeting;
