import { useState } from "react";
import "./pages.css";

const ApplicationParameters = () => {
  const [params, setParams] = useState({
    appName: "CM - Works Management System",
    sessionTimeout: "",
    maxLoginAttempts: "",
    enableNotifications: true,
    maintenanceMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setParams({
      ...params,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    console.log("Application Parameters:", params);
    alert("Application parameters saved");
  };

  const handleReset = () => {
    setParams({
      appName: "",
      sessionTimeout: "",
      maxLoginAttempts: "",
      enableNotifications: true,
      maintenanceMode: false,
    });
  };

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        <span>Application Parameters</span>
      </div>

      {/* FORM BODY */}
      <div className="page-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Application Name</label>
            <input
              type="text"
              name="appName"
              value={params.appName}
              onChange={handleChange}
              placeholder="Enter application name"
            />
          </div>

          <div className="form-group">
            <label>Session Timeout (minutes)</label>
            <input
              type="number"
              name="sessionTimeout"
              value={params.sessionTimeout}
              onChange={handleChange}
              placeholder="e.g. 30"
            />
          </div>

          <div className="form-group">
            <label>Max Login Attempts</label>
            <input
              type="number"
              name="maxLoginAttempts"
              value={params.maxLoginAttempts}
              onChange={handleChange}
              placeholder="e.g. 5"
            />
          </div>
        </div>

        {/* TOGGLES */}
        <div className="form-grid">
          <div className="form-group">
            <label>Enable Notifications</label>
            <div
              className={`toggle ${params.enableNotifications ? "active" : ""}`}
              onClick={() =>
                setParams({
                  ...params,
                  enableNotifications: !params.enableNotifications,
                })
              }
            >
              <span />
            </div>
          </div>

          <div className="form-group">
            <label>Maintenance Mode</label>
            <div
              className={`toggle ${params.maintenanceMode ? "active" : ""}`}
              onClick={() =>
                setParams({
                  ...params,
                  maintenanceMode: !params.maintenanceMode,
                })
              }
            >
              <span />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button className="btn save" onClick={handleSave}>
            Save
          </button>
          <button className="btn new" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationParameters;