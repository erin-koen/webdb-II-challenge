const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const knexConfig = require("./knexfile");

const db = knex(knexConfig.development);

const router = express.Router();

router.post("/", (req, res) => {
  const zoo = req.body;
  const { name } = req.body;
  if (name) {
    db.insert(zoo)
      .into("zoos")
      .then(ids => {
        res.status(201).json(ids);
      })
      .catch(err => {
        res.status(500).send("There was an error adding your zoo.");
      });
  } else {
    res.status(400).send("A zoo must have a name.");
  }
});

router.get("/", (req, res) => {
  db("zoos")
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      res.status(500).send("There was an error getting the zoos.");
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db("zoos")
    .where({ id })
    .then(zoo => {
      if (zoo.length > 0) {
        res.status(200).json(zoo);
      } else {
        res.status(404).send("That zoo was not found");
      }
    })
    .catch(err => {
      res.status(500).send("There was an error getting that zoo.");
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db("zoos")
    .where({ id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).send(`The zoo with id ${id} was successfully deleted`);
      } else {
        res.status(404).send("That zoo was not found");
      }
    })
    .catch(err => {
      res.status(500).send("There was an error deleting that zoo.");
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  db("zoos")
    .where({ id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).send(`The zoo with id ${id} was successfully updated`);
      } else {
        res.status(404).send("No zoo with that ID exists.");
      }
    })
    .catch(err => {
      res.status(500).send("There was an error updating the zoo.");
    });
});

module.exports = router;