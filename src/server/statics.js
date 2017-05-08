const path = require('path')
const serverStatic = require('koa-static')

module.exports = (app) => {
  app.use(serverStatic(path.resolve(__dirname, '..', '..', 'public')))
}
