const lineReader = require('line-reader')
const path = require('path')

const model = require('../models')

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
        if (d.includes('-')) {
          const n = parseInt(d.match(/\d/g).join(''))
          if (!isNaN(n)) {
            data.weight = n
          }
        } else {
          data.routes.push({
            name: d
          })
          data.routeVar = data.routeVar + d + '-'
        }
      }
    })
    createRoute(data, cb)
  })
}

async function createRoute (data, cb) {
  await model.Route.create(data)
  cb()
}
