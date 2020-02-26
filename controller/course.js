'use strict';

const baseController = require('./base');
const szjcomo        = require('@szjcomo/szjvuetools');


/**
 * 课程控制器
 */
class Course extends baseController {
    /**
     * 获取列表验证器
     *
     * @readonly
     * @memberof Course
     */
    get listValidate() {
        let that = this;
        return {
            limit:that.rules.default(30).number(),
            page:that.rules.default(1).number(),
            course_id:that.rules.default(0).number(),
            sort:that.rules.default(0).number(),
            order:that.rules.default('course_id').required(),
            is_show:that.rules.default(1).number(),
            course_title:that.rules.default('').required()
        };
    }
    /**
     * 产品分类主键验证
     *
     * @readonly
     * @memberof Course
     */
    get pkValidate() {
        let that = this;
        return {
            course_id:that.rules.name('课程分类ID').required().number().min(1)
        };
    }
    /**
     * 添加产品分类验证
     *
     * @readonly
     * @memberof Course
     */
    get addValidate() {
        let that = this;
        return {
            course_title:that.rules.name('课程名称').required().min_length(2).max_length(100),
            sort_order:that.rules.default(99).number(),
            remark_title:that.rules.name('课程副标题').required().min_length(2).max_length(100),
            author_desc:that.rules.name('作者简介').required().min_length(2).max_length(100),
            author_image:that.rules.name('作者头像').required().min_length(5).max_length(255),
            course_trait:that.rules.name('课程特点').required(),
            tearch_desc:that.rules.name('老师介绍').required(),
            is_show:that.rules.default(1).number(),
            study_nums:that.rules.default(100).number(),
            course_score:that.rules.default(9.5).number(),
            course_price:that.rules.default(0).number(),
            grade:that.rules.default(0).number(),
            create_time:that.rules.default(szjcomo.time()).required()
        };
    }

    /**
     * 获取课程列表
     *
     * @returns
     * @memberof Course
     */
    async list() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.listValidate,await that.get());
            if(data.course_id > 0) return that.appJson(await that.info(data.course_id));
            let options = {limit:data.limit,offset:(data.page - 1) * data.limit,where:{}};
            if(data.is_show > -1) options.where.is_show = data.is_show;
            if(data.course_title.length > 0) options.where.course_title = {[that.ctx.app.Sequelize.Op.like]:'%'+data.course_title+'%'};
            options.order = [[data.order,data.sort?'desc':'asc']];
            options.attributes = {exclude:['course_images','tearch_desc','course_trait']};
            let result = await that.ctx.service.base.selectAndCount(options,that.ctx.model.Course,'课程列表');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 获取课程详情
     *
     * @memberof Course
     */
    async info(course_id) {
        let that = this;
        try {
            let result = await that.ctx.service.base.select({where:{course_id:course_id}},that.ctx.model.Course,'课程详情',true);
            return result;
        } catch(err) {
            return that.appResult(err.message);
        }
    }

    /**
     * 添加课程
     *
     * @memberof Course
     */
    async add() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.addValidate,await that.post());
            if(data.course_images && data.course_images.length > 0) {
                data.course_images = szjcomo.json_encode(data.course_images);
            }
            let result = await that.ctx.service.base.add(data,that.ctx.model.Course,'课程');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }

    /**
     * 更新课程
     *
     * @memberof Course
     */
    async update() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            let course_id = data.course_id;
            delete data.course_id;
            if(data.course_images && data.course_images.length > 0) {
                data.course_images = szjcomo.json_encode(data.course_images);
            }
            let result = await that.ctx.service.base.update(data,{where:{course_id:course_id},fields:Object.keys(data)},that.ctx.model.Course,'课程');
            return that.appJson(result);
        } catch(err) {
            console.log(err);
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 删除课程
     *
     * @memberof Cours
     */
    async delete() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            let result = await that.deleteHandler(data.course_id);
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 删除前检测是否可以删除
     *
     * @param {*} course_id
     * @memberof Course
     */
    async deleteHandler(course_id) {
        let that = this;
        let courseCount = await that.ctx.model.CourseChapter.count({where:{course_id:course_id}});
        if(courseCount > 0) return that.appResult('当前课程下还有视频或文章,无法删除');
        let result = await that.ctx.service.base.delete({where:{course_id:course_id}},that.ctx.model.Course,'课程');
        return result;
    }
}


module.exports = Course;