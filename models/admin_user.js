'use strict';


const sequelize = require('../config/db');
const Sequelize = require('sequelize');

const AdminUser = sequelize.define('AdminUser',{
    id: { 
        type: Sequelize.INTEGER.UNSIGNED, 
        primaryKey: true, 
        autoIncrement: true,
        comment:'管理员id'
    },
    username: {
        type:Sequelize.STRING(40),
        comment:'管理员姓名',
        unique:{
            msg:'管理员名称已经存在,不能重复添加'
        }
    },
    password: {
        type:Sequelize.STRING(40),
        comment:'管理员密码'
    },
    role_id: {
        type:Sequelize.INTEGER(3).UNSIGNED,
        comment:'管理员角色',
    },
    status:{
        type:Sequelize.INTEGER(1),
        comment:'管理员状态'
    },
    login_count:{
        type:Sequelize.INTEGER(6).UNSIGNED,
        comment:'管理员登录次数'
    },
    user_token:{
        type:Sequelize.STRING(100),
        comment:'管理员token值'
    },
    login_time:{
        type:Sequelize.DATE,
        comment:'管理员登录时间'
    },
    admin_id:{
        type:Sequelize.INTEGER(6).UNSIGNED,
        comment:'添加管理员id'
    },
    update_time:{
        type:Sequelize.DATE,
        comment:'更新管理员时间'
    },
    create_time:{
        type:Sequelize.DATE,
        comment:'创建管理员时间'
    }
},{
    freezeTableName: true,
    tableName:'szj_admin_user', 
    timestamps: false,
});
AdminUser.sync();
module.exports = AdminUser;