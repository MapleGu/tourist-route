const fs = require('fs')
const csv = require('csv')
const path = require('path')
// const debug = require('debug')('DEBUG:')
const iconv = require('iconv-lite')

// const model = require('../models')
const elastic = require('../elastic')

const csvPath = path.resolve(__dirname, 'file/景点信息表.csv')
const input = fs.createReadStream(csvPath)

run()

function run () {
  input
  .pipe(iconv.decodeStream('gb2312'))
  .pipe(csv.parse())
  .pipe(csv.transform((record, cb) => {
    createSceneryToElastic(record)
  }))
}

async function createSceneryToElastic (data) {
  if (data[1] === 'SceneryName') {
    return
  }
  const scenery = {
    name: data[1],
    place: data[2],
    openTime: data[3],
    introduce: data[8],
    price: data[10],
    genre: data[11],
    timeSpan: data[15]
  }
  if (data[4] && data[5]) {
    scenery.location = {
      lat: +data[4],
      lon: +data[5]
    }
  }

  elastic.index({
    index: 'scenery',
    type: 'fulltext',
    body: scenery
  }, (err, response) => {
    if (err) {
      console.log(err)
    }
  })
}
//
// async function createScenery (data, cb) {
//   const scenery = {
//     name: data[1],
//     place: data[2],
//     openTime: data[3],
//     location: [data[4], data[5]],
//     introduce: data[8],
//     price: data[10],
//     genre: data[11],
//     timeSpan: data[15],
//     number: data[0]
//   }
//
//   const d = await model.Scenery.create(scenery)
//   debug(d)
//   cb(null)
// }
