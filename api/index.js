const Koa = require('koa')
const koaBody = require('koa-body')

const elastic = require('../elastic')

const app = new Koa()

app.use(koaBody({
  jsonLimit: '1kb'
}))

app.use(async function (ctx) {
  const body = ctx.request.body
  if (ctx.path === '/') {
    ctx.assert(ctx.method === 'POST', 403, 'POST method required')
    ctx.assert(body.type, 403, '.type required')
    ctx.assert(typeof body.scenery === 'string', 403, '.scenery (string) required')

    const data = {routes: [], info: {}}
    const r = await elastic.getRouteRecom1(body.scenery)
    let hits = r.hits.hits
    if (hits.length === 0) {
      data.routes = [body.scenery.split(' ').join('-')]
    } else {
      data.routes = hits.map(d => d._source.routeVar)
    }

    const info = {}
    data.routes.forEach(d => {
      if (d && typeof d === 'string') {
        d.split('-').forEach(dd => {
          info[dd] = true
        })
      }
    })
    const scenerys = await elastic.getScenery(Object.keys(info))
    scenerys.responses.forEach(d => {
      data.info[d.hits.hits[0] && d.hits.hits[0]._source.name] = d.hits.hits[0]
    })
    ctx.body = data
  } else if (ctx.path === '/scenery') {
    ctx.assert(ctx.method === 'POST', 403, 'POST method required')
    const data = await elastic.getScenery(body.scenery)
    ctx.body = { success: true, data }
  } else {
    ctx.status = 404
  }
})

app.listen(3000)
