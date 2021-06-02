var express = require("express");
const dotenv = require('dotenv').config();
var router = express.Router();
const fetch = require("node-fetch");
const cityNames = ["Helsinki", "Espoo", "Vantaa"];
const API_KEY=process.env.API_KEY;
/* GET Weather . */
router.get("/", async function (req, res, next) {
  let results = await getTriCitiesWeather();
  res.json(results);
});
async function getTriCitiesWeather() {
  const results = await Promise.all(
    cityNames.map((cityName) =>
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          cityName +
          "&appid="+API_KEY+"&units=metric"
      )
        .then((response) => response.json())
        .then((jsonResponse) => {
          let cityWeather = {};
          cityWeather.id = jsonResponse.id;
          cityWeather.city = jsonResponse.name;
          cityWeather.country = jsonResponse.sys.country;
          cityWeather.weather = {};
          cityWeather.weather.temprature = jsonResponse.main.temp;
          cityWeather.weather.feelsLike = jsonResponse.main.feels_like;
          cityWeather.weather.humidity = jsonResponse.main.humidity;
          cityWeather.weather.description = jsonResponse.weather[0].description;
          return cityWeather;
        })
    )
  );
  return results;
}

module.exports = router;
