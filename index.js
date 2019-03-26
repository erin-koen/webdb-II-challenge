const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const knexConfig = require("./knexfile");

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

server.post("/api/zoos", (req, res) => {
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

server.get("/api/zoos", (req, res) => {
  db("zoos")
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      res.status(500).send("There was an error getting the zoos.");
    });
});

server.get("/api/zoos/:id", (req, res) => {
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

server.delete("/api/zoos/:id", (req, res) => {
  const { id } = req.params;
  db("zoos")
    .where({ id })
    .del()
    .then(count => {
      if (count>0){
        res.status(200).send(`The zoo with id ${id} was successfully deleted`)
      } else {
        res.status(404).send("That zoo was not found")
      }
    })
    .catch(err => {
      res.status(500).send("There was an error deleting that zoo.");
    });
});

server.put("/api/zoos/:id", (req, res) => {
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

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
