const config = require('config')
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
const schemaConfig = config.get('mongoose.schemaConfig')
const SceneryCorrelationSchemaConfig = require('./schemas/scenery_correlation')
const SceneryCorrelationSchema = new Schema(SceneryCorrelationSchemaConfig, schemaConfig)

// 添加插件
SceneryCorrelationSchema.plugin(timestamps)
SceneryCorrelationSchema.plugin(uniqueValidator)

// 添加静态方法

mongoose.model('SceneryCorrelation', SceneryCorrelationSchema)

module.exports = mongoose.model('SceneryCorrelation')
