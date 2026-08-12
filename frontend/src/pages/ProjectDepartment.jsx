import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ProjectDashboard.css";

const ProjectDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("glance");

  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);
    if (isNaN(d)) return "-";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  /* LOCK BACKGROUND SCROLL */
  useEffect(() => {
    if (showModal) {
      const scrollBarWidth =
        window.innerWidth -
        document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight =
        `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [showModal]);

  /* FETCH DATA */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/project-onboarding")
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
    setActiveTab("glance");
  };

  const handleEdit = (item) => {
    navigate(
      `/edit-project/${item.TRN_CMWORKDATAID}`
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?"))
      return;

    await axios.delete(
      `http://localhost:5000/api/project-onboarding/${id}`
    );

    setData((prev) =>
      prev.filter(
        (p) => p.TRN_CMWORKDATAID !== id
      )
    );
  };

  const handleAddIssue = (item) => {
    navigate(
      "/project-onboarding/new-issue",
      {
        state: {
          projectId: String(item.TRN_CMWORKDATAID),
          projectName: item.PRJ_NAME,
          fullData: item,
        },
      }
    );
  };

  const handleEditIssue = async (item) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/newissue/by-project/${item.TRN_CMWORKDATAID}`
    );

    const issueData = res.data;

    console.log("FETCHED ISSUE:", issueData);

    if (!issueData || !issueData.PD_ISSUEHDRID) {
      alert("No issue found for this project");
      return;
    }

    navigate("/project-onboarding/edit-issue", {
    state: {
      issueId: issueData.PD_ISSUEHDRID,
      projectId: String(issueData.PROJECTID),
      issueDate: issueData.ISSUEDT,
      description: issueData.ISSDESC,
    },
  });
  } catch (err) {
    console.error(err);
    alert("Error fetching issue");
  }
};

const handleViewIssue = async (item) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/viewissues/by-project/${item.TRN_CMWORKDATAID}`
    );

    navigate("/project-onboarding/view-issue", {
      state: {
        projectId: item.TRN_CMWORKDATAID,
        projectName: item.PRJ_NAME,
        issues: res.data || [],
      },
    });
  } catch (error) {
    console.log(error);
    alert("Failed to load issues");
  }
};

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

  const fieldMap = [
    { label: "Project Name", key: "PRJ_NAME" },
    { label: "Owner Department", key: "DEPTNAME" },
    { label: "Financial Year", key: "FINYR" },
    { label: "Location", key: "DISTRICT" },
    { label: "Project Stage", key: "PROJECT_STAGE" },
    { label: "Mode Of Implementation", key: "MODE_IMPL" },
    { label: "Implementing Department", key: "IMPL_DEPT" },
    { label: "Implementing Agency", key: "IMPL_AGENCY" },
    { label: "MLA Constituency", key: "MLA_CONST" },
    { label: "Parliament Constituency", key: "PARLIAMENT_CONST" },
    { label: "Towns Benefited", key: "TOWNS" },
    { label: "Population Benefited", key: "POPULATION" },
    { label: "Contractor Name", key: "CONTRACTOR_NAME" },
    { label: "Date Of Sanction", key: "DATE_SANCTION" },
    { label: "Project Start Date", key: "START_DATE" },
    { label: "Revised Start Date", key: "REV_START_DATE" },
    { label: "Project Completion Date", key: "END_DATE" },
    { label: "Revised Completion Date", key: "REV_END_DATE" },
    { label: "Time Overrun", key: "TIME_OVERRUN" },
    { label: "Project Cost", key: "PRJ_COST" },
    { label: "Revised Cost", key: "REV_COST" },
    { label: "Cost Overrun", key: "COST_OVERRUN" },
    { label: "Total Funds Released", key: "FUNDS_RELEASED" },
    { label: "Financial Progress (%)", key: "FIN_PROGRESS_PER" },
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

                    <td>{item.DISTRICT}</td>
                    <td>{item.DEPTNAME}</td>
                    <td>{item.FINYR}</td>
                    <td>{item.PRJ_COST}</td>
                    <td>
                      {item.PHYFINPROGPER}%
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
                        <Trash2 size={16} />
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

                      {!selectedItem.WORKORDER_URL &&
                        !selectedItem.FS_URL && (
                          <div className="placeholder">
                            No documents available
                          </div>
                        )}
                    </div>
                  )}

                  {/* IMAGES */}
                  {activeTab ===
                    "images" && (
                    <div className="docs-section">

                      {selectedItem.IMAGE_URL && (
                        <div className="doc-item">
                          <span>
                            Project Image
                          </span>

                          <a
                            href={
                              selectedItem.IMAGE_URL
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            View
                          </a>
                        </div>
                      )}

                      {selectedItem.IMAGE_DOC_URL && (
                        <div className="doc-item">
                          <span>
                            Project Document
                          </span>

                          <a
                            href={
                              selectedItem.IMAGE_DOC_URL
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            View
                          </a>
                        </div>
                      )}

                      {!selectedItem.IMAGE_URL &&
                        !selectedItem.IMAGE_DOC_URL && (
                          <div className="placeholder">
                            No images available
                          </div>
                        )}
                    </div>
                  )}

                  {/* OTHER TABS */}
                  {[
                    "funding",
                    "packages",
                    "issues",
                    "atr",
                  ].includes(
                    activeTab
                  ) && (
                    <div className="placeholder">
                      No data available
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