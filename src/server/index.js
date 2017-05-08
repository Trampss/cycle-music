const Koa = require('koa')
const api = require('./api')
const statics = require('./statics')

const app = new Koa()

statics(app)
api(app)

app.listen(3000)
