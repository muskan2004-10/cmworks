import "./pages.css";

const About = () => {
  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        <span>About Application</span>
      </div>

      {/* BODY */}
      <div className="page-form">
        <h3 className="section-title">CM – Works Management System</h3>

        <p>
          CM – Works Management System (CM-WMS) is an enterprise application
          designed to manage, monitor, and track government and departmental
          works efficiently. The system ensures transparency, accountability,
          and structured workflow management across departments.
        </p>

        <div className="form-grid">
          <div className="form-group">
            <label>Application Version</label>
            <input type="text" value="v1.0.0" disabled />
          </div>

          <div className="form-group">
            <label>Release Date</label>
            <input type="text" value="January 2026" disabled />
          </div>

          <div className="form-group">
            <label>Developed By</label>
            <input type="text" value="IT Department" disabled />
          </div>

          <div className="form-group">
            <label>Maintained By</label>
            <input type="text" value="System Administration Team" disabled />
          </div>
        </div>

        <h3 className="section-title">System Purpose</h3>

        <p>
          The application centralizes project-specific and general Action Taken
          Reports (ATR), funding patterns, departmental actions, and monitoring
          mechanisms. It is intended for authorized users only and all actions
          are logged for audit and compliance purposes.
        </p>

        <h3 className="section-title">Legal & Usage</h3>

        <p>
          This system is the property of the concerned authority. Unauthorized
          access, data manipulation, or misuse is strictly prohibited and may
          attract disciplinary and legal action under applicable laws.
        </p>
      </div>
    </div>
  );
};

export default About;
