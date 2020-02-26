'use strict';

const baseController = require('./base');
const szjcomo        = require('@szjcomo/szjvuetools');
const Sequelize      = require('sequelize');
const dbConfig       = require('../config/db');

/**
 * 产品控制器
 */
class Product extends baseController {
    /**
     * 获取列表验证器
     *
     * @readonly
     * @memberof ProductCategory
     */
    get listValidate() {
        let that = this;
        return {
            limit:that.rules.default(30).number(),
            page:that.rules.default(1).number(),
            title:that.rules.default('').required(),
            category_id:that.rules.default(0).number(),
            product_id:that.rules.default(0).number(),
            sort:that.rules.default(0).number(),
            order:that.rules.default('product_id').required(),
            is_new:that.rules.default(-1).number(),
            is_best:that.rules.default(-1).number(),
            is_hot:that.rules.default(-1).number(),
            is_show:that.rules.default(-1).number()
        };
    }
    /**
     * 产品分类主键验证
     *
     * @readonly
     * @memberof ProductCategory
     */
    get pkValidate() {
        let that = this;
        return {
            product_id:that.ctx.rules.name('产品id').required().number()
        };
    }
    /**
     * 添加产品分类验证
     *
     * @readonly
     * @memberof ProductCategory
     */
    get addValidate() {
        let that = this;
        return {
            title:that.rules.name('产品标题').required().min_length(2).max_length(255),
            category_id:that.rules.name('产品分类ID').required().number(),
            market_price:that.rules.name('市场价').required().number(),
            shop_price:that.rules.name('商城价').required().number(),
            content:that.rules.name('产品详情').required(),
            product_image:that.rules.name('产品图片').required(),
            sales_volume:that.rules.name('销量').default(0).number(),
            is_new:that.rules.name('是否新品').default(0).number(),
            is_best:that.rules.name('是否精品').default(0).number(),
            is_hot:that.rules.name('是否热销').default(0).number(),
            is_show:that.rules.name('是否显示').default(1).number(),
            stock_num:that.rules.name('库存').default(100).number(),
            create_time:that.rules.name('添加时间').default(szjcomo.time()).number()
        };
    }

    /**
     * 获取分类列表
     *
     * @returns
     * @memberof Product
     */
    async list() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.listValidate,await that.get());
            if(data.product_id > 0) return that.appJson(await that.info(data.product_id));
            let options = {limit:data.limit,offset:(data.page - 1) * data.limit,where:{},attributes:{
                include:[[Sequelize.col('category.category_name'),'category_name']]
            }};
            if(data.category_id > 0) options.where = {category_id:data.category_id};
            if(data.title.length > 0) options.where = Object.assign(options.where,{title:{
                [Sequelize.Op.like]:'%'+data.title+'%'
            }});
            options.include = {model:that.ctx.model.ProductCategory,attributes:[],as:'category'};
            options.order = [[data.order,data.sort?'desc':'asc']];
            if(data.is_new > -1 ) options.where.is_new = data.is_new;
            if(data.is_best > -1 ) options.where.is_best = data.is_best;
            if(data.is_show > -1 ) options.where.is_show = data.is_show;
            if(data.is_hot > -1 ) options.where.is_hot = data.is_hot;
            let result = await that.ctx.service.base.selectAndCount(options,that.ctx.model.Product,'产品列表');
            return that.appJson(result);
        } catch(err) {
            console.log(err);
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 获取分类详情
     *
     * @memberof Product
     */
    async info(product_id) {
        let that = this;
        try {
            let seq = Sequelize;
            let result = await that.ctx.service.base.select({
                where:{product_id:product_id},include:{
                    model:that.ctx.model.ProductExtend,
                    attributes:[],as:'extends'
                },attributes:{include:[[seq.col('extends.content'),'content'],[seq.col('extends.images'),'images'],[seq.col('extends.activity_time'),'activity_time']]}
            },that.ctx.model.Product,'产品详情',true);
            return result;
        } catch(err) {
            return that.appResult(err.message);
        }
    }

    /**
     * 添加产品分类
     *
     * @memberof ProductCategory
     */
    async add() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.addValidate,await that.post());
            if(data.images && data.images.length > 0) data.images = szjcomo.json_encode(data.images); 
            if(!data.product_sn) data.product_sn = szjcomo.date('YmdHis') + '' + szjcomo.mt_rand(1000,9999);
            data.admin_id = await that.ctx.service.base.getAdminUserId();
            let result = await that.addHandler(data);
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 添加产品处理器
     *
     * @param {*} data
     * @memberof Product
     */
    async addHandler(data) {
        let that = this;
        let transaction;
        try {
            let extend_data = {content:data.content,images:data.images?data.images:'',activity_time:data.activity_time?data.activity_time:0};
            if(data.activity_time) delete data.activity_time;
            if(data.images) delete data.images;
            delete data.content;
            transaction = await dbConfig.transaction();
            let addProduct = await that.ctx.model.Product.create(data,{transaction});
            if(addProduct) {
                extend_data.product_id = addProduct.product_id;
                let addExtend = await that.ctx.model.ProductExtend.create(extend_data,{transaction});
                if(addExtend) {
                    transaction.commit();
                    return that.appResult('产品添加成功',addProduct,false);
                } else {
                    transaction.rollback();
                    return that.appResult('产品添加失败,请联系管理员');
                }
            } else {
                transaction.rollback();
                return that.appResult('产品添加失败,请联系管理员');
            }
        } catch(err) {
            console.log(err);
            if(transaction) await transaction.rollback();
            return that.appResult(err.message);
        }
    }
    /**
     * 更新产品分类
     *
     * @memberof Product
     */
    async update() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            if(data.images && data.images.length > 0) data.images = szjcomo.json_encode(data.images);
            data.admin_id = await that.ctx.service.base.getAdminUserId();
            let result = await that.updateHandler(data);
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 更新产品
     *
     * @param {*} data
     * @memberof Product
     */
    async updateHandler(data) {
        let that = this;
        let transaction;
        try {
            let extend_data = {};
            if(data.activity_time) {
                extend_data.activity_time = data.activity_time;
                delete data.activity_time;
            }
            if(data.images) {
                extend_data.images = data.images;
                delete data.images;
            }
            if(data.content) {
                extend_data.content = data.content;
                delete data.content;
            }
            let product_id = data.product_id;
            delete data.product_id;
            transaction = await dbConfig.transaction();
            let updateProduct = await that.ctx.model.Product.update(data,{where:{product_id:product_id},fields:Object.keys(data)},{transaction});
            let updateExend = false;
            if(Object.keys(extend_data).length > 0) {
                updateExend = await that.ctx.model.ProductExtend.update(extend_data,{where:{product_id:product_id},fields:Object.keys(extend_data)});    
            } else {
                updateExend = true;
            }
            if(updateProduct && updateExend) {
                transaction.commit();
                return that.appResult('产品更新成功',null,false);
            } else {
                transaction.rollback();
                return that.appResult('产品更新失败,请联系管理员');
            }
        } catch(err) {
            if(transaction) await transaction.rollback();
            return that.appResult(err.message);
        }
    }

    /**
     * 删除产品
     *
     * @memberof ProductCategory
     */
    async delete() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            let result = await that.deleteHandler(data.product_id);
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 删除前检测是否可以删除
     *
     * @param {*} category_id
     * @memberof ProductCategory
     */
    async deleteHandler(product_id) {
        let that = this;
        let transaction;
        try {
            transaction = await dbConfig.transaction();
            let deleteProduct = await that.ctx.model.Product.destroy({where:{product_id:product_id}});
            let deleteExtend  = await that.ctx.model.ProductExtend.destroy({where:{product_id:product_id}});
            if(deleteProduct && deleteExtend) {
                transaction.commit();
                return that.appResult('产品删除成功',null,false);
            } else {
                transaction.rollback();
                return that.appResult('产品删除失败,请联系管理员');
            }
        } catch(err) {
            if(transaction) transaction.rollback();
            return that.appResult(err.message);
        }
    }

}


module.exports = Product;