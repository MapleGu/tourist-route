const ObjectId = require('mongoose').Schema.Types.ObjectId
const mongoose = require('mongoose')
//
const Schema = mongoose.Schema

const routeSchema = new Schema({
  source: { type: ObjectId },
  name: { type: String }
})
module.exports = {
  weight: { type: Number, index: true },
  routeVar: { type: String, index: true },
  routes: [routeSchema]
}
