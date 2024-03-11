const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    object_id: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    keywords: {
        type: [String],
        default: []
    },
    correctAnswerIndex: {
        type: Number,
        required: true
    }
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
