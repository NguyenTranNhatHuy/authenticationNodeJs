const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Youtubes = require("../models/youtubes");
const youtubeRouter = express.Router();
youtubeRouter.use(bodyParser.json());
youtubeRouter
  .route("/")
  .get((req, res, next) => {
    Youtubes.find({})
      .then(
        (dishes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dishes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Youtubes.create(req.body)
      .then(
        (youtube) => {
          console.log("Youtube created", youtube);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(youtube);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete((req, res, next) => {
    Youtubes.deleteMany({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

youtubeRouter
  .route("/:youtubeId")

  .get((req, res, next) => {
    Youtubes.findById(req.params.youtubeId)
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("post opreration not support on /youtubes/" + req.params.youtubeId);
  })
  .put((req, res, next) => {
    Youtubes.findByIdAndUpdate(
      req.params.youtubeId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Youtubes.findByIdAndDelete(req.params.youtubeId).then(
      (resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      },
      (err) => next(err)
    );
  });

module.exports = youtubeRouter;
