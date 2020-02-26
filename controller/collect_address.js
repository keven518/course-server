'use strict';

const baseController = require('./base');
const szjcomo        = require('@szjcomo/szjvuetools');


/**
 * 收货地址
 */
class CollectAddress extends baseController {

    /**
     * 获取列表验证器
     *
     * @readonly
     * @memberof CollectAddress
     */
    get listValidate() {
        let that = this;
        return {
            limit:that.rules.default(30).number(),
            page:that.rules.default(1).number(),
            collect_id:that.rules.default(0).number()
        };
    }
    /**
     * 收货地址主键验证
     *
     * @readonly
     * @memberof CollectAddress
     */
    get pkValidate() {
        let that = this;
        return {
            collect_id:that.rules.name('地址ID').required().number().min(1)
        };
    }
    /**
     * 添加收货地址验证
     *
     * @readonly
     * @memberof CollectAddress
     */
    get addValidate() {
        let that = this;
        return {
            province_id:that.rules.name('所在省').required().number(),
            city_id:that.rules.name('所在市').required().number(),
            county_id:that.rules.name('所在县/区').required().number(),
            address:that.rules.name('详细地址').required().min_length(2).max_length(255),
            user_id:that.rules.name('用户ID').required().number(),
            create_time:that.rules.default(szjcomo.time()).required()
        };
    }

    /**
     * 获取课程列表
     *
     * @returns
     * @memberof CollectAddress
     */
    async list() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.listValidate,await that.get());
            if(data.collect_id > 0) return that.appJson(await that.info(data.collect_id));
            let options = {limit:data.limit,offset:(data.page - 1) * data.limit,where:{}};
            let result = await that.ctx.service.base.selectAndCount(options,that.ctx.model.CollectAddress,'用户地址列表');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 获取地址详情
     *
     * @memberof CollectAddress
     */
    async info(collect_id) {
        let that = this;
        try {
            let result = await that.ctx.service.base.select({where:{collect_id:collect_id}},that.ctx.model.CollectAddress,'用户地址详情',true);
            return result;
        } catch(err) {
            return that.appResult(err.message);
        }
    }

    /**
     * 添加用户地址
     *
     * @memberof CollectAddress
     */
    async add() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.addValidate,await that.post());
            let result = await that.ctx.service.base.add(data,that.ctx.model.CollectAddress,'用户地址');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }

    /**
     * 更新用户地址
     *
     * @memberof CollectAddress
     */
    async update() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            let collect_id = data.collect_id;
            delete data.collect_id;
            let result = await that.ctx.service.base.update(data,{where:{collect_id:collect_id},fields:Object.keys(data)},that.ctx.model.CollectAddress,'用户地址');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 删除课程
     *
     * @memberof CollectAddress
     */
    async delete() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            let result = await that.deleteHandler(data.collect_id);
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 删除前检测是否可以删除
     *
     * @param {*} collect_id
     * @memberof CollectAddress
     */
    async deleteHandler(collect_id) {
        let that = this;
        let result = await that.ctx.service.base.delete({where:{collect_id:collect_id}},that.ctx.model.CollectAddress,'用户地址');
        return result;
    }
}


module.exports = CollectAddress;