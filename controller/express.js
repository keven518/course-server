'use strict';

const baseController = require('./base');
const szjcomo        = require('@szjcomo/szjvuetools');


/**
 * 快递控制器
 */
class Express extends baseController {
    /**
     * 获取列表验证器
     *
     * @readonly
     * @memberof Express
     */
    get listValidate() {
        let that = this;
        return {
            limit:that.rules.default(30).number(),
            page:that.rules.default(1).number(),
            express_name:that.rules.default('').required(),
            sort:that.rules.default(0).number(),
            order:that.rules.default('express_id').required()
        };
    }
    /**
     * 快递主键验证
     *
     * @readonly
     * @memberof Express
     */
    get pkValidate() {
        let that = this;
        return {
            express_id:that.rules.name('快递ID').required().number()
        };
    }
    /**
     * 添加快递验证
     *
     * @readonly
     * @memberof Express
     */
    get addValidate() {
        let that = this;
        return {
            express_name:that.rules.name('快递名称').required().min_length(2).max_length(50),
            express_sign:that.rules.name('快递代码').required().min_length(2).max_length(20),
            sort_order:that.rules.name('快递排序').default(99).number(),
            create_time:that.rules.default(szjcomo.time()).number()
        };
    }

    /**
     * 获取快递列表
     *
     * @returns
     * @memberof Express
     */
    async list() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.listValidate,await that.get());
            if(data.express_id > 0) return that.appJson(await that.info(data.express_id));
            let options = {limit:data.limit,offset:(data.page - 1) * data.limit,where:{},order:[[data.order,data.sort?'desc':'asc']]};
            if(data.express_name.length > 0) {
                options.where = {express_name:{[that.ctx.app.Sequelize.Op.like]:"%"+data.express_name+"%"}};
            }
            let result = await that.ctx.service.base.selectAndCount(options,that.ctx.model.Express,'快递列表');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 获取快递详情
     *
     * @memberof Express
     */
    async info(express_id) {
        let that = this;
        try {
            let result = await that.ctx.service.base.select({where:{express_id:express_id}},that.ctx.model.Express,'快递详情',true);
            return result;
        } catch(err) {
            return that.appResult(err.message);
        }
    }

    /**
     * 添加快递
     *
     * @memberof Express
     */
    async add() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.addValidate,await that.post());
            let result = await that.ctx.service.base.add(data,that.ctx.model.Express,'快递信息');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }

    /**
     * 更新快递
     *
     * @memberof Express
     */
    async update() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            let express_id = data.express_id;
            delete data.express_id;
            let result = await that.ctx.service.base.update(data,{where:{express_id:express_id},fields:Object.keys(data)},that.ctx.model.Express,'快递信息');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 删除快递
     *
     * @memberof Express
     */
    async delete() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            let result = await that.deleteHandler(data.express_id);
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 删除前检测是否可以删除
     *
     * @param {*} express_id
     * @memberof Express
     */
    async deleteHandler(express_id) {
        let that = this;
        let result = await that.ctx.service.base.delete({where:{express_id:express_id}},that.ctx.model.Express,'快递');
        return result;
    }

}


module.exports = Express;