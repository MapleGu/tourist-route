const config = require('config')
const elasticsearch = require('elasticsearch')

const scenerySchemas = require('./schemas/scenery')
const routeSchemas = require('./schemas/route')
const sceneryCorrelationSchemas = require('./schemas/scenery_correlation')

const opt = config.get('elasticsearch')
console.log(opt)
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

client.getRouteRecom4 = getRouteRecom4
function getRouteRecom4 (val) {
  const should = {match: { areaID: val }}
  return new Promise((resolve, reject) => {
    client.search({
      index: 'scenery',
      type: 'fulltext',
      body: {
        size: 3,
        sort: {
          times: 'desc'
        },
        query: {
          bool: { should }
        }
      }
    }, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}

client.getFavriteArea = getFavriteArea
// 找出最感兴趣区域
function getFavriteArea (val) {
  const should = val.split(' ').filter(d => !!d).map(d => ({match: { name: d }}))
  return new Promise((resolve, reject) => {
    client.search({
      index: 'scenery',
      type: 'fulltext',
      body: {
        size: 0,
        query: {
          bool: { should }
        },
        aggs: {
          favrite: {
            terms: {
              size: 1,
              field: 'areaID'
            }
          }
        }
      }
    }, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}

client.getRouteRecom3 = getRouteRecom3
function getRouteRecom3 (val) {
  const should = {match: { genre: val }}
  return new Promise((resolve, reject) => {
    client.search({
      index: 'scenery',
      type: 'fulltext',
      body: {
        size: 3,
        sort: {
          times: 'desc'
        },
        query: {
          bool: { should }
        }
      }
    }, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}

client.getFavriteCate = getFavriteCate
// 找出最感兴趣类别
function getFavriteCate (val) {
  const should = val.split(' ').filter(d => !!d).map(d => ({match: { name: d }}))
  return new Promise((resolve, reject) => {
    client.search({
      index: 'scenery',
      type: 'fulltext',
      body: {
        size: 0,
        query: {
          bool: { should }
        },
        aggs: {
          favrite: {
            terms: {
              size: 1,
              field: 'genre'
            }
          }
        }
      }
    }, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}

client.getRouteRecom2 = getRouteRecom2
function getRouteRecom2 (val) {
  const should = val.split(' ').filter(d => !!d).map(d => ({match: { source: d }}))
  return new Promise((resolve, reject) => {
    client.search({
      index: 'scenery_correlation',
      type: 'fulltext',
      body: {
        size: 0,
        query: {
          bool: { should }
        },
        aggs: {
          aggs_source: {
            terms: {
              size: 20,
              field: 'source.keyword',
              order: {
                'avg_score.value': 'asc'
              }
            },
            aggs: {
              avg_score: {
                avg: {
                  field: 'weight'
                }
              }
            }
          },
          aggs_target: {
            terms: {
              size: 20,
              field: 'target.keyword',
              order: {
                'avg_score.value': 'asc'
              }
            },
            aggs: {
              avg_score: {
                avg: {
                  field: 'weight'
                }
              }
            }
          }
        }
      }
    }, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}

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
