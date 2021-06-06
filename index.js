/*env file dependencies*/
require("dotenv").config();

const express = require("express");
/*cors dependencies for api*/
const cors = require("cors");
const app = express();
/*show logs in console*/
const logger = require("morgan");
/*catching errors*/
const errorHandler = require("./error");
/*routes /events /activities /beachtemp */
const indexRoutes = require("./routes");
/*route /weather*/
const weatherRoutes = require("./routes/weather");
/*route /lost*/
const lostRoutes = require("./routes/lost");
/*route /newevent*/
const eventRoutes = require("./routes/events");
/*query function to postgressql*/
const { dbQuery } = require("./dbConnection");
dbQuery();
app.use(cors());
app.set("port", process.env.PORT);
app.set("ip", process.env.IP);
app.use(logger("dev"));
app.use(express.json());
app.use(express.static('public'))

app.use("/", indexRoutes);
app.use("/weather", weatherRoutes);
app.use("/lost", lostRoutes);
app.use("/newevent", eventRoutes);

app.get("*", (req, res) => {
  return res.send("error 404, page not found");
});

app.use(errorHandler);

app.listen(process.env.PORT || app.get("port"), app.get("ip"), (err) => {
  if (err) {
    throw Error;
  } else {
    console.log("hello world server is running on port 8080");
  }
});
