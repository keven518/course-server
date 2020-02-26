'use strict';

const szjcomo 	= require('@szjcomo/szjvuetools');
const dbConfig  = require('../config/db');
const Sequelize = require('sequelize');

const model = dbConfig.define('CourseChapter',{
    chapter_id:{
        type:Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment:'主键ID'
    },
    chapter_title:{
        type:Sequelize.STRING(50),
        comment:'章节标题'
    },
    pid:{
        type:Sequelize.INTEGER.UNSIGNED,
        comment:'上级ID'
    },
    chapter_desc:{
        type:Sequelize.STRING,
        comment:'章节描述'
    },
    course_id:{
        type:Sequelize.INTEGER.UNSIGNED,
        comment:'课程ID'
    },
    vedio_url:{
        type:Sequelize.STRING(255),
        comment:'视频地址'
    },
    vedio_duration:{
        type:Sequelize.STRING(20),
        comment:'视频时长'
    },
    chapter_type:{
        type:Sequelize.INTEGER(1).UNSIGNED,
        comment:'章节类型 0视频 1文章'
    },
    chapter_content:{
        type:Sequelize.TEXT,
        comment:'单节内容'
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
    tableName:'szj_course_chapter', 
    timestamps: false
})
//同步:没有就新建,有就不变
model.sync();
module.exports = model;
