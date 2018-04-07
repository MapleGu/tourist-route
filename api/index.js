const Koa = require('koa')
const koaBody = require('koa-body')
const cors = require('@koa/cors')

const elastic = require('../elastic')

const app = new Koa()

app.use(koaBody({
  jsonLimit: '1kb'
}))

app.use(cors())

app.use(async function (ctx) {
  const body = ctx.request.body
  console.log(ctx.path)
  if (ctx.path === '/1') {
    await Recom1(ctx, body)
  } else if (ctx.path === '/2') {
    await Recom2(ctx, body)
  } else if (ctx.path === '/3') {
    await Recom3(ctx, body)
  } else if (ctx.path === '/4') {
    await Recom4(ctx, body)
  } else if (ctx.path === '/scenery') {
    ctx.assert(ctx.method === 'POST', 403, 'POST method required')
    const data = await elastic.getScenery(body.scenery)
    ctx.body = { success: true, data }
  } else {
    ctx.status = 404
  }
})

app.listen(3001)

async function Recom4 (ctx, body) {
  ctx.assert(ctx.method === 'POST', 403, 'POST method required')
  ctx.assert(typeof body.scenery === 'string', 403, '.scenery (string) required')

  const data = {routes: [], info: {}}
  const f = await elastic.getFavriteArea(body.scenery)
  const r = await elastic.getRouteRecom4(f.aggregations.favrite.buckets[0].key)
  data.routes = body.scenery.split(' ')

  const len = 6
  if (data.routes.length > len) {
    data.routes = data.routes.slice(0, len)
  }

  const scenerys = await elastic.getScenery(data.routes)
  r.hits.hits.forEach(d => {
    data.info[d._source.name] = d
    data.routes.push(d._source.name)
  })

  data.routes = [...new Set(data.routes)]

  scenerys.responses.forEach(d => {
    data.info[d.hits.hits[0] && d.hits.hits[0]._source.name] = d.hits.hits[0]
  })

  let routes = data.routes.filter(d => !!data.info[d]).sort((a, b) => {
    if (data.info[a]._source.location.lat > data.info[b]._source.location.lat) {
      return 1
    }
    return -1
    // if ((data.info[a]._source.location.lat - data.info[b]._source.location.lat) > (data.info[a]._source.location.lon - data.info[b]._source.location.lon)) {
    //   return 1
    // } else {
    //   return -1
    // }
  })
  routes = [routes.join('-')]
  data.routes = routes
  ctx.body = data
}

async function Recom3 (ctx, body) {
  ctx.assert(ctx.method === 'POST', 403, 'POST method required')
  ctx.assert(typeof body.scenery === 'string', 403, '.scenery (string) required')

  const data = {routes: [], info: {}}
  const f = await elastic.getFavriteCate(body.scenery)
  const r = await elastic.getRouteRecom3(f.aggregations.favrite.buckets[0].key)
  data.routes = body.scenery.split(' ')

  const len = 6
  if (data.routes.length > len) {
    data.routes = data.routes.slice(0, len)
  }

  const scenerys = await elastic.getScenery(data.routes)
  r.hits.hits.forEach(d => {
    data.info[d._source.name] = d
    data.routes.push(d._source.name)
  })

  data.routes = [...new Set(data.routes)]

  scenerys.responses.forEach(d => {
    data.info[d.hits.hits[0] && d.hits.hits[0]._source.name] = d.hits.hits[0]
  })

  let routes = data.routes.filter(d => !!data.info[d]).sort((a, b) => {
    if (data.info[a]._source.location.lat > data.info[b]._source.location.lat) {
      return 1
    }
    return -1
  })
  routes = [routes.join('-')]
  data.routes = routes
  ctx.body = data
}

async function Recom2 (ctx, body) {
  ctx.assert(ctx.method === 'POST', 403, 'POST method required')
  ctx.assert(typeof body.scenery === 'string', 403, '.scenery (string) required')

  const data = {routes: [], info: {}}
  const r = await elastic.getRouteRecom2(body.scenery)

  let source = r.aggregations.aggs_source.buckets
  if (source.length === 0) {
    data.routes = [body.scenery.split(' ').join('-')]
  } else {
    data.routes = [...new Set(source.map(d => d.key.split(',')).toString().split(','))]
  }

  let target = r.aggregations.aggs_target.buckets
  if (target.length === 0) {
    // nothing
  } else {
    data.routes.concat([...new Set(target.map(d => d.key.split(',')).toString().split(','))])
  }

  data.routes = [...new Set(data.routes)]
  data.routes = [data.routes.join('-')]
  const len = 10
  if (data.routes.length > len) {
    data.routes = data.routes.slice(0, len)
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

  let routes = data.routes[0].split('-').filter(d => !!data.info[d]).sort((a, b) => {
    if (data.info[a]._source.location.lat > data.info[b]._source.location.lat) {
      return 1
    }
    return -1
  })
  routes = [routes.join('-')]
  data.routes = routes
  ctx.body = data
}

async function Recom1 (ctx, body) {
  ctx.assert(ctx.method === 'POST', 403, 'POST method required')
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

  let routes = data.routes[0].split('-').filter(d => !!data.info[d]).sort((a, b) => {
    if (data.info[a]._source.location.lat > data.info[b]._source.location.lat) {
      return 1
    }
    return -1
  })
  routes = [routes.join('-')]
  data.routes = routes
  ctx.body = data
}
