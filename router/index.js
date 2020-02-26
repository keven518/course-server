'use strict';

const Router            = require('koa-router');
const router            = new Router();
const utils             = require('../utils/app');
const CollectAddress    = require('../controller/collect_address');
const CourseController  = require('../controller/course');
const CourseCategory    = require('../controller/course_category');
const ExpressController = require('../controller/express');
const CourseChapter     = require('../controller/course_chapter');
const ProductController = require('../controller/product');
const ProductCategory   = require('../controller/product_category');
const Attachment        = require('../controller/attachment');


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

//获取用户地址列表
router.get('/collect/address',async (ctx,next) => {
    await appResponse(new CollectAddress(ctx,next),'list',ctx,next);
});
//添加用户地址
router.post('/collect/address',async (ctx,next) => {
    await appResponse(new CollectAddress(ctx,next),'add',ctx,next);
});
//更新用户地址
router.put('/collect/address',async (ctx,next) => {
    await appResponse(new CollectAddress(ctx,next),'update',ctx,next);
});
//删除用户地址
router.delete('/collect/address',async (ctx,next) => {
    await appResponse(new CollectAddress(ctx,next),'delete',ctx,next);
});

//课程列表
router.get('/course',async (ctx,next) => {
    await appResponse(new CourseController(ctx,next),'list',ctx,next);
});
//删除课程
router.delete('/course',async (ctx,next) => {
    await appResponse(new CourseController(ctx,next),'delete',ctx,next);
});
//添加课程
router.post('/course',async (ctx,next) => {
    await appResponse(new CourseController(ctx,next),'add',ctx,next);
});
//更新课程
router.put('/course',async (ctx,next) => {
    await appResponse(new CourseController(ctx,next),'update',ctx,next);
});
//课程章节列表
router.get('/course/chapter',async (ctx,next) => {
    await appResponse(new CourseChapter(ctx,next),'list',ctx,next);
});
//课程章节添加
router.post('/course/chapter',async (ctx,next) => {
    await appResponse(new CourseChapter(ctx,next),'add',ctx,next);
});
//课程章节更新
router.put('/course/chapter',async (ctx,next) => {
    await appResponse(new CourseChapter(ctx,next),'update',ctx,next);
});
//课程章节更新
router.delete('/course/chapter',async (ctx,next) => {
    await appResponse(new CourseChapter(ctx,next),'delete',ctx,next);
});

//课程分类列表
router.get('/course/category',async (ctx,next) => {
    await appResponse(new CourseCategory(ctx,next),'list',ctx,next);
});
//课程分类添加
router.post('/course/category',async (ctx,next) => {
    await appResponse(new CourseCategory(ctx,next),'add',ctx,next);
});
//课程分类更新
router.put('/course/category',async (ctx,next) => {
    await appResponse(new CourseCategory(ctx,next),'update',ctx,next);
});
//课程分类删除
router.delete('/course/category',async (ctx,next) => {
    await appResponse(new CourseCategory(ctx,next),'delete',ctx,next);
});

//快递列表
router.get('/express',async (ctx,next) => {
    await appResponse(new ExpressController(ctx,next),'list',ctx,next);
});
//快递添加
router.post('/express',async (ctx,next) => {
    await appResponse(new ExpressController(ctx,next),'add',ctx,next);
});
//快递更新
router.put('/express',async (ctx,next) => {
    await appResponse(new ExpressController(ctx,next),'update',ctx,next);
});
//快递删除
router.delete('/express',async (ctx,next) => {
    await appResponse(new ExpressController(ctx,next),'delete',ctx,next);
});

//产品列表
router.get('/product',async (ctx,next) => {
    await appResponse(new ProductController(ctx,next),'list',ctx,next);
});
//产品添加
router.post('/product',async (ctx,next) => {
    await appResponse(new ProductController(ctx,next),'add',ctx,next);
});
//产品更新
router.put('/product',async (ctx,next) => {
    await appResponse(new ProductController(ctx,next),'update',ctx,next);
});
//产品删除
router.delete('/product',async (ctx,next) => {
    await appResponse(new ProductController(ctx,next),'delete',ctx,next);
});

//产品分类列表
router.get('/product/category',async (ctx,next) => {
    await appResponse(new ProductCategory(ctx,next),'list',ctx,next);
});
//产品分类添加
router.post('/product/category',async (ctx,next) => {
    await appResponse(new ProductCategory(ctx,next),'add',ctx,next);
});
//产品分类更新
router.put('/product/category',async (ctx,next) => {
    await appResponse(new ProductCategory(ctx,next),'update',ctx,next);
});
//产品分类删除
router.delete('/product/category',async (ctx,next) => {
    await appResponse(new ProductCategory(ctx,next),'delete',ctx,next);
});
//附件上传
router.post('/attach/upload',async (ctx,next) => {
    await appResponse(new Attachment(ctx,next),'uploadQN',ctx,next);
});

module.exports = router;



