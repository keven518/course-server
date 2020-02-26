'use strict';

const dbConfig  = require('../config/db');
const Sequelize = require('sequelize');

const model = dbConfig.define('ProductExtend',{
	product_id:{
		type:Sequelize.INTEGER.UNSIGNED,
		primaryKey: true,
		comment:'产品ID'
	},
	content:{
		type:Sequelize.TEXT,
		comment:'产品详情'
	},
	images:{
		type:Sequelize.TEXT,
		comment:'产品轮播图'
	},
	activity_time:{
		type:Sequelize.INTEGER.UNSIGNED,
		comment:'活动时间'
	}
},{
	freezeTableName: true,
	tableName:'szj_product_extend', 
	timestamps: false
})
//同步:没有就新建,有就不变
model.sync();
module.exports = model;