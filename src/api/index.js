const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
app.use(bodyParser())

const context = '/api/'
const state = {}

app.use((ctx) => {
  const name = ctx.path.split(context)[1]

  switch(ctx.method) {
    case 'POST': {
      let list = state[name]
      if (!list) list = []
      list.push(ctx.request.body)
      state[name] = list
      break
    }
    case 'DELETE': {
      state[name] = []
    }
    default: break
  }

  ctx.body = (state[name] || [])
})

app.listen(3000)
