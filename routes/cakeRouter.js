const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Cakes = require("../models/cakes");
const cakeRouter = express.Router();
cakeRouter.use(bodyParser.json());
cakeRouter
  .route("/")
  .get((req, res, next) => {
    Cakes.find({})
      .then(
        (Cakes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(Cakes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Cakes.create(req.body)
      .then(
        (dish) => {
          console.log("Cakes created", dish);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Cakes");
  })
  .delete((req, res, next) => {
    Cakes.deleteMany({})
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

cakeRouter
  .route("/:cakeId")

  .get((req, res, next) => {
    Cakes.findById(req.params.cakeId)
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
    res.end("post opreration not support on /Cakes/" + req.params.cakeId);
  })
  .put((req, res, next) => {
    Cakes.findByIdAndUpdate(
      req.params.cakeId,
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
    Cakes.findByIdAndDelete(req.params.cakeId).then(
      (resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      },
      (err) => next(err)
    );
  });

cakeRouter
  .route("/:cakeId/comments")
  .get((req, res, next) => {
    Cakes.findById(req.params.cakeId)
      .then(
        (dish) => {
          if (dish != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          } else {
            const err = new Error("Dish " + req.params.cakeId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Cakes.findById(req.params.cakeId)
      .then((dish) => {
        if (dish != null) {
          dish.comments.push(req.body);
          dish
            .save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish.comments);
            })
            .catch((err) => next(err));
        } else {
          const err = new Error("Dish " + req.params.cakeId + " not found");
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Cakes.findById(req.params.cakeId)
      .then((dish) => {
        if (dish != null) {
          for (var i = dish.comments.length - 1; i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).deleteOne();
          }
          dish
            .save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            })
            .catch((err) => next(err));
        } else {
          const err = new Error("Dish " + req.params.cakeId + " not found");
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });
cakeRouter
  .route("/:cakeId/comments/:commentId")
  .get((req, res, next) => {
    Cakes.findById(req.params.cakeId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId));
          } else if (dish == null) {
            const err = new Error("Dish " + req.params.cakeId + " not found");
            err.status = 404;
            return next(err);
          } else {
            const err = new Error(
              "Comment " + req.params.commentId + " not found"
            );
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /Cakes/" +
        req.params.cakeId +
        "/comments/" +
        req.params.commentId
    );
  });

module.exports = cakeRouter;
