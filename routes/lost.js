const express = require("express");
const router = express.Router();
const { dbQuery } = require("../dbConnection");
/*date manipulation*/
const moment = require("moment");

/*Lost routes*/
router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const lost = await dbQuery("SELECT * FROM lost ORDER BY date ASC");

      return res.status(200).json(lost.rows);
    } catch (error) {
      return next({
        status: 404,
        message: error.message,
      });
    }
  })
  .post(async (req, res, next) => {
    try {
      /*state from react*/
      const { category, date, name, location, img, placeOrigin, description } =
        req.body;

      console.log("Req body is", req.body);
      /*date manipulations*/
      const formattedDate = new Date(Date.parse(date)).toString();
      const newmoment = moment(formattedDate).format("DD.MM.YYYY, HH:mm");
      /*inserting into db*/
      const newlost = await dbQuery(
        "INSERT INTO lost(category, date, name, location, img, placeOrigin, description) VALUES($1, $2, $3, $4, $5, $6, $7)",
        [category, newmoment, name, location, img, placeOrigin, description]
      );

      return res
        .status(201)
        .json({ message: `Lost item added with ID: ${id}` });
    } catch (error) {
      return next({
        status: 404,
        message: error.message,
      });
    }
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      /*taking exact id from db*/
      const onelost = await dbQuery("SELECT * FROM lost WHERE id = $1", [id]);

      return res.status(201).json(onelost.rows);
    } catch (error) {
      return next({
        status: 404,
        message: error.message,
      });
    }
  })
  .put(async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const { category, date, name, location, img, placeOrigin, description } =
        req.body;
      const formattedDate = new Date(Date.parse(date)).toString();
      const newmoment = moment(formattedDate).format("DD.MM.YYYY, HH:mm");
      const editlost = await dbQuery(
        "UPDATE lost SET categgory = $1, date = $2, name=$3, location=$4, img=$5, placeOrigin=$6, description=$7 WHERE id = $8",
        [category, newmoment, name, location, img, placeOrigin, description]
      );

      return res.status(201).json({ message: `Item modified with ID: ${id}` });
    } catch (error) {
      return next({
        status: 404,
        message: error.message,
      });
    }
  })
  .delete(async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      /*deleting from lost by od number*/
      const deletelost = dbQuery("DELETE FROM lost WHERE id = $1", [id]);
      return res
        .status(201)
        .json({ message: `Lost item deleted with ID: ${id}` });
    } catch (error) {
      return next({
        status: 404,
        message: error.message,
      });
    }
  });
module.exports = router;
