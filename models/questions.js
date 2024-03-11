const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({

    text: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctAnswerIndex: {
        type: Number,
        required: true
    }
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
