const express = require("express");
const router = express.Router();
const { dbQuery } = require("../dbConnection");
/*date manipulation*/
const moment = require("moment");

/*event routes*/
router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const event = await dbQuery("SELECT * FROM event ORDER BY date ASC");

      return res.status(200).json(event.rows);
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
      const { name, type, date, location, image, description } = req.body;

      console.log("Req body events is", req.body);
      /*date manipulations*/
      const formattedDate = new Date(Date.parse(date)).toString();
      const newmoment = moment(formattedDate).format("DD.MM.YYYY, HH:mm");
      /*inserting into db*/
      const newevent = await dbQuery(
        "INSERT INTO event(name, type, date, location, image, description) VALUES($1, $2, $3, $4, $5, $6)",
        [name, type, newmoment, location, image, description]
      );

      return res.status(201).json({ message: `event added with ID: ${id}` });
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
      const oneevent = await dbQuery("SELECT * FROM event WHERE id = $1", [id]);

      return res.status(201).json(oneevent.rows);
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
      const { name, type, date, location, image, description } = req.body;
      const formattedDate = new Date(Date.parse(date)).toString();
      const newmoment = moment(formattedDate).format("DD.MM.YYYY, HH:mm");
      const editevent = await dbQuery(
        "UPDATE event SET name = $1, type = $2, date=$3, location=$4, image=$5, description=$6 WHERE id = $7",
        [name, type, newmoment, location, image, description]
      );

      return res.status(201).json({ message: `Event modified with ID: ${id}` });
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
      const deleteevent = dbQuery("DELETE FROM event WHERE id = $1", [id]);
      return res
        .status(201)
        .json({ message: `event item deleted with ID: ${id}` });
    } catch (error) {
      return next({
        status: 404,
        message: error.message,
      });
    }
  });
module.exports = router;
