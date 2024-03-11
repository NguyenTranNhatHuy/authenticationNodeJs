const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Questions = require("../models/questions");
const questionRouter = express.Router();
questionRouter.use(bodyParser.json());
var authenticate = require("../middleware/authenticate");
const cors = require("cors");
questionRouter
    .route("/")
    .options(cors(), (req, res) => { res.sendStatus(200); })
    .get(cors(), (req, res, next) => {
        Questions.find({})
            .then(
                (quesntions) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(quesntions);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Questions.create(req.body)
            .then(
                (question) => {
                    console.log("Question created", question);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(question);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

    .put(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /questions");
    })
    .delete(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Questions.deleteMany({})
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

questionRouter
    .route("/:quesntionId")
    .options(cors(), (req, res) => { res.sendStatus(200); })
    .get(cors(), (req, res, next) => {
        Questions.findById(req.params.questionId)
            .populate('comments.author')
            .then(
                (question) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(question);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

    .post(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("post opreration not support on /questions/" + req.params.quesntionId);
    })
    .put(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Questions.findByIdAndUpdate(
            req.params.quesntionId,
            {
                $set: req.body,
            },
            { new: true }
        )
            .then(
                (question) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(question);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Questions.findByIdAndDelete(req.params.quesntionId).then(
            (resp) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(resp);
            },
            (err) => next(err)
        );
    });



module.exports = questionRouter;