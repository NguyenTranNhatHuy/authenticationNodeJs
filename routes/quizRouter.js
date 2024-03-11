const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Quizzes = require("../models/quizes");
const quizRouter = express.Router();
quizRouter.use(bodyParser.json());
var authenticate = require("../middleware/authenticate");
const cors = require("cors");
quizRouter
    .route("/")
    .options(cors(), (req, res) => { res.sendStatus(200); })
    .get(cors(), (req, res, next) => {
        Quizzes.find({})
            .populate('questions')
            .then(
                (quizzes) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(quizzes);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Quizzes.create(req.body)
            .then((quiz) => {
                // Sau khi tạo quiz, sử dụng populate để lấy thông tin chi tiết của các câu hỏi
                return Quizzes.findById(quiz._id).populate('questions').exec();
            })
            .then((populatedQuiz) => {
                console.log("Quiz created", populatedQuiz);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(populatedQuiz);
            })
            .catch((err) => next(err));
    })


    .put(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /quizzes");
    })
    .delete(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Quizzes.deleteMany({})
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

quizRouter
    .route("/:quizId")
    .options(cors(), (req, res) => { res.sendStatus(200); })
    .get(cors(), (req, res, next) => {
        Quizzes.findById(req.params.quizId)
            .populate('questions')
            .then(
                (quiz) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(quiz);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

    .post(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("post opreration not support on /quizzes/" + req.params.quizId);
    })
    .put(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Quizzes.findByIdAndUpdate(
            req.params.quizId,
            {
                $set: req.body,
            },
            { new: true }
        )
            .then(
                (quiz) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(quiz);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Quizzes.findByIdAndDelete(req.params.quizId).then(
            (resp) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(resp);
            },
            (err) => next(err)
        );
    });



module.exports = quizRouter;