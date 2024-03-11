const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    object_id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }]
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
