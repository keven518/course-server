'use strict';

const baseController = require('./base');
const szjcomo        = require('@szjcomo/szjvuetools');


/**
 * 产品分类控制器
 */
class ProductCategory extends baseController {
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
            category_id:that.rules.default(0).number(),
            sort:that.rules.default(0).number(),
            order:that.rules.default('category_id').required(),
            is_show:that.rules.default(1).number(),
            is_home:that.rules.default(-1).number()
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
            category_id:that.rules.name('产品分类ID').required().number()
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
            category_name:that.rules.name('产品分类名称').required().min_length(2).max_length(20),
            sort_order:that.rules.default(99).number(),
            pid:that.rules.default(0).number(),
            level:that.rules.default(1).number(),
            is_show:that.rules.default(1).number(),
            create_time:that.rules.default(szjcomo.time()).required()
        };
    }

    /**
     * 获取分类列表
     *
     * @returns
     * @memberof ProductCategory
     */
    async list() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.listValidate,await that.get());
            if(data.category_id > 0) return that.appJson(await that.info(data.category_id));
            let category_name = await that.get('category_name','');
            let options = {limit:data.limit,offset:(data.page - 1) * data.limit,where:{level:1}};
            if(!szjcomo.empty(category_name)) options.where = {
                category_name:{[that.ctx.app.Sequelize.Op.like]:'%'+category_name+'%'}
            };
            if(data.is_show > -1) options.where.is_show = data.is_show;
            if(data.is_home > -1) options.where.is_home = data.is_home;
            options.order = [[data.order,data.sort?'desc':'asc']];
            let result = await that.ctx.service.base.selectAndCount(options,that.ctx.model.ProductCategory,'产品分类');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 获取分类详情
     *
     * @memberof ProductCategory
     */
    async info(category_id) {
        let that = this;
        try {
            let result = await that.ctx.service.base.select({where:{category_id:category_id}},that.ctx.model.ProductCategory,'产品分类',true);
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
            data.level = await that.getLevel(data.pid);
            data.admin_id = await that.ctx.service.base.getAdminUserId();
            let result = await that.ctx.service.base.add(data,that.ctx.model.ProductCategory,'产品分类');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }

    /**
     * 获取分类等级
     *
     * @param {number} [pid=0]
     * @memberof ProductCategoryService
     */
    async getLevel(pid = 0) {
        let that = this;
        if(pid == 0) return 1;
        let result = await that.ctx.model.ProductCategory.findOne({where:{category_id:pid},attributes:['level']});
        return result.level + 1;
    }

    /**
     * 更新产品分类
     *
     * @memberof ProductCategory
     */
    async update() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            data.admin_id = await that.ctx.service.base.getAdminUserId();
            if(data.pid) data.level = await that.ctx.service.productCategory.getLevel(intval(data.pid));
            let options = {where:{category_id:data.category_id}};
            delete data.category_id;
            options.fields = Object.keys(data);
            let result = await that.ctx.service.base.update(data,options,that.ctx.model.ProductCategory,'产品分类');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 删除产品分类
     *
     * @memberof ProductCategory
     */
    async delete() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            let result = await that.deleteHandler(data.category_id);
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
    async deleteHandler(category_id) {
        let that = this;
        let childCount = await that.ctx.model.ProductCategory.count({where:{pid:category_id}});
        if(childCount > 0) return that.appResult('当前分类下还在子分类,无法删除');
        let productCount = await that.ctx.model.Product.count({where:{category_id:category_id}});
        if(productCount > 0) return that.appResult('当前分类下还有产品,无法删除');
        let result = await that.ctx.service.base.delete({where:{category_id:category_id}},that.ctx.model.ProductCategory,'产品分类');
        return result;
    }

}


module.exports = ProductCategory;