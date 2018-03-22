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

client.getRouteRecom1 = getRouteRecom1
function getRouteRecom1 (val) {
  return new Promise((resolve, reject) => {
    client.search({
      index: 'route',
      type: 'fulltext',
      size: 2,
      body: {
        query: {
          match: {
            routeVar: val
          }
        }
      }
    }, (error, response) => {
      if (error) {
        reject(error)
      } else {
        console.log(response + '=====')
        resolve(response)
      }
    })
  })
}

client.getScenery = getScenery
function getScenery (val = []) {
  const index = { index: 'scenery', type: 'fulltext' }
  const body = []
  val.forEach(d => {
    if (typeof d === 'string') {
      body.push(index)
      body.push({ query: { match: { name: d } }, size: 1 })
    }
  })
  return new Promise((resolve, reject) => {
    client.msearch({ body }, (error, response) => {
      if (error) {
        reject(error)
      } else {
        console.log(JSON.stringify(response) + '=====')
        resolve(response)
      }
    })
  })
}

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

module.exports = client
