const config = require('config')
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
const schemaConfig = config.get('mongoose.schemaConfig')
const RouteSchemaConfig = require('./schemas/route')
const RouteSchema = new Schema(RouteSchemaConfig, schemaConfig)

// 添加插件
RouteSchema.plugin(timestamps)
RouteSchema.plugin(uniqueValidator)

// 添加静态方法

mongoose.model('Route', RouteSchema)

module.exports = mongoose.model('Route')
