// const ObjectId = require('mongoose').Schema.Types.ObjectId
// const mongoose = require('mongoose')
//
// const Schema = mongoose.Schema

module.exports = {
  source: { type: String, index: true },
  target: { type: String, index: true },
  weight: { type: Number, index: true }
}
