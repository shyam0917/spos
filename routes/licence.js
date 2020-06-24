const express = require("express");
const routes = express.Router();
const mysql = require("mysql");
const constantData = require("../services/tools/utility/constant");
const sqlConnect = require("../services/tools/utility/mssql.connection");
const pool = new mysql.createPool(constantData.dbConnection);
const uuid = require("uuid/v4");

// getting all the licence list
routes.get("/", (req, res, next) => {
  let parameters = {
    query: "SELECT * FROM tbl_licence"
  };
  sqlConnect.connect(
    "query",
    parameters,
    function(error, param) {
      if (error) {
        res.status(500).json({ status: false, error: error.message });
      }
      if (param) {
        res.status(200).json({ status: true, data: param });
      }
    },
    pool
  );
});

// creating new licence
routes.post("/create", (req, res, next) => {
  const { body } = req;
  let id = uuid();
  let parameters = {
    query: `INSERT INTO tbl_licence (id, user_id, store_id) VALUES ("${id}", ${body.userID}, ${body.store_id});`
  };
  sqlConnect.connect(
    "query",
    parameters,
    function(error, param) {
      if (error) {
        res.status(500).json({ status: false, error: error.message });
      }
      if (param) {
        res
          .status(201)
          .json({ status: true, message: "Licence create successfully" });
      }
    },
    pool
  );
});

// updating licence
routes.patch("/:id", (req, res, next) => {
  let id = req.params.id;
  let { body } = req;
  let queryConstraint = "";
  for (let key in body) {
    queryConstraint += `${key} = "${body[key]}", `;
  }
  queryConstraint = queryConstraint.substring(0, queryConstraint.length - 2);
  let parameters = {
    query: `UPDATE tbl_licence SET ${queryConstraint} WHERE id = "${id}";`
  };
  sqlConnect.connect(
    "query",
    parameters,
    function(error, param) {
      if (error) {
        res.status(500).json({ status: false, error: error.message });
      }
      if (param) {
        res
          .status(200)
          .json({ status: true, message: "Licence updated successfully" });
      }
    },
    pool
  );
});

// deleting licence
routes.delete("/:id", (req, res, next) => {
  let id = req.params.id;
  let parameters = {
    query: `DELETE FROM tbl_licence WHERE id="${id}"`
  };
  sqlConnect.connect(
    "query",
    parameters,
    function(error, param) {
      if (error) {
        res.status(500).json({ status: false, error: error.message });
      } else {
        res
          .status(204)
          .json({ status: true, message: "Licence deleted successfully" });
      }
    },
    pool
  );
});

module.exports = routes;
