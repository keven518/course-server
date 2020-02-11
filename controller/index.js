'use strict';

const Base      = require('./base');
const AdminUser = require('../models/admin_user');

/** 
 * 首页控制器 
 */
module.exports = class Index extends Base {

    /**
     * 主键验证
     *
     * @readonly
     * @static
     */
    get pkValidate() {
        let that = this;
        return {
            id:that.rule.name('管理员ID').required().number()
        };
    }
    /**
     * 添加管理员验证
     *
     * @readonly
     */
    get addValidate() {
        let that = this;
        return {
            username:that.rule.name('管理员名称').required().min_length(2).max_length(20),
            password:that.rule.name('管理员密码').required().min_length(6).max_length(20),
            role_id:that.rule.name('角色ID').default(1).required().number()
        };
    }

    //获取管理员列表
    async getUserList() {
        let that = this;
        try {
            let data = await AdminUser.findAll();
            return that.Json(that.appResult('管理员列表获取成功',data,false));
        } catch(err) {
            return that.Json(that.appResult(err.message));
        }
    }
    //获取管理员详情
    async getUserInfo() {
        let that = this;
        try {
            let data =  await that.validator(that.pkValidate,await that.get());
            let info = await AdminUser.findOne({where:{id:data.id}});
            if(info) return that.Json(that.appResult('管理员信息获取成功',info,false));
            return that.Json(that.appResult('未获取到管理员信息'));
        } catch(err) {
            return that.Json(that.appResult(err.message));
        }
    }
    //添加管理员
    async addUser() {
        let that = this;
        try {
            let data = await that.validator(that.addValidate,await that.post());
            data.create_time = '2020-02-11 15:10:10';
            let insert = await AdminUser.create(data);
            if(insert) return that.Json(that.appResult('数据插入成功',insert,false));
            return that.Json(that.appResult('数据插入失败,请联系管理员'));
        } catch(err) {
            return that.Json(that.appResult(err.message));
        }
    }
    //更新管理员
    async updateUser() {
        let that = this;
        try {
            let data = await that.validator(that.pkValidate,await that.post());
            let where = {id:data.id};
            delete data.id;
            let update = await AdminUser.update(data,{where:where,fields:Object.keys(data)});
            if(update) return that.Json(that.appResult('数据更新成功',update,false));
            return that.Json(that.appResult('数据更新失败,请联系管理员'));
        } catch(err) {
            return that.Json(that.appResult(err.message));
        }
    }
    //删除管理员
    async deleteUser() {
        let that = this;
        try {
            let data = await that.validator(that.pkValidate,await that.get());
            let res = await AdminUser.destroy({where:{id:data.id}});
            if(res) return that.Json(that.appResult('管理员删除成功',res,false));
            return that.Json(that.appResult('管理员删除失败'));
        } catch(err) {
            return that.Json(that.appResult(err.message));
        }
    }

}