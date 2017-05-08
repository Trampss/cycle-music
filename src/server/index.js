const Koa = require('koa')
const api = require('./api')
const statics = require('./statics')

const PORT = process.env.PORT || 3000

const app = new Koa()

statics(app)
api(app)

app.listen(PORT)
console.log(`Listening to ${PORT}`) // eslint-disable-line
