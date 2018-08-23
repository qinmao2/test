const path = require('path'),
  koa = new (require('koa'))(),
  koaRouter = require('koa-router')(),
  logger = require('koa-logger'),
  koaStatic = require('koa-static'),
  historyApiFallback = require('koa-history-api-fallback'),
  image = require('./server/routes/image.js'),
  user = require('./server/routes/user.js'),
  goods = require('./server/routes/goods.js');

koa.use(require('koa-bodyparser')());
koa.use(logger());
koa.use(historyApiFallback());

koa.use(async (ctx, next) => {
  let start = new Date();
  await next();
  let ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

koa.on('error', function(err, ctx) {
  console.log('server error: ', err);
});

// 静态文件 koaStatic 在 koa-router 的其他规则之上
koa.use(koaStatic(path.resolve('dist'))); // 将 webpack 打包好的项目目录作为 Koa 静态文件服务的目录

// 挂载到 koa-router 上，同时会让所有的 user 的请求路径前面加上 '/auth' 。
koaRouter.use('/auth', user.routes());

koaRouter.use(goods.routes());

koaRouter.use(image.routes());

koa.use(koaRouter.routes()); // 将路由规则挂载到Koa上。

koa.listen(8889, () => {
  console.log('Koa is listening on port 8889');
});

module.exports = koa;