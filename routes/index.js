/* var cors = require("cors"); */
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const BASE_URL = "https://iknow-backend.herokuapp.com";
// const BASE_URL= "http://localhost:8080";
const beachLocation = {
  "Munkkiniemi": "https://goo.gl/maps/1aBdj6qMPmbnkk3W8",
  "Uunisaari": "https://goo.gl/maps/VttguMrrLvMmBMhk9",
  "Pikkukosken uimaranta": "https://goo.gl/maps/z4zTAnHpLUrQta5Z8",
  "Kuusijärvi (Vantaa)": "https://goo.gl/maps/JaMXdVcA3Ko6MrBY9",
  "Vetokannas (Vantaa)": "https://goo.gl/maps/Zv21nYtKpxmQpKL27",
  "Rastilan uimaranta": "https://goo.gl/maps/vqe3gU7u6UqNjDdX8",
  "Pihlajasaari": "https://goo.gl/maps/vqe3gU7u6UqNjDdX8",
  "Vasikkasaari": "https://goo.gl/maps/t3YEMuWgjWu9hbNY6",
  "Marjaniemen uimaranta": "https://goo.gl/maps/xBx5ZPPbvJXqz4gF7",
  "Hietaniemi (Ourit)": "https://goo.gl/maps/u58NLYwKT4LVx9WBA",
  "Lauttasaari (Ryssänkärki)": "https://goo.gl/maps/9FntX2B5b4fyW3e36",
  "Herttoniemi (Tuorinniemen uimalaituri)": "https://goo.gl/maps/ooCZCxjCrRU7qcmu7",
  "Vartiosaari (Reposalmen laituri)": "https://goo.gl/maps/7uynUahSBHdXy1L27",
  "Hanikan uimaranta (Espoo)": "https://goo.gl/maps/TAbtGaqedSuuC2zs9",
  "Kattilajärvi (Espoo)": "https://goo.gl/maps/Hw2UJTX6VqDGxY7e7",
  "Suomenlinna": "https://g.page/suomenlinnaofficial?share"
};

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
        beachTemp.beachLocation = beachLocation[element.meta.name];
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
