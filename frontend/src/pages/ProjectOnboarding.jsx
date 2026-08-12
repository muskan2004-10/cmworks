import { useState, useEffect} from "react";
import "./pages.css";
import FundingPattern from "./FundingPattern";
import PackagePhaseDetails from "./PackagePhaseDetails";


const ProjectOnboarding = () => {
  const initialState = {
    projectName: "",
    ownerDept: "",
    financialYear: "",
    location: "",
    projectStage: "",
    modeOfImplementation: "",
    implementingDepartment: "",
    implementingAgency: "",
    mlaConstituency: "",
    parliamentConstituency: "",
    townsBenefited: "",
    populationBenefited: "",
    physicalProgress: "",
    physicalProgressPercent: "",
    autoFillBrief: false,
    isWorkOrderGenerated: false,
    isFsGenerated: false,
    briefDescription: "",
    

    contractorName: "",
    dateOfSanction: "",
    projectStartDate: "",
    revisedStartDate: "",
    projectCompletionDate: "",
    revisedProjectCompletionDate: "",
    projectTimeOverrun: "",
    projectCost: "",
    revisedCost: "",
    costOverrun: "",
    totalFundsReleased: "",
    financialProgressAmount: "",
    financialProgressPercent: "",
    fundingBy: "",
    fundingByPercent: "",
    multiplePackages: false,
    multipleFundingSources: false,
  };

  const calculateTimeOverrun = () => {
  const original = formData.projectCompletionDate
    ? new Date(formData.projectCompletionDate)
    : null;

  const revised = formData.revisedProjectCompletionDate
    ? new Date(formData.revisedProjectCompletionDate)
    : null;

  if (original && revised) {
    const diff =
      Math.round(
        (revised.getTime() - original.getTime()) /
        (1000 * 60 * 60 * 24)
      );

    return diff;
  }

  return 0;
};
  const [showFundingPattern, setShowFundingPattern] = useState(false);
  const [fundingData, setFundingData] = useState([]);
  const [phaseData, setPhaseData] = useState([]);


  const calculateCostOverrun = () => {
  const original = parseFloat(formData.projectCost || 0);
  const revised = parseFloat(formData.revisedCost || 0);

  return (revised - original).toFixed(2); // ✅ can be negative
  };



  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [workOrderFile, setWorkOrderFile] = useState(null);
  const [fsFile, setFsFile] = useState(null);

  // MASTER DATA STATES
  const [financialYears, setFinancialYears] = useState([]);
  const [states, setStates] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projectStages, setProjectStages] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [pcs, setPcs] = useState([]);
  const [fundingPattern, setFundingPattern] = useState([]);

  useEffect(() => {
  fetch("http://localhost:5000/api/financial-year")
    .then(res => res.json())
    .then(data => setFinancialYears(data));

  fetch("http://localhost:5000/api/state")
    .then(res => res.json())
    .then(data => setStates(data));

  fetch("http://localhost:5000/api/division")
    .then(res => res.json())
    .then(data => setDivisions(data));

  fetch("http://localhost:5000/api/district")
    .then(res => res.json())
    .then(data => setDistricts(data));

  fetch("http://localhost:5000/api/project-department")
    .then(res => res.json())
    .then(data => setDepartments(data));

  fetch("http://localhost:5000/api/project-stage")
    .then(res => res.json())
    .then(data => setProjectStages(data));

  fetch("http://localhost:5000/api/assembly")
    .then(res => res.json())
    .then(data => setAssemblies(data));

  fetch("http://localhost:5000/api/pcmaster")
    .then(res => res.json())
    .then(data => setPcs(data));

}, []);
  const validateDates = () => {
  const sanction = formData.dateOfSanction
    ? new Date(formData.dateOfSanction)
    : null;

  const start = formData.projectStartDate
    ? new Date(formData.projectStartDate)
    : null;

  const end = formData.projectCompletionDate
    ? new Date(formData.projectCompletionDate)
    : null;

  const revisedEnd = formData.revisedProjectCompletionDate
    ? new Date(formData.revisedProjectCompletionDate)
    : null;

  if (sanction && start && sanction > start)
    return "Sanction must be before start";

  if (start && end && start > end)
    return "End must be after start";

  if (start && revisedEnd && revisedEnd < start)
    return "Revised end must be after start";

  return "";
};


  const validateField = (key, value) => {
  let error = "";

  switch (key) {
    case "projectName":
      if (!value.trim()) error = "Project Name is required";
      break;

    case "ownerDept":
      if (!value) error = "Owner Department is required";
      break;

    case "financialYear":
      if (!value) error = "Financial Year is required";
      break;

    case "location":
      if (!value.trim()) error = "Location is required";
      break;

    case "projectCost":
      if (!value) error = "Project Cost is required";
      else if (value < 0) error = "Cost cannot be negative";
      break;

    case "dateOfSanction":
    case "projectStartDate":
    case "projectCompletionDate":
    case "revisedProjectCompletionDate":
      error = validateDates(key, value);
      break;

    default:
      break;
  }
  
  setErrors(prev => ({ ...prev, [key]: error }));
};


  const handleChange = (key, value) => {
  setFormData(prev => {
    const updated = { ...prev, [key]: value };
    return updated;
  });

  validateField(key, value); // ✅ real-time validation
};


  useEffect(() => {
  const timeOverrun = calculateTimeOverrun();
  const costOverrun = calculateCostOverrun();
  const financialPercent = calculateFinancialProgress();

  setFormData((prev) => ({
    ...prev,
    projectTimeOverrun: timeOverrun,
    costOverrun: costOverrun,
    financialProgressPercent: financialPercent
  }));
}, [
  formData.projectCompletionDate,
  formData.revisedProjectCompletionDate,
  formData.projectCost,
  formData.revisedCost,
  formData.financialProgressAmount
]);
  useEffect(() => {
  if (formData.autoFillBrief) {
    const description = generateBriefDescription();

    setFormData((prev) => ({
      ...prev,
      briefDescription: description
    }));
  }
}, [
  formData.autoFillBrief,
  formData.projectName,
  formData.ownerDept,
  formData.location,
  formData.projectStage,
  formData.modeOfImplementation,
  formData.populationBenefited,
  formData.townsBenefited,
  formData.projectStartDate,
  formData.projectCompletionDate,
  formData.projectCost,
  formData.financialProgressAmount,
  formData.financialProgressPercent,
  formData.contractorName
]);


  const toggle = (key) =>
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));

  const validateForm = () => {
    let newErrors = {};
    const sanction = formData.dateOfSanction ? new Date(formData.dateOfSanction) : null;
    const start = formData.projectStartDate ? new Date(formData.projectStartDate) : null;
    const end = formData.projectCompletionDate ? new Date(formData.projectCompletionDate) : null;
    const revisedEnd = formData.revisedProjectCompletionDate
      ? new Date(formData.revisedProjectCompletionDate)
      : null;

    if (!formData.projectName?.trim())
      newErrors.projectName = "Project Name is required";
    if (!formData.ownerDept)
      newErrors.ownerDept = "Owner Department is required";
    if (!formData.financialYear)
      newErrors.financialYear = "Financial Year is required";
    if (!formData.location?.trim())
      newErrors.location = "Location is required";
    if (!formData.projectStage)
      newErrors.projectStage = "Project Stage is required";
    if (!formData.modeOfImplementation)
      newErrors.modeOfImplementation = "Mode of Implementation is required";
    if (!formData.implementingDepartment)      
      newErrors.implementingDepartment = "Implementing Department is required";
    if (!formData.mlaConstituency)
        newErrors.mlaConstituency = "MLA Constituency is required";
    if (!formData.parliamentConstituency)
        newErrors.parliamentConstituency = "Parliament Constituency is required";
    if (!formData.townsBenefited?.trim())
      newErrors.townsBenefited = "Towns Benefited is required";
    if (!formData.populationBenefited)
      newErrors.populationBenefited = "Population Benefited is required";
    if (!formData.contractorName?.trim())
      newErrors.contractorName = "Contractor Name is required";
    if (!formData.dateOfSanction)
      newErrors.dateOfSanction = "Date of Sanction is required";
    if (!formData.projectStartDate)
      newErrors.projectStartDate = "Project Start Date is required";
    if (!formData.projectCompletionDate)
      newErrors.projectCompletionDate = "Project Completion Date is required";
    if (!formData.projectCost)
      newErrors.projectCost = "Project Cost is required";
    if (!formData.fundingBy?.trim())
      newErrors.fundingBy = "Funding By is required";

    // File validations
    if (formData.isWorkOrderGenerated && !workOrderFile) {
      newErrors.workOrderFile = "Work Order file is required";
    }
    if (formData.isFsGenerated && !fsFile) {
      newErrors.fsFile = "FS file is required";
    }

    // Date validations
    if (sanction && start && sanction > start) {
      newErrors.dateOfSanction = "Sanction date must be before start date";
    }
    if (start && end && start > end) {
      newErrors.projectCompletionDate = "End date must be after start date";
    }
    if (start && revisedEnd && revisedEnd < start) {
      newErrors.revisedProjectCompletionDate =
        "Revised completion date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const calculateFinancialProgress = () => {
  const amount = parseFloat(formData.financialProgressAmount || 0);
  const total = parseFloat(formData.projectCost || 0);

  if (total > 0) {
    return ((amount / total) * 100).toFixed(2);
  }

  return 0;
  };
  const generateBriefDescription = () => {
  return `
Project "${formData.projectName}" is being executed under ${formData.ownerDept} department in ${formData.location}.

The project is currently in "${formData.projectStage}" stage and is being implemented through ${formData.modeOfImplementation} mode.

It aims to benefit approximately ${formData.populationBenefited} people across ${formData.townsBenefited} towns/villages.

The project started on ${formData.projectStartDate} and is expected to be completed by ${formData.projectCompletionDate}.

The total project cost is ₹${formData.projectCost} Cr, with current financial progress of ₹${formData.financialProgressAmount} Cr (${formData.financialProgressPercent}%).

Contractor for this project is ${formData.contractorName}.
  `.trim();
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const formPayload = new FormData();

    // append ALL fields ONCE
    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      if (value !== null && value !== undefined) {
        formPayload.append(key, value);
      }
    });
    // append FILES properly
    if (workOrderFile) {
      formPayload.append("workOrderFile", workOrderFile);
    }
    if (fsFile) {
      formPayload.append("fsFile", fsFile);
    }
    formPayload.delete("fundingPattern"); // safety

    formPayload.append(
      "fundingPattern",
      JSON.stringify(fundingData.length ? fundingData : [])
    );
    
    formPayload.delete("phases");

    formPayload.append(
      "phases",
      JSON.stringify(phaseData.length ? phaseData : [])
    );


    try {
      const response = await fetch("http://localhost:5000/api/projectOnboarding", {
        method: "POST",
        body: formPayload
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.error);
        return;
      }
      if (result.success) {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };



  const handleNew = () => {
    setFormData(initialState);
    setErrors({});
    setShowSuccess(false);
    setWorkOrderFile(null);
    setFsFile(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">Project Onboarding</div>

      <form className="page-form" onSubmit={handleSubmit}>
        {/* ===== BASIC DETAILS ===== */}
        <div className="form-grid">
          <div className="form-group">
            <label>Project Name</label>
            <input
              value={formData.projectName}
              onChange={(e) => handleChange("projectName", e.target.value)}
            />
            {errors.projectName && (
              <span className="error-text">{errors.projectName}</span>
            )}
          </div>

          <div className="form-group">
            <label>Owner / Administrator Dept</label>
            <select
              value={formData.ownerDept}
              onChange={(e) =>
                handleChange("ownerDept", e.target.value)
              }
            >
              <option value="">Select</option>
              {departments.map((dept, index) => (
              <option
                key={`${dept.CMO_DEPARTMENTID}-${index}`}
                value={dept.CMO_DEPARTMENTID}
              >
                {dept.DEPTNAME}
              </option>
            ))}


            </select>

            {errors.ownerDept && (
              <span className="error-text">{errors.ownerDept}</span>
            )}
          </div>

          <div className="form-group">
            <label>Financial Year</label>
            <select
              value={formData.financialYear}
              onChange={(e) => handleChange("financialYear", e.target.value)}
            >
              <option value="">Select</option>
              {financialYears.map((fy) => (
              <option key={fy.TRN_FYID} value={fy.FY}>
                {fy.FY}
              </option>
            ))}

            </select>

            {errors.financialYear && (
              <span className="error-text">{errors.financialYear}</span>
            )}

          </div>

          <div className="form-group">
            <label>Location</label>
            <select
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            >
              <option value="">Select</option>
              {districts.map((d, index) => (
              <option key={d.DISTRICTCODE} value={d.DISTRICTCODE}>
                {d.DISTRICTNAME}
              </option>

            ))}
            </select>

            {errors.location && (
              <span className="error-text">{errors.location}</span>
            )}
          </div>

          <div className="form-group">
            <label>Project Stage</label>
            <select
              value={formData.projectStage}
              onChange={(e) =>
                handleChange("projectStage", e.target.value)
              }
            >
              <option value="">Select</option>
              {projectStages.map((ps, index) => (
                <option
                  key={ps.PRJ_STAGE_HDRID}
                  value={ps.PRJ_STAGE_HDRID}
                >
                  {ps.PRJ_STAGE}
                </option>
              ))}

            </select>

            {errors.projectStage && (
              <span className="error-text">{errors.projectStage}</span>
            )}

          </div>

          <div className="form-group">
            <label>Mode of Implementation</label>
            <select
              value={formData.modeOfImplementation}
              onChange={(e) =>
                handleChange("modeOfImplementation", e.target.value)
              }
            >
              <option value="">Select an option</option>
              <option>Departmental</option>
              <option>Agency</option>
            </select>
            {errors.modeOfImplementation && (
  <span className="error-text">{errors.modeOfImplementation}</span>
)}

          </div>

          <div className="form-group">
            <label>Implementing Department</label>
            <select
              value={formData.implementingDepartment}
              onChange={(e) =>
                handleChange("implementingDepartment", e.target.value)
              }
            >
              <option value="">Select</option>
              {departments.map((dept, index) => (
                <option
                  key={`${dept.CMO_DEPARTMENTID}-${index}`}
                  value={dept.DEPTNAME}
                >
                  {dept.DEPTNAME}
                </option>
              ))}
            </select>

            {errors.implementingDepartment && (
  <span className="error-text">{errors.implementingDepartment}</span>
)}

          </div>

          <div className="form-group">
            <label>Implementing Agency</label>
            <select
              value={formData.implementingAgency}
              onChange={(e) =>
                handleChange("implementingAgency", e.target.value)
              }
            >
              <option value="">Select</option>
              {departments.map((dept, index) => (
              <option key={`${dept.DEPTID}-${index}`} value={dept.DEPTNAME}>
                {dept.DEPTNAME}
              </option>
            ))}

            </select>

            {errors.implementingAgency && (
  <span className="error-text">{errors.implementingAgency}</span>
)}

          </div>

          <div className="form-group">
            <label>MLA Constituency</label>
            <select
              value={formData.mlaConstituency}
              onChange={(e) =>
                handleChange("mlaConstituency", e.target.value)
              }
            >
              <option value="">Select</option>
              {assemblies.map((a, index) => (
              <option key={`${a.ASSEMBLYID}-${index}`} value={a.ASSEMBLYID}>                {a.ASC_NAME}
              </option>
            ))}

            </select>

            {errors.mlaConstituency && (
  <span className="error-text">{errors.mlaConstituency}</span>
)}

          </div>

          <div className="form-group">
            <label>Parliament Constituency</label>
            <select
              value={formData.parliamentConstituency}
              onChange={(e) =>
                handleChange("parliamentConstituency", e.target.value)
              }
            >
              <option value="">Select</option>
              {pcs.map((pc, index) => (
              <option key={`${pc.PCID}-${index}`} value={pc.PCID}>                {pc.PRC_NAME}
              </option>
            ))}

            </select>

            {errors.parliamentConstituency && (
  <span className="error-text">{errors.parliamentConstituency}</span>
)}

          </div>

          <div className="form-group">
            <label>No. of Towns & Villages to be Benefited</label>
            <input
              type="number"
              value={formData.townsBenefited}
              onChange={(e) =>
                handleChange("townsBenefited", e.target.value)
              }
            />
            {errors.townsBenefited && (
  <span className="error-text">{errors.townsBenefited}</span>
)}

          </div>

          <div className="form-group">
            <label>Population to be Benefited</label>
            <input
              type="number"
              value={formData.populationBenefited}
              onChange={(e) =>
                handleChange("populationBenefited", e.target.value)
              }
            />
            {errors.populationBenefited && (
  <span className="error-text">{errors.populationBenefited}</span>
)}

          </div>

          <div className="form-group">
            <label>Physical Progress</label>
            <input
              value={formData.physicalProgress}
              onChange={(e) =>
                handleChange("physicalProgress", e.target.value)
              }
            />
            {errors.physicalProgress && (
  <span className="error-text">{errors.physicalProgress}</span>
)}

          </div>

          <div className="form-group">
            <label>Physical Progress %</label>
            <input
              type="number"
              value={formData.physicalProgressPercent}
              onChange={(e) =>
                handleChange("physicalProgressPercent", e.target.value)
              }
            />
            {errors.physicalProgressPercent && (
  <span className="error-text">{errors.physicalProgressPercent}</span>
)}

          </div>
        </div>   
        <div className="form-grid">
          {/* Toggles */}
          <div className="form-group toggle-group">
            <label>Auto Fill Brief Description</label>
            <div
              className={`toggle ${formData.autoFillBrief ? "active" : ""}`}
              onClick={() => toggle("autoFillBrief")}
            >
              <span className="circle" />
            </div>
          </div>

          <div className="form-group toggle-group">
            <label>Is Work Order Generated?</label>
            <div
              className={`toggle ${formData.isWorkOrderGenerated ? "active" : ""}`}
              onClick={() => toggle("isWorkOrderGenerated")}
            >
              <span className="circle" />
            </div>
          </div>
          {formData.isWorkOrderGenerated && (
            <div className="form-group">
            <label>Upload Work Order File</label>
            <input
              type="file"
              name="workOrderFile"
              onChange={(e) => setWorkOrderFile(e.target.files[0])}
            />

          </div>
          )}

          <div className="form-group toggle-group">
            <label>Is FS Generated?</label>
            <div
              className={`toggle ${formData.isFsGenerated ? "active" : ""}`}
              onClick={() => toggle("isFsGenerated")}
            >
              <span className="circle" />
            </div>
          </div>
          {formData.isFsGenerated && (
            <div className="form-group">
              <label>Upload FS File</label>
              <input
                type="file"
                name="fsFile"
                onChange={(e) => setFsFile(e.target.files[0])}
              />

              {errors.fsFile && (
                <span className="error-text">{errors.fsFile}</span>
              )}
            </div>
          )}
        </div>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Brief Description of Project</label>
            <textarea
              rows="4"
              value={formData.briefDescription}
              onChange={(e) =>
                handleChange("briefDescription", e.target.value)
              }
            />
            {errors.briefDescription && (
  <span className="error-text">{errors.briefDescription}</span>
)}

          </div>
        </div>

        {/* ===== OTHER DETAILS ===== */}
        <h3 className="section-title">Other Details</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Contractor Name</label>
            <input
              value={formData.contractorName}
              onChange={(e) =>
                handleChange("contractorName", e.target.value)
              }
            />
            {errors.contractorName && (
  <span className="error-text">{errors.contractorName}</span>
)}

          </div>

          <div className="form-group">
            <label>Date of Sanction</label>
            <input
              type="date"
              value={formData.dateOfSanction}
              onChange={(e) =>
                handleChange("dateOfSanction", e.target.value)
              }
            />
            {errors.dateOfSanction && (
  <span className="error-text">{errors.dateOfSanction}</span>
)}

          </div>

          <div className="form-group">
            <label>Project Start Date</label>
            <input
              type="date"
              value={formData.projectStartDate}
              onChange={(e) =>
                handleChange("projectStartDate", e.target.value)
              }
            />
            {errors.projectStartDate && (
  <span className="error-text">{errors.projectStartDate}</span>
)}

          </div>

          <div className="form-group">
            <label>Revised Start Date</label>
            <input
              type="date"
              value={formData.revisedStartDate}
              onChange={(e) =>
                handleChange("revisedStartDate", e.target.value)
              }
            />
            {errors.revisedStartDate && (
  <span className="error-text">{errors.revisedStartDate}</span>
)}

          </div>

          <div className="form-group">
            <label>Project Completion Date</label>
            <input
              type="date"
              value={formData.projectCompletionDate}
              onChange={(e) =>
                handleChange("projectCompletionDate", e.target.value)
              }
            />
            {errors.projectCompletionDate && (
  <span className="error-text">{errors.projectCompletionDate}</span>
)}

          </div>

          <div className="form-group">
            <label>Revised Project Completion Date</label>
            <input
              type="date"
              value={formData.revisedProjectCompletionDate}
              onChange={(e) =>
                handleChange(
                  "revisedProjectCompletionDate",
                  e.target.value
                )
              }
            />
            {errors.revisedProjectCompletionDate && (
  <span className="error-text">{errors.revisedProjectCompletionDate}</span>
)}

          </div>

          <div className="form-group">
            <label>Project Time Over Run (No of Days)</label>
          <input
          type="number"
          value={formData.projectTimeOverrun || 0}
          readOnly
        />
            {errors.projectTimeOverrun && (
  <span className="error-text">{errors.projectTimeOverrun}</span>
)}

          </div>

          <div className="form-group">
            <label>Project Cost (in Cr)</label>
            <input
              type="number"
              value={formData.projectCost}
              onChange={(e) =>
                handleChange("projectCost", e.target.value)
              }
            />
            {errors.projectCost && (
  <span className="error-text">{errors.projectCost}</span>
)}

          </div>

          <div className="form-group">
            <label>Revised Cost (in Cr)</label>
            <input
              type="number"
              value={formData.revisedCost}
              onChange={(e) =>
                handleChange("revisedCost", e.target.value)
              }
            />
            {errors.revisedCost && (
  <span className="error-text">{errors.revisedCost}</span>
)}

          </div>

          <div className="form-group">
            <label>Cost Overrun (in Cr)</label>
            
            {errors.costOverrun && (
  <span className="error-text">{errors.costOverrun}</span>
)}
            <input
              type="number"
              value={formData.costOverrun}
              disabled
            />

          </div>

          <div className="form-group">
            <label>Total Funds Released So Far (in Cr)</label>
            <input
              type="number"
              value={formData.totalFundsReleased}
              onChange={(e) =>
                handleChange("totalFundsReleased", e.target.value)
              }
            />
            {errors.totalFundsReleased && (
  <span className="error-text">{errors.totalFundsReleased}</span>
)}

          </div>

          <div className="form-group">
            <label>Financial Progress / Expenditure (in Cr)</label>
            <input
              type="number"
              value={formData.financialProgressAmount}
              onChange={(e) =>
                handleChange("financialProgressAmount", e.target.value)
              }
            />
            {errors.financialProgressAmount && (
  <span className="error-text">{errors.financialProgressAmount}</span>
)}
          </div>

          <div className="form-group">
            <label>Financial Progress / Expenditure (%)</label>
            
            {errors.financialProgressPercent && (
  <span className="error-text">{errors.financialProgressPercent}</span>
)}      <input
          type="number"
          value={formData.financialProgressPercent}
          disabled
          placeholder="Auto calculated"
        />

          </div>

          <div className="form-group">
            <label>Funding By</label>
            <select
              value={formData.fundingBy}
              onChange={(e) => handleChange("fundingBy", e.target.value)}
            >
              <option value="">Select an option</option>
              <option>State Government</option>
              <option>Central Government</option>
              <option>PPP</option>
            </select>
            {errors.fundingBy && (
  <span className="error-text">{errors.fundingBy}</span>
)}
          </div>

          <div className="form-group">
            <label>Funding By %</label>
            <input
              type="number"
              value={formData.fundingByPercent}
              onChange={(e) =>
                handleChange("fundingByPercent", e.target.value)
              }
            />
            {errors.fundingByPercent && (
  <span className="error-text">{errors.fundingByPercent}</span>
)}
          </div>

          <div className="form-group toggle-group">
          <label>
            Please check and then enter button if you have multiple packages / phases
          </label>
  <div
    className={`toggle ${formData.multiplePackages ? "active" : ""}`}
    onClick={() => toggle("multiplePackages")}
  >
    <span className="circle" />
  </div>
</div>
{formData.multiplePackages && (
  <PackagePhaseDetails onChange={setPhaseData} />
)}

<div className="form-group toggle-group">
  <label>
    Please check if you have multiple funding sources
  </label>

  <div
    className={`toggle ${formData.multipleFundingSources ? "active" : ""}`}
    onClick={() => toggle("multipleFundingSources")}
  >
    <span className="circle" />
  </div>
</div>

{formData.multipleFundingSources && (
  <FundingPattern
    projectName={formData.projectName}
    onChange={(data) => {
      setFundingData(data);
      console.log("Funding Data:", data);
    }}
  />
)}

 </div>

        {/* ✅ SUCCESS POPUP */}
{showSuccess && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h3>Success</h3>
      <p>Project details saved successfully.</p>
      <button
        className="btn submit"
        onClick={() => {
          setShowSuccess(false);
          setFormData(initialState);
        }}
      >
        OK
      </button>
    </div>
  </div>
)}



        {/* ACTIONS */}
        <div className="form-actions">
          <button type="button" className="btn new" onClick={handleNew}>
            New
          </button>
          <button type="submit" className="btn submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectOnboarding;