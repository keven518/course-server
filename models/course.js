'use strict';

const szjcomo 	= require('@szjcomo/szjvuetools');
const dbConfig  = require('../config/db');
const Sequelize = require('sequelize');
const CourseCategory = require('./course_category');

const model = dbConfig.define('Course',{
    course_id:{
        type:Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment:'主键ID'
    },
    course_title:{
        type:Sequelize.STRING(50),
        comment:'课程名称'
    },
    remark_title:{
        type:Sequelize.STRING(20),
        comment:'副标题'
    },
    is_show:{
        type:Sequelize.INTEGER(1).UNSIGNED,
        comment:'是否显示'
    },
    study_nums:{
        type:Sequelize.INTEGER.UNSIGNED,
        comment:'学习人数'
    },
    course_score:{
        type:Sequelize.FLOAT,
        comment:'课程得分'
    },
    author_desc:{
        type:Sequelize.STRING(100),
        comment:'作者简介'
    },
    author_image:{
        type:Sequelize.STRING(255),
        comment:'作者头像'
    },
    course_price:{
        type:Sequelize.FLOAT,
        comment:'课程价格'
    },
    activity_price:{
        type:Sequelize.FLOAT,
        comment:'活动价格'
    },
    grade:{
        type:Sequelize.INTEGER(1).UNSIGNED,
        comment:'难易程度'
    },
    tearch_desc:{
        type:Sequelize.TEXT,
        comment:'老师介绍'
    },
    course_trait:{
        type:Sequelize.TEXT,
        comment:'课程特点'
    },
    course_images:{
        type:Sequelize.TEXT,
        comment:'课程轮播图',
        get() {
            let value = this.getDataValue('course_images');
            if(value && value.length > 0) {
                return szjcomo.json_decode(value);
            } else {
                return value;
            }
        }
    },
    sort_order:{
        type:Sequelize.INTEGER(5).UNSIGNED,
        comment:'字段排序'
    },
    update_time:{
        type:Sequelize.DATE,
        comment:'更新时间'
    },
    create_time:{
        type:Sequelize.DATE,
        comment:'创建时间',
        set(val){
            if(szjcomo.isNum(val)){
                this.setDataValue('create_time',szjcomo.date('Y-m-d H:i:s',val));
            } else {
                this.setDataValue('create_time',val);
            }
        }
    }
},{
    freezeTableName: true,
    tableName:'szj_course', 
    timestamps: false
})

//同步:没有就新建,有就不变
model.sync();
model.belongsTo(CourseCategory,{foreignKey:'category_id',targetKey:'category_id',as:'category'});
module.exports = model;