import { useState, useEffect } from "react";
import "./pages.css";

const Packages = ({
  onChange,
  existingData = [],
}) => {
  const emptyRow = {
    packagePhase: "",
    contractorName: "",
    dateOfSanction: "",
    startDate: "",
    revisedStartDate: "",
    completionDate: "",
    revisedCompletionDate: "",
    cost: "",
    revisedCost: "",
    costOverrun: 0,
    totalFunds: "",
    financialProgress: "",
    financialPercent: 0,
    timeOverrun: 0,
    errors: {}
  };

const [rows, setRows] = useState(
  existingData.length > 0
    ? existingData
    : [{ ...emptyRow }]
);

useEffect(() => {

  if (
    existingData &&
    existingData.length > 0
  ) {

    setRows(existingData);

  }

}, []);

  /* ===============================
     ADD / DELETE
  =============================== */
  const addRow = () => {
    setRows([...rows, { ...emptyRow }]);
  };

  const deleteRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  /* ===============================
     HANDLE CHANGE
  =============================== */
  const handleChange = (index, key, value) => {
    const updated = [...rows];
    updated[index][key] = value;

    const row = updated[index];

    // Cost Overrun
    const cost = parseFloat(row.cost || 0);
    const revised = parseFloat(row.revisedCost || 0);
    row.costOverrun =revised - cost;
    // Financial %
    const fin = parseFloat(row.financialProgress || 0);
    row.financialPercent =
    cost > 0
      ? Number(
          ((fin / cost) * 100).toFixed(2)
        )
      : 0;

    // Time Overrun
    if (row.completionDate && row.revisedCompletionDate) {
      const original = new Date(row.completionDate);
      const revisedD = new Date(row.revisedCompletionDate);

      const diff = Math.ceil(
        (revisedD - original) / (1000 * 60 * 60 * 24)
      );

      row.timeOverrun = diff > 0 ? diff : 0;
    }

    // Validation
    let errors = {};

    if (!row.packagePhase) errors.packagePhase = "Required";
    if (!row.contractorName) errors.contractorName = "Required";

    if (row.cost < 0) errors.cost = "Invalid";
    if (row.revisedCost < 0) errors.revisedCost = "Invalid";

    if (row.startDate && row.completionDate) {
      if (new Date(row.startDate) > new Date(row.completionDate)) {
        errors.completionDate = "Invalid date";
      }
    }

    updated[index].errors = errors;
    setRows(updated);
  };

  /* ===============================
     SEND DATA
  =============================== */
  useEffect(() => {

  const cleanData = rows.map(
    ({ errors, ...rest }) => rest
  );

  onChange(cleanData);

}, [rows, onChange]);

  /* ===============================
     UI
  =============================== */
  return (
    <div className="page-container packages-page">

      <div className="page-header">
        Package / Phase Details
      </div>

      <div className="page-form">

        <div className="package-header">
          <h3 className="section-title">Packages / Phases</h3>

          <button className="btn save" onClick={addRow}>
            + Add Phase
          </button>
        </div>

        {rows.map((row, i) => (
          <div key={i} className="phase-card">

            <div className="form-grid-3">

              <div className="form-group">
                <label>Package</label>
                <input
                  value={row.packagePhase}
                  onChange={(e) =>
                    handleChange(i, "packagePhase", e.target.value)
                  }
                />
                {row.errors?.packagePhase && (
                  <span className="error-text">{row.errors.packagePhase}</span>
                )}
              </div>

              <div className="form-group">
                <label>Contractor</label>
                <input
                  value={row.contractorName}
                  onChange={(e) =>
                    handleChange(i, "contractorName", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Sanction Date</label>
                <input
                  type="date"
                  value={row.dateOfSanction}
                  onChange={(e) =>
                    handleChange(i, "dateOfSanction", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={row.startDate}
                  onChange={(e) =>
                    handleChange(i, "startDate", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
            <label>Revised Start Date</label>

              <input
                type="date"
                value={row.revisedStartDate}
                onChange={(e) =>
                  handleChange(
                    i,
                    "revisedStartDate",
                    e.target.value
                  )
                }
              />
            </div>

              <div className="form-group">
                <label>Completion Date</label>
                <input
                  type="date"
                  value={row.completionDate}
                  onChange={(e) =>
                    handleChange(i, "completionDate", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Revised Completion</label>
                <input
                  type="date"
                  value={row.revisedCompletionDate}
                  onChange={(e) =>
                    handleChange(i, "revisedCompletionDate", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Cost</label>
                <input
                  type="number"
                  value={row.cost}
                  onChange={(e) =>
                    handleChange(i, "cost", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Revised Cost</label>
                <input
                  type="number"
                  value={row.revisedCost}
                  onChange={(e) =>
                    handleChange(i, "revisedCost", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Cost Overrun</label>
                <input value={row.costOverrun} disabled />
              </div>

              <div className="form-group">
                <label>Funds</label>
                <input
                  type="number"
                  value={row.totalFunds}
                  onChange={(e) =>
                    handleChange(i, "totalFunds", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Progress</label>
                <input
                  type="number"
                  value={row.financialProgress}
                  onChange={(e) =>
                    handleChange(i, "financialProgress", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Financial %</label>
                <input value={row.financialPercent} disabled />
              </div>

              <div className="form-group">
                <label>Time Overrun (Days)</label>
                <input value={row.timeOverrun} disabled />
              </div>

            </div>

            <div className="row-actions">
              <button
                className="btn cancel"
                onClick={() => deleteRow(i)}
              >
                Remove
              </button>
            </div>

          </div>
        ))}

      </div>

      {/* ===============================
         SCOPED CSS
      =============================== */}
      <style>{`

      .packages-page {
        width: 100%;
        overflow-x: hidden;
      }

      .phase-card {
        border: 1px solid #e0e0e0;
        padding: 16px;
        border-radius: 6px;
        margin-bottom: 20px;
        background: #fafafa;
      }

      /* 🔥 3 COLUMN GRID */
      .form-grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px 20px;
      }

      .row-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }

      /* Prevent width expansion */
      .page-container,
      .page-form {
        max-width: 100%;
        overflow-x: hidden;
      }

      `}</style>

    </div>
  );
};

export default Packages;