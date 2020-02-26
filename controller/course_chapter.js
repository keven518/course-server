'use strict';

const baseController = require('./base');
const szjcomo        = require('@szjcomo/szjvuetools');


/**
 * 课程章节控制器
 */
class CourseChapter extends baseController {
    /**
     * 获取列表验证器
     *
     * @readonly
     * @memberof CourseChapter
     */
    get listValidate() {
        let that = this;
        return {
            limit:that.rules.default(30).number(),
            page:that.rules.default(1).number(),
            chapter_id:that.rules.name('章节ID').default(0).number(),
            sort:that.rules.default(0).number(),
            order:that.rules.default('chapter_id').required(),
            chapter_title:that.rules.default('').required(),
            course_id:that.rules.name('课程ID').number().min(1)
        };
    }
    /**
     * 课程章节主键验证
     *
     * @readonly
     * @memberof CourseChapter
     */
    get pkValidate() {
        let that = this;
        return {
            chapter_id:that.rules.name('章节ID').required().number().min(1)
        };
    }
    /**
     * 添加产品分类验证
     *
     * @readonly
     * @memberof CourseChapter
     */
    get addValidate() {
        let that = this;
        return {
            chapter_title:that.rules.name('章节名称').required().min_length(2).max_length(100),
            sort_order:that.rules.default(99).number(),
            chapter_desc:that.rules.name('章节描述').default('').required().max_length(255),
            course_id:that.rules.name('课程ID').required().number().min(1),
            chapter_type:that.rules.name('章节类型').default(0).required().number(5),
            create_time:that.rules.default(szjcomo.time()).required(),
            pid:that.rules.name('上级ID').default(0).number()
        };
    }

    /**
     * 获取课程列表
     *
     * @returns
     * @memberof CourseChapter
     */
    async list() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.listValidate,await that.get());
            if(data.chapter_id > 0) return that.appJson(await that.info(data.chapter_id));
            let options = {where:{course_id:data.course_id},raw:true};
            options.order = [[data.order,data.sort?'desc':'asc']];
            let result = await that.ctx.service.base.select(options,that.ctx.model.CourseChapter,'课程章节');
            if(result.error_status === false && result.data && result.data.length > 0) {
                let tmp = that.resultHandler(result.data);
                result.data = tmp;
            }
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 返回结果递归处理
     * @param {*} data 
     */
    resultHandler(data = []) {
        return szjcomo.recursion(data,0,'pid','chapter_id');
    }

    /**
     * 获取课程详情
     *
     * @memberof CourseChapter
     */
    async info(chapter_id) {
        let that = this;
        try {
            let result = await that.ctx.service.base.select({where:{chapter_id:chapter_id}},that.ctx.model.CourseChapter,'课程章节详情',true);
            return result;
        } catch(err) {
            return that.appResult(err.message);
        }
    }

    /**
     * 添加章节
     *
     * @memberof CourseChapter
     */
    async add() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.addValidate,await that.post());
            let result = await that.ctx.service.base.add(data,that.ctx.model.CourseChapter,'课程单节');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }

    /**
     * 更新章节
     *
     * @memberof CourseChapter
     */
    async update() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            let chapter_id = data.chapter_id;
            delete data.chapter_id;
            let result = await that.ctx.service.base.update(data,{where:{chapter_id:chapter_id},fiedls:Object.keys(data)},that.ctx.model.CourseChapter,'课程章节');
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 删除课程
     *
     * @memberof CourseChapter
     */
    async delete() {
        let that = this;
        try {
            let data = await that.ctx.validate(that.pkValidate,await that.param());
            let result = await that.deleteHandler(data.chapter_id);
            return that.appJson(result);
        } catch(err) {
            return that.appJson(that.appResult(err.message));
        }
    }
    /**
     * 删除前检测是否可以删除
     *
     * @param {*} chapter_id
     * @memberof CourseChapter
     */
    async deleteHandler(chapter_id) {
        let that = this;
        let childCount = await that.ctx.model.CourseChapter.count({where:{pid:chapter_id}});
        if(childCount > 0) return that.appResult('当前章节下还有子章节,无法删除');
        let result = await that.ctx.service.base.delete({where:{chapter_id:chapter_id}},that.ctx.model.CourseChapter,'课程章节');
        return result;
    }

}


module.exports = CourseChapter;