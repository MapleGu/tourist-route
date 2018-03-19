const lineReader = require('line-reader')
const path = require('path')
const fs = require('fs')
const iconv = require('iconv-lite')
const model = require('../models')

const txtPath = path.resolve(__dirname, 'file/关联规则.txt')

const m = /\{(.+?)\}/g
const numberm = /\d([\d,.]*)\d/g

run()

function run () {
  const input = fs.createReadStream(txtPath)
  lineReader.eachLine(input.pipe(iconv.decodeStream('gb2312')), function (line, last, cb) {
    const data = { source: '', target: '', weight: 0 }
    if (!line || typeof line !== 'string') {
      console.log(typeof line)
      cb()
      return
    }
    const n = parseFloat(line.match(numberm).join(''))
    if (!isNaN(n)) {
      data.weight = n
    }

    line.match(m).forEach((d, i) => {
      d = d.substring(1, d.length - 1)
      if (i === 0) {
        data.source = d
      } else {
        data.target = d
      }
    })
    create(data, cb)
  })
}

async function create (data, cb) {
  await model.Scenerycorrelation.create(data)
  cb()
}
