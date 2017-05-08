const bodyParser = require('koa-bodyparser')

module.exports = (app) => {
  app.use(bodyParser())

  const context = '/api/'
  const state = {}

  app.use((ctx) => {
    const name = ctx.path.split(context)[1]

    switch (ctx.method) {
      case 'POST': {
        let list = state[name]
        if (!list) list = []
        list.push(ctx.request.body)
        state[name] = list
        break
      }
      case 'DELETE': {
        state[name] = []
        break
      }
      default: break
    }

    ctx.body = (state[name] || [])
  })
}
