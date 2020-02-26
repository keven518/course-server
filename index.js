'use strict';
const http      = require('http');
const Koa        = require('koa');
const koaBody    = require('koa-body');
const app        = new Koa();
const router     = require('./router/index');
const bodyParser = require('koa-bodyparser');
require('./config/db');
app.use(async (ctx,next)=>{
    ctx.appPath = __dirname;
    await next();
})
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}));
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
http.createServer(app.callback()).listen(8001);