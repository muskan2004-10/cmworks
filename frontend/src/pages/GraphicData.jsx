import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./pages.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const GraphicData = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);

  /* ======================================================
      FETCH DATA
  ====================================================== */

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/project-onboarding")
      .then((res) => {
        console.log("Dashboard API:", res.data);

        setData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Dashboard Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* ======================================================
      UNIQUE YEARS
  ====================================================== */

  const years = useMemo(() => {
    const yrs = data
      .map((item) => item.FINYR)
      .filter((x) => x);

    return [...new Set(yrs)];
  }, [data]);

  /* ======================================================
      FILTER DATA
  ====================================================== */

  const filteredData = useMemo(() => {
    if (!selectedYear) return data;

    return data.filter(
      (item) => String(item.FINYR) === String(selectedYear)
    );
  }, [data, selectedYear]);

  /* ======================================================
      KPI CALCULATIONS
  ====================================================== */

  const totalProjects = filteredData.length;

  const totalCost = filteredData.reduce((sum, item) => {
    return sum + (parseFloat(item.PRJ_COST) || 0);
  }, 0);

  const avgCost =
    totalProjects > 0
      ? (totalCost / totalProjects).toFixed(2)
      : 0;

  const completedProjects = filteredData.filter(
    (item) =>
      item.PRJ_STAGE &&
      item.PRJ_STAGE.toString().toLowerCase().includes("complete")
  ).length;

  /* ======================================================
      DYNAMIC COLORS
  ====================================================== */

  const generateColors = (count) => {
    const colors = [];

    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count;

      colors.push(`hsl(${hue}, 70%, 55%)`);
    }

    return colors;
  };

  /* ======================================================
      PIE CHART BUILDER
  ====================================================== */

  const buildPieData = (keyName) => {
    const map = {};

    filteredData.forEach((item) => {
      let key = item[keyName];

      if (!key) key = "Unknown";

      key = key.toString().trim();

      const cost = parseFloat(item.PRJ_COST) || 0;

      map[key] = (map[key] || 0) + cost;
    });

    const labels = Object.keys(map);
    const values = Object.values(map);

    if (labels.length === 0) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#d3d3d3"],
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: generateColors(labels.length),
          borderWidth: 1,
        },
      ],
    };
  };

  /* ======================================================
      CHART DATA
  ====================================================== */

  const deptChartData = useMemo(() => {
    return buildPieData("DEPTNAME");
  }, [filteredData]);

  const districtChartData = useMemo(() => {
    return buildPieData("DISTRICT");
  }, [filteredData]);

  /* ======================================================
      TOP PROJECTS BAR
  ====================================================== */

  const topProjectsData = useMemo(() => {
    const sorted = [...filteredData]
      .sort(
        (a, b) =>
          (parseFloat(b.PRJ_COST) || 0) -
          (parseFloat(a.PRJ_COST) || 0)
      )
      .slice(0, 5);

    return {
      labels: sorted.map((item) => item.PRJ_NAME),
      datasets: [
        {
          label: "Project Cost (Cr)",
          data: sorted.map(
            (item) => parseFloat(item.PRJ_COST) || 0
          ),
          backgroundColor: generateColors(sorted.length),
        },
      ],
    };
  }, [filteredData]);

  /* ======================================================
      CHART OPTIONS
  ====================================================== */

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  /* ======================================================
      UI
  ====================================================== */

  return (
    <div className="page-container">

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 className="page-header">
          📊 Project Analytics Dashboard
        </h2>

        <button
          className="btn submit"
          onClick={() => navigate("/")}
        >
          ⬅ Back
        </button>
      </div>

      {/* FILTER */}

      <div
        className="card"
        style={{
          marginBottom: "25px",
          padding: "15px",
        }}
      >
        <label
          style={{
            fontWeight: "600",
            marginRight: "10px",
          }}
        >
          Filter By Financial Year:
        </label>

        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(e.target.value)
          }
          style={{
            width: "250px",
            padding: "8px",
          }}
        >
          <option value="">All Years</option>

          {years.map((yr, index) => (
            <option key={index} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {/* KPI CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="card"
        >
          <h3>Total Projects</h3>

          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {totalProjects}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="card"
        >
          <h3>Total Cost</h3>

          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            ₹ {totalCost.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="card"
        >
          <h3>Average Cost</h3>

          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            ₹ {avgCost}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="card"
        >
          <h3>Completed Projects</h3>

          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {completedProjects}
          </p>
        </motion.div>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="card">
          <h3>Loading dashboard...</h3>
        </div>
      ) : (
        <>

          {/* CHARTS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(400px,1fr))",
              gap: "25px",
            }}
          >

            {/* DEPARTMENT PIE */}

            <motion.div
              className="card"
              whileHover={{ scale: 1.01 }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                }}
              >
                Department-wise Project Cost
              </h3>

              <div
                style={{
                  height: "400px",
                }}
              >
                <Pie
                  data={deptChartData}
                  options={pieOptions}
                />
              </div>
            </motion.div>

            {/* DISTRICT PIE */}

            <motion.div
              className="card"
              whileHover={{ scale: 1.01 }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                }}
              >
                District-wise Project Cost
              </h3>

              <div
                style={{
                  height: "400px",
                }}
              >
                <Pie
                  data={districtChartData}
                  options={pieOptions}
                />
              </div>
            </motion.div>

          </div>

          {/* BAR GRAPH */}

          <motion.div
            className="card"
            whileHover={{ scale: 1.01 }}
            style={{
              marginTop: "30px",
            }}
          >
            <h3
              style={{
                marginBottom: "15px",
              }}
            >
              Top 5 Costliest Projects
            </h3>

            <div
              style={{
                height: "450px",
              }}
            >
              <Bar
                data={topProjectsData}
                options={barOptions}
              />
            </div>
          </motion.div>

        </>
      )}
    </div>
  );
};

export default GraphicData;