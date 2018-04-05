const lineReader = require('line-reader')
const path = require('path')

const elastic = require('../elastic')
// const model = require('../models')

const txtPath = path.resolve(__dirname, 'file/路线.txt')

run()

function run () {
  lineReader.eachLine(txtPath, function (line, last, cb) {
    const data = { routes: [], routeVar: '' }
    if (!line || typeof line !== 'string') {
      console.log(typeof line)
      cb()
      return
    }
    line.split(' ').forEach(d => {
      if (d) {
        data.routes.push({
          name: d
        })
        if (data.routeVar) {
          data.routeVar = data.routeVar + '-' + d
        } else {
          data.routeVar = d
        }
      }
    })
    createRoute(data, cb)
  })
}

async function createRoute (data, cb) {
  elastic.index({
    index: 'route',
    type: 'fulltext',
    body: data
  }, (err, response) => {
    if (err) {
      console.log(err)
    } else {
      cb()
    }
  })
}
// async function createRoute (data, cb) {
//   await model.Route.create(data)
//   cb()
// }
