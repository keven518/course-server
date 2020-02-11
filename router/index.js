'use strict';

const Router = require('koa-router');
const router = new Router();
const utils  = require('../utils/app');


const IndexController = require('../controller/index');
/**  
 * 错误信息处理函数
*/
const ErrorHandler    = function (ctx,message) {
    return ctx.body = utils.appResult(message);
} 
// 全局统计返回处理
const appResponse     = async function(obj = {},action = null,ctx,next) {
    try {
        if(typeof(obj[action]) == 'function') {
            await obj[action]();
        } else {
            ErrorHandler(ctx,'未找到响应的方法');
        }
    } catch(err) {
        ErrorHandler(ctx,err.message);
    }
    next();
}


//获取用户列表
router.get('/user_list',async function(ctx,next) {
    await appResponse(new IndexController(ctx,next),'getUserList',ctx,next);
});
//获取用户详情
router.get('/user_info',async function(ctx,next) {
    await appResponse(new IndexController(ctx,next),'getUserInfo',ctx,next);
});

//添加管理员
router.post('/add_user',async function(ctx,next) {
    await appResponse(new IndexController(ctx,next),'addUser',ctx,next);
})

//更新管理员
router.put('/update_user',async function(ctx,next) {
    await appResponse(new IndexController(ctx,next),'updateUser',ctx,next);
})
//删除管理员
router.delete('/delete_user',async function(ctx,next) {
    await appResponse(new IndexController(ctx,next),'deleteUser',ctx,next);
})

module.exports = router;



