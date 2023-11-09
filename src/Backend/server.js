const exp = require("express");
const connectDB = require("./database");
const cors = require("cors");
const app = exp();

app.use(cors({
  origin : "*"
}))
app.use(exp.json());

//db connection
connectDB();

//import API's
const communityAPI = require("./APIs/Communitydata");
const ownerAPI = require("./APIs/ownersData");
const userAPI = require("./APIs/usersData");
const maintenanceAPI = require("./APIs/maintenanceData");

//execute specific middleware based on path

// app.use("/communitydata", communityAPI);

app.use("/communitydata", (req, res, next) => {
  communityAPI(req, res, next);
});

// app.use("/ownerData", ownerAPI);

app.use("/ownerData", (req, res, next) => {
  ownerAPI(req, res, next);
});

// app.use("/userData", ownerAPI);

app.use("/userData", (req, res, next) => {
  userAPI(req, res, next);
});

// app.use("/maintenanceData", maintenanceAPI);

app.use("/maintenanceData", (req, res, next) => {
  maintenanceAPI(req, res, next);
});

//handle invalid paths
app.use((err, req, res, next) => {
  res.send({ message: req.url + " is invalid path" });
});

//error handling
app.use((err, req, res, next) => {
  res.send({ message: "Error occured", reason: err.message });
});

app.listen(5000, () => console.log("server is on port 5000"));
