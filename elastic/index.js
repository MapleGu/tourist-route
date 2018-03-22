const config = require('config')
const elasticsearch = require('elasticsearch')

const scenerySchemas = require('./schemas/scenery')
const routeSchemas = require('./schemas/route')
const sceneryCorrelationSchemas = require('./schemas/scenery_correlation')

const opt = config.get('elasticsearch')
const client = new elasticsearch.Client(opt)

client.ping({
  requestTimeout: 3000
}, err => {
  if (err) {
    console.error('elasticsearch cluster is down!')
    process.exit(1)
  } else {
    console.log('All is well')
  }
})

createIndices('scenery', scenerySchemas)
createIndices('route', routeSchemas)
createIndices('scenery_correlation', sceneryCorrelationSchemas)

module.exports = client

function createIndices (index, schema) {
  client.indices.create({
    index: 'scenery',
    body: scenerySchemas
  }, err => {
    if (err) {
      const errObj = JSON.parse(err.response)
      if (errObj.error.type !== 'resource_already_exists_exception') {
        console.log(err)
        process.exit(1)
      }
    }
  })
}
