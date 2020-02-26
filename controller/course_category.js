'use strict';

const baseController = require('./base');
const szjcomo        = require('@szjcomo/szjvuetools');


/**
 * 课程分类控制器
 */
class CourseCategory extends baseController {
    /**
     * 获取列表验证器
     *
     * @readonly
     * @memberof CourseCategory
     */
    get listValidate() {
        let that = this;
        return {
            limit:that.rules.default(30).number(),
            page:that.rules.default(1).number(),
            category_id:that.rules.default(0).number(),
            sort:that.rules.default(0).number(),
            order:that.rules.default('category_id').required(),
            is_show:that.rules.default(1).number()
        };
    }
    /**
     * 产品分类主键验证
     *
     * @readonly
     * @memberof CourseCategory
     */
    get pkValidate() {
        let that = this;
        return {
            category_id:that.rules.name('课程分类ID').required().number().min(1)
        };
    }
    /**
     * 添加产品分类验证
     *
     * @readonly
     * @memberof CourseCategory
     */
    get addValidate() {
        let that = this;
        return {
            category_name:that.rules.name('课程分类名称').required().min_length(2).max_length(20),
            sort_order:that.rules.default(99).number(),
            pid:that.rules.default(0).number(),
            category_level:that.rules.default(1).number(),
            is_show:that.rules.default(1).number(),
            grade:that.rules.default(0).number(),
            create_time:that.rules.default(szjcomo.time()).required()
        };
    }

    /**
     * 获取分类列表
     *
     * @returns
     * @memberof CourseCategory
     */
    async list() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.listValidate,await that.get());
            if(data.category_id > 0) return that.appJson(await that.info(data.category_id));
            let options = {limit:data.limit,offset:(data.page - 1) * data.limit,where:{}};
            if(data.is_show > -1) options.where = Object.assign(options.where,{is_show:data.is_show});
            options.order = [[data.order,data.sort?'desc':'asc']];
            let result = await that.ctx.service.base.selectAndCount(options,that.ctx.model.CourseCategory,'课程分类列表');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 获取分类详情
     *
     * @memberof CourseCategory
     */
    async info(category_id) {
        let that = this;
        try {
            let result = await that.ctx.service.base.select({where:{category_id:category_id}},that.ctx.model.CourseCategory,'课程分类',true);
            return result;
        } catch(err) {
            return that.appResult(err.message);
        }
    }

    /**
     * 添加课程分类
     *
     * @memberof CourseCategory
     */
    async add() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.addValidate,await that.post());
            data.admin_id = await that.ctx.service.base.getAdminUserId();
            data.category_level = await that.getLevel(data.pid);
            let result = await that.ctx.service.base.add(data,that.ctx.model.CourseCategory,'课程分类');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }

    /**
     * 获取分类等级
     *
     * @param {number} [pid=0]
     * @memberof CourseCategory
     */
    async getLevel(pid = 0) {
        let that = this;
        if(pid == 0) return 1;
        let result = await that.ctx.model.CourseCategory.findOne({where:{category_id:pid},attributes:['category_level']});
        return result.level + 1;
    }

    /**
     * 更新产品分类
     *
     * @memberof CourseCategory
     */
    async update() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            let category_id = data.category_id;
            delete data.category_id;
            let result = await that.ctx.service.base.update(data,{where:{category_id:category_id},fields:Object.keys(data)},that.ctx.model.CourseCategory,'课程分类');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 删除课程分类
     *
     * @memberof CourseCategory
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
     * @memberof CourseCategory
     */
    async deleteHandler(category_id) {
        let that = this;
        let childCount = await that.ctx.model.CourseCategory.count({where:{pid:category_id}});
        if(childCount > 0) return that.appResult('当前分类下还有子分类,无法删除');
        let result = await that.ctx.service.base.delete({where:{category_id:category_id}},that.ctx.model.CourseCategory,'课程分类');
        return result;
    }

}


module.exports = CourseCategory;