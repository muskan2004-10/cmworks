import { useState, useEffect } from "react";
import "./pages.css";

const FundingPattern = ({
  projectName,
  onChange,
  existingData = [],
}) => {

  const [rows, setRows] = useState([
    {
      fundBy: "",
      fundPercent: "",
      errors: {},
    },
  ]);

  /* =================================
     LOAD EXISTING DATA
  ================================= */
  useEffect(() => {

  if (
    existingData &&
    existingData.length > 0 &&
    rows.length === 1 &&
    rows[0].fundBy === "" &&
    rows[0].fundPercent === ""
  ) {

    const mappedRows =
      existingData.map((item) => ({
        fundBy:
          item.FUNDBY ||
          item.fundingBy ||
          "",

        fundPercent:
          item.FUNDBYPER ||
          item.fundingByPercent ||
          "",

        errors: {},
      }));

    setRows(mappedRows);

  }

}, [existingData]);

  /* =================================
     SEND DATA TO PARENT
  ================================= */
  useEffect(() => {

    const payload =
      rows.map(({ errors, ...r }) => ({
        FP_PRJNAME: projectName,

        FUNDBY: r.fundBy,

        FUNDBYPER: r.fundPercent,
      }));

    if (onChange) {
      onChange(payload);
    }

  }, [rows, projectName, onChange]);

  /* =================================
     HANDLE CHANGE
  ================================= */
  const handleChange = (
    index,
    key,
    value
  ) => {

    const updated = [...rows];

    updated[index][key] = value;

    let errors = {};

    if (!updated[index].fundBy) {
      errors.fundBy = "Required";
    }

    if (!updated[index].fundPercent) {

      errors.fundPercent =
        "Required";

    } else if (
      updated[index].fundPercent < 0 ||
      updated[index].fundPercent > 100
    ) {

      errors.fundPercent =
        "0-100 only";

    }

    updated[index].errors =
      errors;

    setRows(updated);
  };

  /* =================================
     ADD ROW
  ================================= */
  const addRow = () => {

    setRows([
      ...rows,
      {
        fundBy: "",
        fundPercent: "",
        errors: {},
      },
    ]);

  };

  /* =================================
     REMOVE ROW
  ================================= */
  const removeRow = (index) => {

    const updated =
      rows.filter(
        (_, i) => i !== index
      );

    setRows(updated);
  };

  /* =================================
     UI
  ================================= */
  return (
    <div className="page-container funding-page">

      <div className="page-header">
        Funding Pattern
      </div>

      <div className="page-form">

        {rows.map((row, index) => (

          <div
            key={index}
            className="funding-row"
          >

            {/* PROJECT NAME */}
            <div className="form-group">

              <label>
                Project Name
              </label>

              <input
                value={projectName}
                disabled
              />

            </div>

            {/* FUNDING BY */}
            <div className="form-group">

              <label>
                Funding By
              </label>

              <select
                value={row.fundBy || ""}
                onChange={(e) =>
                  handleChange(
                    index,
                    "fundBy",
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select
                </option>

                <option value="State Government">
                  State Government
                </option>

                <option value="Central Government">
                  Central Government
                </option>

                <option value="PPP">
                  PPP
                </option>

              </select>

              {row.errors?.fundBy && (
                <span className="error-text">
                  {row.errors.fundBy}
                </span>
              )}

            </div>

            {/* FUNDING % */}
            <div className="form-group">

              <label>
                Funding (%)
              </label>

              <input
                type="number"
                value={
                  row.fundPercent || ""
                }
                onChange={(e) =>
                  handleChange(
                    index,
                    "fundPercent",
                    e.target.value
                  )
                }
              />

              {row.errors?.fundPercent && (
                <span className="error-text">
                  {row.errors.fundPercent}
                </span>
              )}

            </div>

            {/* REMOVE BUTTON */}
            <div className="remove-btn-row">

              {rows.length > 1 && (

                <button
                  type="button"
                  className="btn cancel"
                  onClick={() =>
                    removeRow(index)
                  }
                >
                  Remove
                </button>

              )}

            </div>

          </div>

        ))}

        {/* ADD BUTTON */}
        <div className="form-actions">

          <div className="left-actions">

            <button
              type="button"
              className="btn new"
              onClick={addRow}
            >
              + Add Funding Source
            </button>

          </div>

        </div>

      </div>

      <style>{`

        .funding-page {
          overflow-x: hidden;
        }

        .funding-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 18px;
        }

        .remove-btn-row {
          grid-column: span 3;
          display: flex;
          justify-content: flex-end;
        }

      `}</style>

    </div>
  );
};

export default FundingPattern;