import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./pages.css";
import FundingPattern from "./FundingPattern";
import PackagePhaseDetails from "./PackagePhaseDetails";

const EditProjectOnboarding = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

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

  const [formData, setFormData] = useState(initialState);

  const [errors, setErrors] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const [workOrderFile, setWorkOrderFile] = useState(null);
  const [fsFile, setFsFile] = useState(null);

  const [financialYears, setFinancialYears] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projectStages, setProjectStages] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [pcs, setPcs] = useState([]);

  const [fundingData, setFundingData] = useState([]);
  const [phaseData, setPhaseData] = useState([]);

  // ================= LOAD MASTER DATA =================

  useEffect(() => {
    fetch("http://localhost:5000/api/financial-year")
      .then((res) => res.json())
      .then((data) => setFinancialYears(data));

    fetch("http://localhost:5000/api/district")
      .then((res) => res.json())
      .then((data) => setDistricts(data));

    fetch("http://localhost:5000/api/project-department")
      .then((res) => res.json())
      .then((data) => setDepartments(data));

    fetch("http://localhost:5000/api/project-stage")
      .then((res) => res.json())
      .then((data) => setProjectStages(data));

    fetch("http://localhost:5000/api/assembly")
      .then((res) => res.json())
      .then((data) => setAssemblies(data));

    fetch("http://localhost:5000/api/pcmaster")
      .then((res) => res.json())
      .then((data) => setPcs(data));
  }, []);

  // ================= LOAD PROJECT DATA =================
// ================= LOAD PROJECT DATA =================
useEffect(() => {

  const projectCost =
    parseFloat(formData.projectCost) || 0;

  const revisedCost =
    parseFloat(formData.revisedCost) || 0;

  const overrun =
    revisedCost - projectCost;

  setFormData((prev) => ({
    ...prev,
    costOverrun: overrun,
  }));

}, [
  formData.projectCost,
  formData.revisedCost,
]);

useEffect(() => {

  const cost =
    parseFloat(formData.projectCost) || 0;

  const progress =
    parseFloat(
      formData.financialProgressAmount
    ) || 0;

  const percent =
    cost > 0
      ? ((progress / cost) * 100).toFixed(2)
      : 0;

  setFormData((prev) => ({
    ...prev,
    financialProgressPercent:
      percent,
  }));

}, [
  formData.projectCost,
  formData.financialProgressAmount,
]);

useEffect(() => {

  if (
    !id ||
    departments.length === 0 ||
    districts.length === 0 ||
    projectStages.length === 0 ||
    assemblies.length === 0 ||
    pcs.length === 0
  ) {
    return;
  }

  const loadProject = async () => {
    try {
      const res = await fetch(
  `http://localhost:5000/api/project/editproject-onboarding/${id}`
);


      const data = await res.json();

      console.log("EDIT DATA =>", data);

      setFormData({
  ...initialState,

  // BASIC DETAILS
  projectName: data.PRJ_NAME || "",

  // MUST MATCH DROPDOWN VALUE
  ownerDept:
  data.DEPTNAME !== null &&
  data.DEPTNAME !== undefined
    ? String(data.DEPTNAME).trim()
    : "",

  financialYear: data.FINYR
    ? String(data.FINYR)
    : "",

  // MUST MATCH DISTRICTCODE
  location:
    data.DISTRICT !== null &&
    data.DISTRICT !== undefined
      ? String(data.DISTRICT)
      : "",

  // MUST MATCH PRJ_STAGE_HDRID
  projectStage:
  data.PRJ_STAGE !== null &&
  data.PRJ_STAGE !== undefined
    ? String(data.PRJ_STAGE).trim()
    : "",

  modeOfImplementation:
    data.MODEOFIMP || "",

  implementingDepartment:
    data.IMPDEPT || "",

  implementingAgency:
    data.IMPAGENCIES || "",

  // MUST MATCH ASSEMBLYID
  mlaConstituency:
    data.MLACONST !== null &&
    data.MLACONST !== undefined
      ? String(data.MLACONST)
      : "",

  // MUST MATCH PCID
  parliamentConstituency:
    data.PARCONST !== null &&
    data.PARCONST !== undefined
      ? String(data.PARCONST)
      : "",

  townsBenefited:
    data.NOOFVILL || "",

  populationBenefited:
    data.POPBEN || "",

  physicalProgress:
    data.CURRENTSLAB || "",

  physicalProgressPercent:
    data.PHYFINPROGPER || "",

  // DESCRIPTION
  briefDescription:
    data.BRFPRJ || "",

  contractorName:
    data.DCONTRACTNAME || "",

  // DATES
  dateOfSanction:
    data.PRJ_DTSANPRJ
      ? data.PRJ_DTSANPRJ.split("T")[0]
      : "",

  projectStartDate:
    data.PRJ_STARTDT
      ? data.PRJ_STARTDT.split("T")[0]
      : "",

  revisedStartDate:
    data.PRJ_REVPRJDT
      ? data.PRJ_REVPRJDT.split("T")[0]
      : "",

  projectCompletionDate:
    data.PRJ_COMPLEPRJDT
      ? data.PRJ_COMPLEPRJDT.split("T")[0]
      : "",

  revisedProjectCompletionDate:
    data.PRJ_REVCOMPLEDT
      ? data.PRJ_REVCOMPLEDT.split("T")[0]
      : "",

  // COST DETAILS
  projectCost:
    data.PRJ_COST || "",

  revisedCost:
    data.PRJ_REVCOST || "",

  costOverrun:
    data.PRJ_COSTOVERRUN || "",

  projectTimeOverrun:
    data.PRJ_TIMEOVRRUN || "",

  // FUNDING
  totalFundsReleased:
    data.PRJ_TOTFUN || "",

  financialProgressAmount:
    data.PRJ_FINPRG !== null &&
    data.PRJ_FINPRG !== undefined
      ? String(data.PRJ_FINPRG)
      : "",

  financialProgressPercent:
    data.PRJ_FINPRGPER || "",

  fundingBy:
    data.PRJ_FUNDBY || "",

  fundingByPercent:
    data.PRJ_FUNDYPER || "",

  // TOGGLES
  autoFillBrief:
    data.AFILL === "Y",

  isWorkOrderGenerated:
    data.WORKSTARTED === "Y",

  isFsGenerated:
    data.FSREASON === "Y",

  multiplePackages:
    data.phases &&
    data.phases.length > 0,

  multipleFundingSources:
    data.fundingPattern &&
    data.fundingPattern.length > 0,
});

      // ================= FUNDING =================

      if (data.fundingPattern) {
        const parsedFunding =
          typeof data.fundingPattern === "string"
            ? JSON.parse(data.fundingPattern)
            : data.fundingPattern;

        const mappedFunding =
          parsedFunding.map((f) => ({
            fundingBy:
              f.FUNDBY || "",

            fundingByPercent:
              f.FUNDBYPER || "",
          }));

        setFundingData(mappedFunding);
      }

      // ================= PHASES =================

      if (data.phases) {
        const parsedPhases =
          typeof data.phases === "string"
            ? JSON.parse(data.phases)
            : data.phases;

        const mappedPhases =
          parsedPhases.map((p) => ({
            packagePhase:
              p.PACKAGEPHASE || "",

            contractorName:
              p.PH_CONTRACTNAME || "",

            dateOfSanction:
              p.PH_DTSANPRJ
                ? p.PH_DTSANPRJ.split("T")[0]
                : "",

            startDate:
              p.PH_PRJSTARTDT
                ? p.PH_PRJSTARTDT.split("T")[0]
                : "",

            revisedStartDate:
              p.PH_REVPRJDT
                ? p.PH_REVPRJDT.split("T")[0]
                : "",

            completionDate:
              p.PH_COMPLEDT
                ? p.PH_COMPLEDT.split("T")[0]
                : "",

            revisedCompletionDate:
              p.PH_REVCOMPLEDT
                ? p.PH_REVCOMPLEDT.split("T")[0]
                : "",

            cost:
              p.PH_WORKCOST || "",

            revisedCost:
              p.PH_REVCOST || "",

            costOverrun:
              p.PH_COSTOVERRUN || "",

            totalFunds:
              p.PH_TOTFUN || "",

            financialProgress:
              p.PH_FINPRG || "",

            financialPercent:
              p.PH_FINPRGPER || "",

            physicalProgress:
              p.PH_PHYSPRG || "",

            physicalProgressPercent:
              p.PH_PHYSPRGPER || "",
          }));

        setPhaseData(mappedPhases);
      }
    } catch (err) {
      console.error(
        "Error loading project:",
        err
      );
    }
  };

  loadProject();
}, [
  id,
  departments,
  districts,
  projectStages,
  assemblies,
  pcs,
]);

  // ================= HANDLE CHANGE =================

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  // ================= AUTO BRIEF =================

const getDeptName = (id) => {
  const dept = departments.find(
    (d) =>
      String(d.CMO_DEPARTMENTID) ===
      String(id)
  );

  return dept ? dept.DEPTNAME : "";
};

const getDistrictName = (id) => {
  const district = districts.find(
    (d) =>
      String(d.DISTRICTCODE) === String(id)
  );

  return district
    ? district.DISTRICTNAME
    : "";
};

const getStageName = (id) => {
  const stage = projectStages.find(
    (p) =>
      String(p.PRJ_STAGE_HDRID) === String(id)
  );

  return stage ? stage.PRJ_STAGE : "";
};

const generateBriefDescription = () => {
  return `
Project "${formData.projectName}" is being executed under ${getDeptName(formData.ownerDept)} department in ${getDistrictName(formData.location)}.

The project is currently in "${getStageName(formData.projectStage)}" stage and is being implemented through ${formData.modeOfImplementation} mode.

It aims to benefit approximately ${formData.populationBenefited} people across ${formData.townsBenefited} towns/villages.

The project started on ${formData.projectStartDate} and is expected to be completed by ${formData.projectCompletionDate}.

The total project cost is ₹${formData.projectCost} Cr, with current financial progress of ₹${formData.financialProgressAmount} Cr (${formData.financialProgressPercent}%).

Contractor for this project is ${formData.contractorName}.
  `.trim();
};

// ================= FULL AUTO FILL =================

const autoFillEntireForm = () => {

  // ================= MAIN FORM =================

  const updatedForm = {
    ...formData,

    briefDescription:
      generateBriefDescription(),

    financialProgressPercent:
      formData.projectCost > 0
        ? (
            (parseFloat(
              formData.financialProgressAmount || 0
            ) /
              parseFloat(
                formData.projectCost || 0
              )) *
            100
          ).toFixed(2)
        : 0,

    costOverrun:
      (parseFloat(
        formData.revisedCost || 0
      ) || 0) -
      (parseFloat(
        formData.projectCost || 0
      ) || 0),
  };

  setFormData(updatedForm);

  // ================= FUNDING AUTO FILL =================

  if (
    formData.multipleFundingSources &&
    fundingData.length > 0
  ) {

    const autoFunding =
      fundingData.map((item) => ({
        ...item,

        fundingBy:
          item.fundingBy ||
          formData.fundingBy,

        fundingByPercent:
          item.fundingByPercent ||
          formData.fundingByPercent,
      }));

    setFundingData(autoFunding);
  }

  // ================= PACKAGE AUTO FILL =================

  if (
    formData.multiplePackages &&
    phaseData.length > 0
  ) {

    const autoPhases =
      phaseData.map((phase, index) => {

        const phaseCost =
          parseFloat(
            phase.cost || 0
          );

        const revisedPhaseCost =
          parseFloat(
            phase.revisedCost || 0
          );

        const finAmount =
          parseFloat(
            phase.financialProgress || 0
          );

        return {
          ...phase,

          contractorName:
            phase.contractorName ||
            formData.contractorName,

          dateOfSanction:
            phase.dateOfSanction ||
            formData.dateOfSanction,

          startDate:
            phase.startDate ||
            formData.projectStartDate,

          revisedStartDate:
            phase.revisedStartDate ||
            formData.revisedStartDate,

          completionDate:
            phase.completionDate ||
            formData.projectCompletionDate,

          revisedCompletionDate:
            phase.revisedCompletionDate ||
            formData.revisedProjectCompletionDate,

          costOverrun:
            revisedPhaseCost -
            phaseCost,

          financialPercent:
            phaseCost > 0
              ? (
                  (finAmount /
                    phaseCost) *
                  100
                ).toFixed(2)
              : 0,
        };
      });

    setPhaseData(autoPhases);
  }
};

useEffect(() => {

  if (!formData.autoFillBrief) return;

  // ================= MAIN FORM =================

  setFormData((prev) => ({
    ...prev,

    briefDescription:
      generateBriefDescription(),

    financialProgressPercent:
      parseFloat(prev.projectCost || 0) > 0
        ? (
            (parseFloat(
              prev.financialProgressAmount || 0
            ) /
              parseFloat(
                prev.projectCost || 0
              )) *
            100
          ).toFixed(2)
        : 0,

    costOverrun:
      (parseFloat(prev.revisedCost || 0) || 0) -
      (parseFloat(prev.projectCost || 0) || 0),
  }));

  // ================= FUNDING AUTO FILL =================

  if (
    formData.multipleFundingSources &&
    fundingData.length > 0
  ) {

    const updatedFunding =
      fundingData.map((item) => ({
        ...item,

        fundingBy:
          formData.fundingBy || "",

        fundingByPercent:
          formData.fundingByPercent || "",
      }));

    setFundingData(updatedFunding);
  }

  // ================= PACKAGE AUTO FILL =================

  if (
    formData.multiplePackages &&
    phaseData.length > 0
  ) {

    const updatedPhases =
      phaseData.map((phase) => {

        const phaseCost =
          parseFloat(phase.cost || 0);

        const revisedPhaseCost =
          parseFloat(phase.revisedCost || 0);

        const finAmount =
          parseFloat(
            phase.financialProgress || 0
          );

        return {
          ...phase,

          contractorName:
            formData.contractorName || "",

          dateOfSanction:
            formData.dateOfSanction || "",

          startDate:
            formData.projectStartDate || "",

          revisedStartDate:
            formData.revisedStartDate || "",

          completionDate:
            formData.projectCompletionDate || "",

          revisedCompletionDate:
            formData.revisedProjectCompletionDate || "",

          costOverrun:
            revisedPhaseCost - phaseCost,

          financialPercent:
            phaseCost > 0
              ? (
                  (finAmount / phaseCost) *
                  100
                ).toFixed(2)
              : 0,
        };
      });

    setPhaseData(updatedPhases);
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
  formData.revisedStartDate,
  formData.revisedProjectCompletionDate,

  formData.projectCost,
  formData.revisedCost,

  formData.financialProgressAmount,

  formData.contractorName,

  formData.fundingBy,
  formData.fundingByPercent,
]);

  // ================= VALIDATION =================

  const validateForm = () => {
    let newErrors = {};

    if (!formData.projectName)
      newErrors.projectName = "Project Name required";

    if (!formData.ownerDept)
      newErrors.ownerDept = "Owner Department required";

    if (!formData.projectCost)
      newErrors.projectCost = "Project Cost required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= UPDATE API =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formPayload = new FormData();

    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });

    if (workOrderFile) {
      formPayload.append("workOrderFile", workOrderFile);
    }

    if (fsFile) {
      formPayload.append("fsFile", fsFile);
    }

    formPayload.append(
      "fundingPattern",
      JSON.stringify(fundingData)
    );

    formPayload.append(
      "phases",
      JSON.stringify(phaseData)
    );

    try {
      const response = await fetch(
        `http://localhost:5000/api/project/editproject-onboarding/${id}`,
        {
          method: "PUT",
          body: formPayload,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.error);
        return;
      }

      setShowSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= UI =================
return (
  <div className="page-container">

    <div className="page-header">
      Edit Project Onboarding
    </div>

    <form
      className="page-form"
      onSubmit={handleSubmit}
    >

      {/* ================= BASIC DETAILS ================= */}

      <div className="form-grid">

        {/* PROJECT NAME */}
        <div className="form-group">
          <label>Project Name</label>

          <input
            type="text"
            value={formData.projectName || ""}
            onChange={(e) =>
              handleChange(
                "projectName",
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
  <label>Owner / Administrator Dept</label>

  <select
  value={String(formData.ownerDept || "")}
  onChange={(e) =>
    handleChange(
      "ownerDept",
      e.target.value
    )
  }
>
  <option value="">Select</option>

  {departments.map((dept) => (
    <option
      key={dept.CMO_DEPARTMENTID}
      value={String(dept.CMO_DEPARTMENTID).trim()}
    >
      {dept.DEPTNAME}
    </option>
  ))}
</select>

  {errors.ownerDept && (
    <span className="error-text">
      {errors.ownerDept}
    </span>
  )}
</div>
        {/* FINANCIAL YEAR */}
        <div className="form-group">
          <label>Financial Year</label>

          <select
            value={
              formData.financialYear || ""
            }
            onChange={(e) =>
              handleChange(
                "financialYear",
                e.target.value
              )
            }
          >
            <option value="">
              Select
            </option>

            {financialYears.map(
              (fy, index) => (
                <option
                  key={
                    fy.TRN_FYID ||
                    index
                  }
                  value={fy.FY}
                >
                  {fy.FY}
                </option>
              )
            )}
          </select>
        </div>

        {/* LOCATION */}
        <div className="form-group">
          <label>Location</label>

          <select
            value={formData.location || ""}
            onChange={(e) =>
              handleChange(
                "location",
                e.target.value
              )
            }
          >
            <option value="">
              Select
            </option>

            {districts.map(
              (d, index) => (
                <option
                  key={
                    d.DISTRICTCODE ||
                    index
                  }
                  value={String(
                    d.DISTRICTCODE
                  )}
                >
                  {d.DISTRICTNAME}
                </option>
              )
            )}
          </select>
        </div>

        {/* PROJECT STAGE */}
        <div className="form-group">
          <label>Project Stage</label>

          <select
  value={String(formData.projectStage || "")}
  onChange={(e) =>
    handleChange(
      "projectStage",
      e.target.value
    )
  }
>
  <option value="">Select</option>

  {projectStages.map((ps) => (
    <option
      key={ps.PRJ_STAGE_HDRID}
      value={String(ps.PRJ_STAGE_HDRID).trim()}
    >
      {ps.PRJ_STAGE}
    </option>
  ))}
</select>
        </div>

        {/* MODE OF IMPLEMENTATION */}
        <div className="form-group">
          <label>
            Mode of Implementation
          </label>

          <select
            value={
              formData.modeOfImplementation ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "modeOfImplementation",
                e.target.value
              )
            }
          >
            <option value="">
              Select
            </option>

            <option value="Departmental">
              Departmental
            </option>

            <option value="Agency">
              Agency
            </option>
          </select>
        </div>

        {/* IMPLEMENTING DEPARTMENT */}
<div className="form-group">
  <label>
    Implementing Department
  </label>

  <select
    value={
      formData.implementingDepartment || ""
    }
    onChange={(e) =>
      handleChange(
        "implementingDepartment",
        e.target.value
      )
    }
  >
    <option value="">
      Select
    </option>

    {departments.map((dept, index) => (
      <option
        key={`${dept.DEPTID}-${index}`}
        value={String(dept.DEPTNAME)}
      >
        {dept.DEPTNAME}
      </option>
    ))}
  </select>
</div>

{/* IMPLEMENTING AGENCY */}
<div className="form-group">
  <label>
    Implementing Agency
  </label>

 <select
  value={String(formData.implementingAgency || "")}
  onChange={(e) =>
    handleChange(
      "implementingAgency",
      e.target.value
    )
  }
>
  <option value="">Select</option>

  {departments.map((dept, index) => (
    <option
      key={index}
      value={dept.DEPTNAME}
    >
      {dept.DEPTNAME}
    </option>
  ))}
</select>
</div>

       {/* MLA */}
<div className="form-group">
  <label>
    MLA Constituency
  </label>

  <select
  value={String(formData.mlaConstituency || "")}
  onChange={(e) =>
    handleChange(
      "mlaConstituency",
      e.target.value
    )
  }
>
  <option value="">Select</option>

  {assemblies.map((a) => (
    <option
  key={a.ASSEMBLYID}
  value={a.ASC_NAME}
>
  {a.ASC_NAME}
</option>
  ))}
</select>
</div>

        {/* PARLIAMENT */}
<div className="form-group">
  <label>
    Parliament Constituency
  </label>

  <select
  value={String(formData.parliamentConstituency || "")}
  onChange={(e) =>
    handleChange(
      "parliamentConstituency",
      e.target.value
    )
  }
>
  <option value="">Select</option>

  {pcs.map((pc) => (
    <option
  key={pc.PCID}
  value={pc.PRC_NAME}
>
  {pc.PRC_NAME}
</option>
  ))}
</select>
</div>

        {/* TOWNS */}
        <div className="form-group">
          <label>
            Towns / Villages Benefited
          </label>

          <input
            type="text"
            value={
              formData.townsBenefited || ""
            }
            onChange={(e) =>
              handleChange(
                "townsBenefited",
                e.target.value
              )
            }
          />
        </div>

        {/* POPULATION */}
        <div className="form-group">
          <label>
            Population Benefited
          </label>

          <input
            type="number"
            value={
              formData.populationBenefited ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "populationBenefited",
                e.target.value
              )
            }
          />
        </div>

        {/* PHYSICAL PROGRESS */}
        <div className="form-group">
          <label>
            Physical Progress
          </label>

          <input
            type="text"
            value={
              formData.physicalProgress ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "physicalProgress",
                e.target.value
              )
            }
          />
        </div>

        {/* PHYSICAL PROGRESS % */}
        <div className="form-group">
          <label>
            Physical Progress %
          </label>

          <input
            type="number"
            value={
              formData.physicalProgressPercent ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "physicalProgressPercent",
                e.target.value
              )
            }
          />
        </div>

      </div>

      {/* ================= BRIEF DESCRIPTION ================= */}

      <div className="form-grid">

        <div className="form-group full-width">

          <label>
            Brief Description
          </label>

          <textarea
            rows="5"
            value={
              formData.briefDescription ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "briefDescription",
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* ================= OTHER DETAILS ================= */}

      <h3 className="section-title">
        Other Details
      </h3>

      <div className="form-grid">

        <div className="form-group">
          <label>
            Date of Sanction
          </label>

          <input
            type="date"
            value={
              formData.dateOfSanction ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "dateOfSanction",
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Project Start Date
          </label>

          <input
            type="date"
            value={
              formData.projectStartDate ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "projectStartDate",
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Revised Start Date
          </label>

          <input
            type="date"
            value={
              formData.revisedStartDate ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "revisedStartDate",
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Project Completion Date
          </label>

          <input
            type="date"
            value={
              formData.projectCompletionDate ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "projectCompletionDate",
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Revised Completion Date
          </label>

          <input
            type="date"
            value={
              formData.revisedProjectCompletionDate ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "revisedProjectCompletionDate",
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Project Cost (Cr)
          </label>

          <input
            type="number"
            value={
              formData.projectCost || ""
            }
            onChange={(e) =>
              handleChange(
                "projectCost",
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Revised Cost (Cr)
          </label>

          <input
            type="number"
            value={
              formData.revisedCost || ""
            }
            onChange={(e) =>
              handleChange(
                "revisedCost",
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Cost Overrun
          </label>

          <input
            type="number"
            disabled
            value={
              formData.costOverrun || ""
            }
          />
        </div>

        <div className="form-group">
          <label>
            Project Time Overrun
          </label>

          <input
            type="number"
            disabled
            value={
              formData.projectTimeOverrun ||
              ""
            }
          />
        </div>

        <div className="form-group">
          <label>
            Total Funds Released
          </label>

          <input
            type="number"
            value={
              formData.totalFundsReleased ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "totalFundsReleased",
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Financial Progress Amount
          </label>

          <input
            type="number"
            value={
              formData.financialProgressAmount ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "financialProgressAmount",
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Financial Progress %
          </label>

          <input
            type="number"
            disabled
            value={
              formData.financialProgressPercent ||
              ""
            }
          />
        </div>

        <div className="form-group">
          <label>Funding By</label>

          <select
            value={
              formData.fundingBy || ""
            }
            onChange={(e) =>
              handleChange(
                "fundingBy",
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
        </div>

        <div className="form-group">
          <label>
            Funding %
          </label>

          <input
            type="number"
            value={
              formData.fundingByPercent ||
              ""
            }
            onChange={(e) =>
              handleChange(
                "fundingByPercent",
                e.target.value
              )
            }
          />
        </div>

      </div>

      {/* ================= MULTIPLE PACKAGES ================= */}

      <div className="form-group toggle-group">

        <label>
          Multiple Packages / Phases
        </label>

        <div
          className={`toggle ${
            formData.multiplePackages
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleChange(
              "multiplePackages",
              !formData.multiplePackages
            )
          }
        >
          <span className="circle" />
        </div>

      </div>

      {formData.multiplePackages && (
        <PackagePhaseDetails
          existingData={phaseData || []}
          onChange={setPhaseData}
        />
      )}

      {/* ================= MULTIPLE FUNDING ================= */}

      <div className="form-group toggle-group">

        <label>
          Multiple Funding Sources
        </label>

        <div
          className={`toggle ${
            formData.multipleFundingSources
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleChange(
              "multipleFundingSources",
              !formData.multipleFundingSources
            )
          }
        >
          <span className="circle" />
        </div>

      </div>

      {formData.multipleFundingSources && (
        <FundingPattern
          existingData={fundingData || []}
          projectName={
            formData.projectName || ""
          }
          onChange={setFundingData}
        />
      )}

      {/* ================= ACTIONS ================= */}

      <div className="form-actions">

        <button
          type="button"
          className="btn new"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn submit"
        >
          Update
        </button>

      </div>

    </form>

    {/* ================= SUCCESS POPUP ================= */}

    {showSuccess && (
      <div className="popup-overlay">

        <div className="popup-box">

          <h3>Success</h3>

          <p>
            Project updated successfully.
          </p>

          <button
            className="btn submit"
            onClick={() => {
              setShowSuccess(false);
              navigate("/dashboard");
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

export default EditProjectOnboarding;