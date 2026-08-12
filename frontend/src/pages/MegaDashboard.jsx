import { useEffect, useState } from "react";
import axios from "axios";
import "./MegaDashboard.css";

const MegaDashboard = () => {

  const [loading, setLoading] =
    useState(true);

  const [dashboardData, setDashboardData] =
    useState({});

  const [filters, setFilters] =
    useState({
      financialYear: "",
      district: "",
      executingDept: "",
      identifiedProject: "",
      meetingStatus: "",
    });

  const [dropdowns, setDropdowns] =
    useState({
      financialYears: [],
      districts: [],
      executingDepartments: [],
      identifiedProjects: [],
      meetingStatuses: [],
    });

  /* =========================================
     FETCH DROPDOWNS
  ========================================= */

  useEffect(() => {

    fetchDropdowns();

  }, []);

  const fetchDropdowns = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/mega-dashboard/dropdowns"
      );

      setDropdowns({
        financialYears:
          res.data.financialYears || [],
        districts:
          res.data.districts || [],
        executingDepartments:
          res.data.executingDepartments || [],
        identifiedProjects:
          res.data.identifiedProjects || [],
        meetingStatuses:
          res.data.meetingStatuses || [],
      });

    } catch (error) {

      console.log(error);

    }
  };

  /* =========================================
     FETCH DASHBOARD DATA
  ========================================= */

  useEffect(() => {

    fetchDashboardData();

  }, [filters]);

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/mega-dashboard",
        {
          params: filters,
        }
      );

      setDashboardData(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  /* =========================================
     HANDLE FILTER CHANGE
  ========================================= */

  const handleChange = (e) => {

    setFilters({
      ...filters,
      [e.target.name]:
        e.target.value,
    });
  };

  /* =========================================
     VIEW MORE
  ========================================= */

  const handleViewMore = (type) => {

    alert(`View More: ${type}`);

    // later:
    // navigate("/some-page")
  };

  return (

    <div className="mega-dashboard-wrapper">

      <div className="mega-dashboard-card">

        {/* HEADER */}

        <div className="mega-dashboard-header">

          MEGA DASHBOARD

        </div>

        {/* FILTERS */}

        <div className="dashboard-filter-section">

          <div className="dashboard-filter-grid">

            {/* FINANCIAL YEAR */}

            <div className="dashboard-filter-group">

              <label>
                Financial Year
              </label>

              <select
                name="financialYear"
                value={filters.financialYear}
                onChange={handleChange}
              >

                <option value="">
                  ALL
                </option>

                {dropdowns.financialYears.map(
                  (item, index) => (

                    <option
                      key={index}
                      value={item.FINYR}
                    >
                      {item.FINYR}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* DISTRICT */}

            <div className="dashboard-filter-group">

              <label>
                District
              </label>

              <select
                name="district"
                value={filters.district}
                onChange={handleChange}
              >

                <option value="">
                  ALL
                </option>

                {dropdowns.districts.map(
                  (item, index) => (

                    <option
                      key={index}
                      value={item.DISTRICT}
                    >
                      {item.DISTRICT}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* EXECUTING DEPARTMENT */}

            <div className="dashboard-filter-group">

              <label>
                Executing Department Name
              </label>

              <select
                name="executingDept"
                value={filters.executingDept}
                onChange={handleChange}
              >

                <option value="">
                  ALL
                </option>

                {dropdowns.executingDepartments.map(
                  (item, index) => (

                    <option
                      key={index}
                      value={item.EXCUTINGDEPT}
                    >
                      {item.EXCUTINGDEPT}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* IDENTIFIED PROJECTS */}

            <div className="dashboard-filter-group">

              <label>
                Identified Projects
              </label>

              <select
                name="identifiedProject"
                value={filters.identifiedProject}
                onChange={handleChange}
              >

                <option value="">
                  ALL
                </option>

                {dropdowns.identifiedProjects.map(
                  (item, index) => (

                    <option
                      key={index}
                      value={item.PRJ_STAGE}
                    >
                      {item.PRJ_STAGE}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* MEETING STATUS */}

            <div className="dashboard-filter-group">

              <label>
                Meeting Wise Status
              </label>

              <select
                name="meetingStatus"
                value={filters.meetingStatus}
                onChange={handleChange}
              >

                <option value="">
                  ALL
                </option>

                {dropdowns.meetingStatuses.map(
                  (item, index) => (

                    <option
                      key={index}
                      value={item.STATUS}
                    >
                      {item.STATUS}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>

        </div>

        {/* BODY */}

        <div className="dashboard-body">

          {loading ? (

            <div className="dashboard-loader">
              Loading Dashboard...
            </div>

          ) : (

            <>
              {/* TOP SECTION */}

              <div className="dashboard-card-grid">

                {/* TOTAL */}

                <div className="dashboard-stat-card card-total">

                  <div className="dashboard-card-title">
                    Total Projects
                  </div>

                  <div className="dashboard-card-count">
                    {dashboardData.totalProjects || 0}
                  </div>

                  <button
                    className="dashboard-view-btn"
                    onClick={() =>
                      handleViewMore(
                        "Total Projects"
                      )
                    }
                  >
                    View More
                  </button>

                </div>

                {/* UNDER CONCEPT */}

                <div className="dashboard-stat-card card-concept">

                  <div className="dashboard-card-title">
                    Under Conceptualization
                  </div>

                  <div className="dashboard-card-count">
                    {dashboardData.underConcept || 0}
                  </div>

                  <button
                    className="dashboard-view-btn"
                    onClick={() =>
                      handleViewMore(
                        "Under Conceptualization"
                      )
                    }
                  >
                    View More
                  </button>

                </div>

                {/* UNDER DEVELOPMENT */}

                <div className="dashboard-stat-card card-development">

                  <div className="dashboard-card-title">
                    Under Development
                  </div>

                  <div className="dashboard-card-count">
                    {dashboardData.underDevelopment || 0}
                  </div>

                  <button
                    className="dashboard-view-btn"
                    onClick={() =>
                      handleViewMore(
                        "Under Development"
                      )
                    }
                  >
                    View More
                  </button>

                </div>

                {/* IMPLEMENTATION */}

                <div className="dashboard-stat-card card-implementation">

                  <div className="dashboard-card-title">
                    Under Implementation
                  </div>

                  <div className="dashboard-card-count">
                    {dashboardData.underImplementation || 0}
                  </div>

                  <button
                    className="dashboard-view-btn"
                    onClick={() =>
                      handleViewMore(
                        "Under Implementation"
                      )
                    }
                  >
                    View More
                  </button>

                </div>

                {/* COMPLETED */}

                <div className="dashboard-stat-card card-completed">

                  <div className="dashboard-card-title">
                    Completed Projects
                  </div>

                  <div className="dashboard-card-count">
                    {dashboardData.completedProjects || 0}
                  </div>

                  <button
                    className="dashboard-view-btn"
                    onClick={() =>
                      handleViewMore(
                        "Completed Projects"
                      )
                    }
                  >
                    View More
                  </button>

                </div>

              </div>

              {/* SECOND SECTION */}

              <div className="dashboard-section-title">

                Over Runs

              </div>

              <div className="dashboard-small-grid">

                {/* COST */}

                <div className="dashboard-stat-card card-cost">

                  <div className="dashboard-card-title">
                    Cost Over Run
                  </div>

                  <div className="dashboard-card-count">
                    {dashboardData.costOverRun || 0}
                  </div>

                  <button
                    className="dashboard-view-btn"
                    onClick={() =>
                      handleViewMore(
                        "Cost Over Run"
                      )
                    }
                  >
                    View More
                  </button>

                </div>

                {/* TIME */}

                <div className="dashboard-stat-card card-time">

                  <div className="dashboard-card-title">
                    Time Over Runs
                  </div>

                  <div className="dashboard-card-count">
                    {dashboardData.timeOverRun || 0}
                  </div>

                  <button
                    className="dashboard-view-btn"
                    onClick={() =>
                      handleViewMore(
                        "Time Over Runs"
                      )
                    }
                  >
                    View More
                  </button>

                </div>

                {/* USERS */}

                <div className="dashboard-stat-card card-users">

                  <div className="dashboard-card-title">
                    Officers SSO ID Mapped
                  </div>

                  <div className="dashboard-card-count">
                    {dashboardData.officersMapped || 0}
                  </div>

                  <button
                    className="dashboard-view-btn"
                    onClick={() =>
                      handleViewMore(
                        "Officers"
                      )
                    }
                  >
                    View More
                  </button>

                </div>

              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default MegaDashboard;