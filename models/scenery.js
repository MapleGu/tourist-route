const config = require('config')
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
const schemaConfig = config.get('mongoose.schemaConfig')
const ScenerySchemaConfig = require('./schemas/scenery')
const ScenerySchema = new Schema(ScenerySchemaConfig, schemaConfig)

// 添加插件
ScenerySchema.plugin(timestamps)
ScenerySchema.plugin(uniqueValidator)

// 添加静态方法

mongoose.model('Scenery', ScenerySchema)

module.exports = mongoose.model('Scenery')
