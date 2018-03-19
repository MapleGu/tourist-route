// const ObjectId = require('mongoose').Schema.Types.ObjectId
// const mongoose = require('mongoose')
//
// const Schema = mongoose.Schema

module.exports = {
  name: { type: String, index: true },
  place: { type: String, default: '' },
  openTime: { type: String, default: '' },
  location: { type: [ Number ], index: '2d', sparse: true },
  introduce: { type: String },
  price: { type: String },
  genre: { type: String },
  timeSpan: { type: String },
  number: { type: Number }
}
