const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// Routes
const financialYearRoutes = require("./routes/master/financialYear.routes");
const stateRoutes = require("./routes/master/state.routes");
const divisionRoutes = require("./routes/master/division.routes");
const districtRoutes = require("./routes/master/district.routes");
const projectDepartmentRoutes = require("./routes/master/projectDepartment.routes");
const lovRoutes = require("./routes/master/lov.routes");
const projectStageRoutes = require("./routes/master/projectStage.routes");
const assemblyRoutes = require("./routes/master/assembly.routes");
const issueCategoryRoutes = require("./routes/master/issueCategory.routes");
const pcMasterRoutes = require("./routes/master/pcmaster.routes");

const projectOnboardingRoutes = require("./routes/projectOnboarding/projectOnboarding.routes");
const editProjectOnboardingRoutes = require("./routes/projectOnboarding/editProjectOnboarding.routes");
const projectDashboardRoutes = require("./routes/projectOnboarding/projectDashboard.routes");
const getProjectByNameRoutes = require("./routes/projectOnboarding/getProjectByName");
const getProjectsRoutes = require("./routes/projectOnboarding/getProjects");
const meetingRoutes = require("./routes/projectOnboarding/meeting.routes");
const issueRoutes = require("./routes/projectOnboarding/newissue.routes");
const projectImageRoutes = require("./routes/projectOnboarding/projectimage.routes");
const newIssueRoutes = require("./routes/projectOnboarding/newissue.routes");
const updateIssueRoute = require("./routes/projectOnboarding/updateissue.routes");
const viewIssueRoutes = require("./routes/projectOnboarding/viewIssue.routes");

const projectSpecificATRRoutes = require("./routes/ATR/projectSpecificATR.routes");
const generalATRRoutes = require("./routes/ATR/generalATR.routes");

const technicalIssueRoutes = require("./routes/technicalIssues.routes");

const megaDashboardRoutes = require("./routes/dashboard/megaDashboard.routes");



console.log("Financial Route:", financialYearRoutes);
console.log("State Route:", stateRoutes);
console.log("Division Route:", divisionRoutes);
console.log("District Route:", districtRoutes);
console.log("Project Department Route:", projectDepartmentRoutes);
console.log("LOV Route:", lovRoutes);
console.log("Project Stage Route:", projectStageRoutes);
console.log("Assembly Route:", assemblyRoutes);
console.log("Issue Category Route:", issueCategoryRoutes);
console.log("PC Master Route:", pcMasterRoutes);


console.log("Project Onboarding Route:", projectOnboardingRoutes);
console.log("Project Dashboard Route:", projectDashboardRoutes);
console.log("Edit Project Route:", editProjectOnboardingRoutes);
console.log("Get Projects Route:", getProjectsRoutes);


app.use("/api/financial-year", financialYearRoutes);
app.use("/api/state", stateRoutes);
app.use("/api/division", divisionRoutes);
app.use("/api/district", districtRoutes);
app.use("/api/project-department", projectDepartmentRoutes);
app.use("/api/lov", lovRoutes);
app.use("/api/project-stage", projectStageRoutes);
app.use("/api/assembly", assemblyRoutes);
app.use("/api/issue-category", issueCategoryRoutes);
app.use("/api/pcmaster", pcMasterRoutes);
//  STATIC FILE SERVE (VERY IMPORTANT)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/projectOnboarding", projectOnboardingRoutes);
app.use("/api/project/editproject-onboarding", editProjectOnboardingRoutes);
app.use("/api/project-onboarding", projectDashboardRoutes);
app.use("/api/project/list", getProjectsRoutes);
app.use("/api/project/get", getProjectByNameRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/project-image", projectImageRoutes);
app.use("/api/newissue", newIssueRoutes);
app.use("/api/viewissues", viewIssueRoutes);
app.use("/api/project-onboarding/updateissue", updateIssueRoute);
app.use("/api/issue", issueRoutes);

app.use("/api/technical-issue", technicalIssueRoutes);

app.use("/api/project-specific-atr", projectSpecificATRRoutes);
app.use("/api/general-atr", generalATRRoutes);

app.use( "/api/mega-dashboard", megaDashboardRoutes);


// Connect DB first and then start server
(async () => {
  await connectDB();
  
  app.listen(5000, () => {
    console.log("🚀 Server running at http://localhost:5000");
  });
})();
