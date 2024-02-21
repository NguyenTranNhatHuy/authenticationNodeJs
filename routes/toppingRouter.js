const express = require("express");
const bodyParser = require("body-parser");

const toppingRouter = express.Router();
toppingRouter.use(bodyParser.json());

toppingRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("will send all the topping to you!");
  })
  .post((req, res, next) => {
    res.end(
      "will add the topping: " +
        req.body.type +
        "with details: " +
        req.body.price_extra
    );
  });

toppingRouter
  .route("/:toppingId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Topping by id: " + req.params.toppingId);
    // next();
  })
  .put((req, res, next) => {
    res.write("Updating the topping: " + req.params.toppingId + "\n");
    res.end(
      "Will update the cake: Type " +
        req.body.type +
        " with price extra: " +
        req.body.price_extra
    );
  })

  .delete((req, res, next) => {
    res.end("Deleting cake: " + req.params.toppingId);
  });

module.exports = toppingRouter;
