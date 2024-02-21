const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var idsSchema = new Schema({
  kind: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: false,
  },
});
var itemsSchema = new Schema(
  {
    kind: {
      type: String,
      required: true,
    },
    etag: {
      type: String,
      required: true,
    },
    id: idsSchema,
  },
  {
    timestamps: true,
  }
);

var pageInfosSchema = new Schema({
  totalResults: {
    type: Number,
    required: true,
  },
  resultsPerPage: {
    type: Number,
    required: true,
  },
});

const youtubeSchema = new Schema(
  {
    kind: {
      type: String,
      required: true,
    },
    etag: {
      type: String,
      required: true,
    },
    nextPageToken: {
      type: String,
      required: true,
    },
    regionCode: {
      type: String,
      required: true,
    },
    pageInfo: pageInfosSchema,
    items: [itemsSchema],
  },
  {
    timestamps: true,
  }
);

var Youtubes = mongoose.model("Youtube", youtubeSchema);
module.exports = Youtubes;
