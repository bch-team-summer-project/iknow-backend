/* var cors = require("cors"); */
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const BASE_URL = "https://iknow-backend.herokuapp.com/";
// const BASE_URL= "http://localhost:8080/";

/* GET Events page. */
router.get("/events", async function (req, res, next) {
  let category = req.query.category ? req.query.category : "";
  let jsonResponse = await getDataFromOpenAPI("events", category);
  res.json(jsonResponse);
});

/* GET Activities page. */
router.get("/activities", async function (req, res, next) {
  let jsonResponse = await getDataFromOpenAPI("activities", "");
  res.json(jsonResponse);
});

/* GET water temprature page. */
router.get("/beachTemp", async function (req, res, next) {
  let jsonResponse = await getBeachTemp();
  res.json(jsonResponse);
});

const getBeachTemp = () => {
  let URL = "https://iot.fvh.fi/opendata/uiras/uiras2_v1.json";
  return fetch(URL)
    .then((response) => response.json())
    .then((waterTempDataJson) => {
      let responseJson = [];
      for (const key in waterTempDataJson.sensors) {
        const element = waterTempDataJson.sensors[key];
        let beachTemp = {};
        beachTemp.id = key;
        beachTemp.beachName = element.meta.name;
        beachTemp.image =
          BASE_URL + "/images/" + element.meta.name.replace(/\s/g, "") + ".jpg";
        beachTemp.waterTemp = element.data[element.data.length - 1].temp_water;
        beachTemp.airTemp = element.data[element.data.length - 1].temp_air;
        beachTemp.time = element.data[element.data.length - 1].time;
        responseJson.push(beachTemp);
      }
      return responseJson;
    });
};
const getDataFromOpenAPI = (apiType, category) => {
  let URL = "";
  switch (apiType) {
    case "events":
      URL =
        "http://open-api.myhelsinki.fi/v1/events/?language_filter=en&limit=20";
      break;
    case "activities":
      URL =
        "http://open-api.myhelsinki.fi/v1/activities/?language_filter=en&limit=20";
      break;

    default:
      break;
  }
  if (category != "") {
    URL = URL + "&tags_filter=" + category;
  }
  return fetch(URL)
    .then((response) => response.json())
    .then((eventListJson) => {
      return eventListJson.data;
    });
};

module.exports = router;
