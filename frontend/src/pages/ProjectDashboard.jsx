import { useEffect, useState } from "react";
import axios from "axios";
import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ProjectDashboard.css";

const ProjectDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [issues, setIssues] = useState([]);
  const [issueLoading, setIssueLoading] =
    useState(false);

  const [projectImages, setProjectImages] =
  useState([]);

  const [imageLoading, setImageLoading] =
  useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedItem, setSelectedItem] =
    useState(null);

  const [activeTab, setActiveTab] =
    useState("glance");

    const [atrData, setAtrData] = useState([]);
  const [atrLoading, setAtrLoading] =
    useState(false);

  const navigate = useNavigate();

  const formatDate = (date) => {

  if (!date) return "-";

  try {

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return "-";
    }

    const day = String(
      d.getDate()
    ).padStart(2, "0");

    const month = String(
      d.getMonth() + 1
    ).padStart(2, "0");

    const year = d.getFullYear();

    return `${day}-${month}-${year}`;

  } catch (err) {

    return "-";

  }
};
  /* LOCK SCROLL */
  useEffect(() => {
    if (showModal) {
      const scrollBarWidth =
        window.innerWidth -
        document.documentElement
          .clientWidth;

      document.body.style.overflow =
        "hidden";

      document.body.style.paddingRight =
        `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow =
        "auto";

      document.body.style.paddingRight =
        "0px";
    }

    return () => {
      document.body.style.overflow =
        "auto";

      document.body.style.paddingRight =
        "0px";
    };
  }, [showModal]);

  /* FETCH DATA */
  useEffect(() => {
    axios
      .get(
        "http://localhost:5000/api/project-onboarding"
      )
      .then((res) => {
        const formattedData = (res.data || []).map((item) => ({
          ...item,

          PACKAGES:
            item.PACKAGES ||
            item.packages ||
            item.packageDetails ||
            item.PHASES ||
            [],

          FUNDING_PATTERN:
            item.FUNDING_PATTERN ||
            item.fundingPattern ||
            [],
        }));

        setData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  /* VIEW */
  const handleView = async (item) => {

  setSelectedItem(item);

  console.log("FULL ITEM =", item);
  console.log("PACKAGES =", item.PACKAGES);

  setShowModal(true);

  setActiveTab("glance");

  try {

    /* =========================
       ISSUES
    ========================= */

    setIssueLoading(true);

    const issueRes = await axios.get(
      `http://localhost:5000/api/viewissues/by-project/${item.TRN_CMWORKDATAID}`
    );

    const sortedIssues = (
      issueRes.data || []
    ).sort(
      (a, b) =>
        Number(a.PD_ISSUEHDRID || 0) -
        Number(b.PD_ISSUEHDRID || 0)
    );

    setIssues(sortedIssues);

    /* =========================
      PROJECT IMAGES
    ========================= */

    setImageLoading(true);

    const imageRes = await axios.get(
      `http://localhost:5000/api/project-image/by-project/${item.TRN_CMWORKDATAID}`
    );

    setProjectImages(
      imageRes.data || []
    );

    /* =========================
       ATR
    ========================= */

    setAtrLoading(true);

    const atrRes = await axios.get(
      `http://localhost:5000/api/project-specific-atr/by-project/${item.TRN_CMWORKDATAID}`
    );

    setAtrData(atrRes.data || []);


  } catch (error) {

    console.log(error);

    setIssues([]);

    setAtrData([]);

    setProjectImages([]);

  } finally {

    setIssueLoading(false);

    setAtrLoading(false);

    setImageLoading(false);
  }
};

  /* EDIT */
 const handleEdit = (item) => {
  navigate(
    `/project-onboarding/edit/${item.TRN_CMWORKDATAID}`,
    {
      state: {
        projectId: item.TRN_CMWORKDATAID,
        projectName: item.PRJ_NAME,
        fullData: item,
      },
    }
  );
};

  /* DELETE */
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this project?"
      )
    )
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/project-onboarding/${id}`
      );

      setData((prev) =>
        prev.filter(
          (p) =>
            p.TRN_CMWORKDATAID !== id
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  /* ADD ISSUE */
  const handleAddIssue = (item) => {
    navigate(
      "/project-onboarding/new-issue",
      {
        state: {
          projectId: String(
            item.TRN_CMWORKDATAID
          ),
          projectName: item.PRJ_NAME,
          fullData: item,
        },
      }
    );
  };

  /* EDIT ISSUE */
  const handleEditIssue = (item) => {
    navigate(
      "/project-onboarding/edit-issues",
      {
        state: {
          projectId:
            item.TRN_CMWORKDATAID,
          projectName: item.PRJ_NAME,
        },
      }
    );
  };

  /* VIEW ISSUE */
  const handleViewIssue = async (
    item
  ) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/viewissues/by-project/${item.TRN_CMWORKDATAID}`
      );

      navigate(
        "/project-onboarding/view-issue",
        {
          state: {
            projectId:
              item.TRN_CMWORKDATAID,
            projectName:
              item.PRJ_NAME,
            issues: res.data || [],
          },
        }
      );
    } catch (error) {
      console.log(error);
      alert("Failed to load issues");
    }
  };

  /* ADD IMAGE */
  const handleAddImage = (item) => {
    navigate(
      "/project-onboarding/project-images",
      {
        state: {
          projectId:
            item.TRN_CMWORKDATAID,
          projectName: item.PRJ_NAME,
          fullData: item,
        },
      }
    );
  };

  /* OVERVIEW FIELDS */
  const fieldMap = [
    {
      label: "Project Name",
      key: "PRJ_NAME",
    },
    {
      label: "Owner Department",
      key: "DEPTNAME",
    },
    {
      label: "Financial Year",
      key: "FINYR",
    },
    {
      label: "Location",
      key: "DISTRICT",
    },
    {
      label: "Project Stage",
      key: "PROJECT_STAGE",
    },
    {
      label:
        "Mode Of Implementation",
      key: "MODE_IMPL",
    },
    {
      label:
        "Implementing Department",
      key: "IMPL_DEPT",
    },
    {
      label:
        "Implementing Agency",
      key: "IMPL_AGENCY",
    },
    {
      label: "MLA Constituency",
      key: "MLA_CONST",
    },
    {
      label:
        "Parliament Constituency",
      key: "PARLIAMENT_CONST",
    },
    {
      label: "Towns Benefited",
      key: "TOWNS",
    },
    {
      label:
        "Population Benefited",
      key: "POPULATION",
    },
    {
      label: "Contractor Name",
      key: "CONTRACTOR_NAME",
    },
    {
      label: "Date Of Sanction",
      key: "DATE_SANCTION",
    },
    {
      label: "Project Start Date",
      key: "START_DATE",
    },
    {
      label:
        "Revised Start Date",
      key: "REV_START_DATE",
    },
    {
      label:
        "Project Completion Date",
      key: "END_DATE",
    },
    {
      label:
        "Revised Completion Date",
      key: "REV_END_DATE",
    },
    {
      label: "Time Overrun",
      key: "TIME_OVERRUN",
    },
    {
      label: "Project Cost",
      key: "PRJ_COST",
    },
    {
      label: "Revised Cost",
      key: "REV_COST",
    },
    {
      label: "Cost Overrun",
      key: "COST_OVERRUN",
    },
    {
      label:
        "Total Funds Released",
      key: "FUNDS_RELEASED",
    },
    {
      label:
        "Financial Progress (%)",
      key: "FIN_PROGRESS_PER",
    },
  ];

  /* FUNDING FIELDS */
  const fundingFieldMap = [
    {
      label:
        "Administrative Approval",
      key: "ADMIN_APPROVAL",
    },
    {
      label:
        "Technical Sanction",
      key: "TECH_SANCTION",
    },
    {
      label:
        "Budget Provision",
      key: "BUDGET_PROVISION",
    },
    {
      label: "Funds Released",
      key: "FUNDS_RELEASED",
    },
    {
      label: "Funds Utilized",
      key: "FUNDS_UTILIZED",
    },
    {
      label: "Central Share",
      key: "CENTRAL_SHARE",
    },
    {
      label: "State Share",
      key: "STATE_SHARE",
    },
    {
      label: "Agency Share",
      key: "AGENCY_SHARE",
    },
    {
      label:
        "Expenditure Till Date",
      key: "EXP_TILL_DATE",
    },
    {
      label:
        "Pending Liability",
      key: "PENDING_LIABILITY",
    },
    {
      label:
        "Financial Progress %",
      key: "FIN_PROGRESS_PER",
    },
    {
      label:
        "Physical Progress %",
      key: "PHYFINPROGPER",
    },
  ];

  /* PACKAGE FIELDS */
  const packageFieldMap = [
    {
      label: "Package Name",
      key: "PACKAGE_NAME",
    },
    {
      label: "Package Number",
      key: "PACKAGE_NO",
    },
    {
      label: "Package Cost",
      key: "PACKAGE_COST",
    },
    {
      label:
        "Package Start Date",
      key: "PACKAGE_START_DATE",
    },
    {
      label: "Package End Date",
      key: "PACKAGE_END_DATE",
    },
    {
      label:
        "Executing Agency",
      key: "PACKAGE_AGENCY",
    },
    {
      label: "Package Status",
      key: "PACKAGE_STATUS",
    },
    {
      label:
        "Package Progress",
      key: "PACKAGE_PROGRESS",
    },
    {
      label:
        "Work Completion %",
      key: "WORK_COMPLETION",
    },
    {
      label:
        "Package Remarks",
      key: "PACKAGE_REMARKS",
    },
  ];

  /* ATR FIELDS */
  const atrFieldMap = [
    {
      label: "ATR Status",
      key: "ATR_STATUS",
    },
    {
      label: "ATR Date",
      key: "ATR_DATE",
    },
    {
      label: "ATR Officer",
      key: "ATR_OFFICER",
    },
    {
      label: "Action Taken",
      key: "ACTION_TAKEN",
    },
    {
      label: "Current Remarks",
      key: "ATR_REMARKS",
    },
    {
      label: "Next Follow Up",
      key: "NEXT_FOLLOWUP",
    },
    {
      label:
        "Compliance Status",
      key: "COMPLIANCE_STATUS",
    },
    {
      label: "Resolution Date",
      key: "RESOLUTION_DATE",
    },
  ];

  return (
    <div className="page-container">

      {/* DASHBOARD */}

      <div className="form-card">

        <div className="form-header">
          Project Dashboard
        </div>

        <div className="form-body">

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="custom-table">

              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>District</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Cost</th>
                  <th>Progress</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {data.map((item) => (
                  <tr
                    key={
                      item.TRN_CMWORKDATAID
                    }
                  >
                    <td>
                      <div className="project-name-box">

                        <div className="project-main-name">
                          {item.PRJ_NAME}
                        </div>

                        <div className="project-links">

                          <span
                            onClick={() =>
                              handleEditIssue(
                                item
                              )
                            }
                          >
                            Edit Issue
                          </span>

                          <span
                            onClick={() =>
                              handleAddIssue(
                                item
                              )
                            }
                          >
                            Add Issue
                          </span>

                          <span
                            onClick={() =>
                              handleViewIssue(
                                item
                              )
                            }
                          >
                            View Issue
                          </span>

                          <span
                            onClick={() =>
                              handleAddImage(
                                item
                              )
                            }
                          >
                            Add Image
                          </span>

                        </div>
                      </div>
                    </td>

                    <td>
                      {item.DISTRICT}
                    </td>

                    <td>
                      {item.DEPTNAME}
                    </td>

                    <td>{item.FINYR}</td>

                    <td>
                      {item.PRJ_COST}
                    </td>

                    <td>
                      {
                        item.PHYFINPROGPER
                      }
                      %
                    </td>

                    <td className="action-icons">

                      <button
                        onClick={() =>
                          handleView(item)
                        }
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleEdit(item)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            item.TRN_CMWORKDATAID
                          )
                        }
                      >
                        <Trash2
                          size={16}
                        />
                      </button>

                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL */}

      {showModal &&
        selectedItem && (
          <div
            className="modal-overlay"
            onClick={() =>
              setShowModal(false)
            }
          >

            <div
              className="modal-box"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <h3>
                {selectedItem.PRJ_NAME}
              </h3>

              {/* TABS */}

              <div className="tabs">

                {[
                  {
                    key: "glance",
                    label: "Overview",
                  },
                  {
                    key: "funding",
                    label: "Funding",
                  },
                  {
                    key: "desc",
                    label:
                      "Brief Description",
                  },
                  {
                    key: "sanction",
                    label:
                      "Sanction Docs",
                  },
                  {
                    key: "images",
                    label: "Images",
                  },
                  {
                    key: "packages",
                    label:
                      "Packages",
                  },
                  {
                    key: "issues",
                    label: "Issues",
                  },
                  {
                    key: "atr",
                    label: "ATR",
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={
                      activeTab ===
                      tab.key
                        ? "tab active"
                        : "tab"
                    }
                    onClick={() =>
                      setActiveTab(
                        tab.key
                      )
                    }
                  >
                    {tab.label}
                  </button>
                ))}

              </div>

              {/* TAB CONTENT */}

              <div className="modal-content">

                <div className="tab-body">

                  {/* OVERVIEW */}

                  {activeTab ===
                    "glance" && (
                    <table className="modal-table">
                      <tbody>

                        {Array.from(
                          {
                            length:
                              Math.ceil(
                                fieldMap.length /
                                  2
                              ),
                          },
                          (_, i) => {
                            const left =
                              fieldMap[
                                i * 2
                              ];

                            const right =
                              fieldMap[
                                i * 2 +
                                  1
                              ];

                            return (
                              <tr
                                key={i}
                              >
                                <td className="label">
                                  {
                                    left.label
                                  }
                                </td>

                                <td>
                                  {[
                                    "DATE_SANCTION",
                                    "START_DATE",
                                    "REV_START_DATE",
                                    "END_DATE",
                                    "REV_END_DATE",
                                  ].includes(
                                    left.key
                                  )
                                    ? formatDate(
                                        selectedItem[
                                          left
                                            .key
                                        ]
                                      )
                                    : selectedItem[
                                        left
                                          .key
                                      ] ??
                                      "-"}
                                </td>

                                {right && (
                                  <>
                                    <td className="label">
                                      {
                                        right.label
                                      }
                                    </td>

                                    <td>
                                      {[
                                        "DATE_SANCTION",
                                        "START_DATE",
                                        "REV_START_DATE",
                                        "END_DATE",
                                        "REV_END_DATE",
                                      ].includes(
                                        right.key
                                      )
                                        ? formatDate(
                                            selectedItem[
                                              right
                                                .key
                                            ]
                                          )
                                        : selectedItem[
                                            right
                                              .key
                                          ] ??
                                          "-"}
                                    </td>
                                  </>
                                )}
                              </tr>
                            );
                          }
                        )}

                      </tbody>
                    </table>
                  )}

                  {/* FUNDING */}

                  {activeTab === "funding" && (
                    <div className="issues-tab-section">

                      {!selectedItem.FUNDING_PATTERN ||
                      selectedItem.FUNDING_PATTERN.length === 0 ? (

                        <div className="placeholder">
                          No Funding Data Available
                        </div>

                      ) : (

                        <table className="custom-table">

                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Project Name</th>
                              <th>Funding By</th>
                              <th>Funding %</th>
                            </tr>
                          </thead>

                          <tbody>

                            {selectedItem.FUNDING_PATTERN.map(
                              (fund, index) => (
                                <tr key={index}>

                                  <td>{index + 1}</td>

                                  <td>
                                  {fund.FP_PRJNAME || fund.PRJ_NAME || selectedItem.PRJ_NAME ||"-"}
                                  </td>

                                  <td>
                                    {fund.FUNDBY || "-"}
                                  </td>

                                  <td>
                                    {fund.FUNDBYPER || 0}%
                                  </td>

                                </tr>
                              )
                            )}

                          </tbody>

                        </table>

                      )}

                    </div>
                  )}

                  {/* DESCRIPTION */}

                  {activeTab ===
                    "desc" && (
                    <div className="description-box">
                      {selectedItem.DESCRIPTION ||
                        selectedItem.BRFPRJ ||
                        "No description available"}
                    </div>
                  )}

                  {/* SANCTION DOCS */}

                  {activeTab ===
                    "sanction" && (
                    <div className="docs-section">

                      {selectedItem.WORKORDER_URL && (
                        <div className="doc-item">

                          <span>
                            Work Order
                          </span>

                          <a
                            href={
                              selectedItem.WORKORDER_URL
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            View
                          </a>

                        </div>
                      )}

                      {selectedItem.FS_URL && (
                        <div className="doc-item">

                          <span>
                            FS Document
                          </span>

                          <a
                            href={
                              selectedItem.FS_URL
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            View
                          </a>

                        </div>
                      )}

                    </div>
                  )}

                  {/* IMAGES */}

                  {activeTab === "images" && (

                    <div className="issues-tab-section">

                      {imageLoading ? (

                        <p>Loading...</p>

                      ) : projectImages.length === 0 ? (

                        <p>No Images Found</p>

                      ) : (

                        <div className="project-images-grid">

                          {projectImages.map(
                            (img, index) => (

                              <div
                                className="project-image-card"
                                key={index}
                              >

                                <a
                                href={`http://localhost:5000/uploads/images/${img.AXP_GRIDATTACH_2}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={`http://localhost:5000/uploads/images/${img.AXP_GRIDATTACH_2}`}
                                  alt=""
                                  className="project-preview-image"
                                />

                              </a>

                              <div className="project-image-title">
                                {img.IMGTITLE}
                              </div>

                              <div className="project-image-actions">

                                <a
                                  href={`http://localhost:5000/uploads/images/${img.AXP_GRIDATTACH_2}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="view-image-btn"
                                >
                                  View Image
                                </a>

                                {img.AXPFILE_MYDOCS && (

                                  <a
                                    href={`http://localhost:5000/uploads/docs/${img.AXPFILE_MYDOCS}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="view-doc-btn"
                                  >
                                    View Document
                                  </a>

                                )}

</div>
                              </div>

                            )
                          )}

                        </div>

                      )}

                    </div>
                  )}
                  {/* PACKAGES */}

{activeTab === "packages" && (

  <div className="issues-tab-section">

    {!selectedItem.PACKAGES ||
    selectedItem.PACKAGES.length === 0 ? (

      <div className="placeholder">
        No Package Data Available
      </div>

    ) : (

      <table className="custom-table">

        <thead>

          <tr>

            <th>#</th>
            <th>Package</th>
            <th>Contractor</th>
            <th>Sanction Date</th>
            <th>Start Date</th>
            <th>Completion</th>
            <th>Revised Completion</th>
            <th>Cost</th>
            <th>Revised Cost</th>
            <th>Cost Overrun</th>
            <th>Funds</th>
            <th>Financial Progress</th>
            <th>Financial %</th>
            <th>Physical Progress</th>
            <th>Physical %</th>

          </tr>

        </thead>

        <tbody>

    {Array.isArray(selectedItem.PACKAGES) &&
  selectedItem.PACKAGES.map(
      (pkg, index) => {

        if (!pkg || typeof pkg !== "object") {
          return null;
        }

        return (

          <tr key={index}>

            <td>{index + 1}</td>

            <td>
              {pkg.PACKAGEPHASE || "-"}
            </td>

            <td>
              {pkg.PH_CONTRACTNAME || "-"}
            </td>

            <td>
              {pkg.PH_DTSANPRJ
                ? formatDate(pkg.PH_DTSANPRJ)
                : "-"}
            </td>

            <td>
              {pkg.PH_PRJSTARTDT
                ? formatDate(pkg.PH_PRJSTARTDT)
                : "-"}
            </td>

            <td>
              {pkg.PH_COMPLEDT
                ? formatDate(pkg.PH_COMPLEDT)
                : "-"}
            </td>

            <td>
              {pkg.PH_REVCOMPLEDT
                ? formatDate(pkg.PH_REVCOMPLEDT)
                : "-"}
            </td>

            <td>
              {pkg.PH_WORKCOST || "-"}
            </td>

            <td>
              {pkg.PH_REVCOST || "-"}
            </td>

            <td>
              {pkg.PH_COSTOVERRUN ?? 0}
            </td>

            <td>
              {pkg.PH_TOTFUN || "-"}
            </td>

            <td>
              {pkg.PH_FINPRG || "-"}
            </td>

            <td>
              {pkg.PH_FINPRGPER ?? 0}%
            </td>

            <td>
              {pkg.PH_PHYSPRG || "-"}
            </td>

            <td>
              {pkg.PH_PHYSPRGPER ?? 0}%
            </td>

          </tr>

        );
      }
    )}

</tbody>
      </table>

    )}

  </div>

)}
                  {/* ATR */}

                  {activeTab === "atr" && (

                  <div className="issues-tab-section">

                    {atrLoading ? (

                      <p>Loading...</p>

                    ) : atrData.length === 0 ? (

                      <p>No ATR Found</p>

                    ) : (

                      <table className="custom-table">

                        <thead>

                          <tr>

                            <th>#</th>

                            <th>Meeting</th>

                            <th>Meeting Date</th>

                            <th>Direction Given</th>

                            <th>Admin Response</th>

                            <th>Status</th>

                            <th>Concern Department</th>

                            <th>Created On</th>

                          </tr>

                        </thead>

                        <tbody>

                          {atrData.map((atr, index) => (

                            <tr key={atr.TRN_ATRDTLID}>

                              <td>{index + 1}</td>

                              <td>
                                {atr.MEETINGTITLE || "-"}
                              </td>

                              <td>
                                {formatDate(atr.MEET_DT)}
                              </td>

                              <td>
                                {atr.DIRDESC || "-"}
                              </td>

                              <td>
                                {atr.ADRESDESC || "-"}
                              </td>

                              <td>
                                {atr.ISSUE_STAT || "-"}
                              </td>

                              <td>
                                {atr.CONCENDEPT || "-"}
                              </td>

                              <td>
                                {formatDate(atr.CREATEDON)}
                              </td>

                            </tr>
                          ))}

                        </tbody>

                      </table>

                    )}

                  </div>
                )}
                         

                  {/* ISSUES */}

                  {activeTab ===
                    "issues" && (
                    <div className="issues-tab-section">

                      {issueLoading ? (
                        <p>Loading...</p>
                      ) : issues.length ===
                        0 ? (
                        <p>
                          No Issues Found
                        </p>
                      ) : (
                        <table className="custom-table">

                          <thead>
                            <tr>
                              <th>
                                Issue No
                              </th>

                              <th>
                                Issue Date
                              </th>

                              <th>
                                Category
                              </th>

                              <th>Type</th>

                              <th>
                                Status
                              </th>

                              <th>
                                Description
                              </th>
                            </tr>
                          </thead>

                          <tbody>

                            {issues.map(
                              (
                                issue,
                                index
                              ) => (
                                <tr
                                  key={
                                    issue.PD_ISSUEHDRID
                                  }
                                >

                                  <td>
                                    {index +
                                      1}
                                  </td>

                                  <td>
                                    {formatDate(
                                      issue.ISSUEDT
                                    )}
                                  </td>

                                  <td>
                                    {issue.ISSUECAT ||
                                      "-"}
                                  </td>

                                  <td>
                                    {issue.ISSUETYP ||
                                      "-"}
                                  </td>

                                  <td>
                                    {issue.ISS_STATUS ||
                                      "-"}
                                  </td>

                                  <td>
                                    {issue.ISSUEDESC ||
                                      "-"}
                                  </td>

                                </tr>
                              )
                            )}

                          </tbody>

                        </table>
                      )}

                    </div>
                  )}

                </div>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Close
              </button>

            </div>
          </div>
        )}
    </div>
  );
};

export default ProjectDashboard;