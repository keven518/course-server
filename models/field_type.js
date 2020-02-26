'use strict';

const dbConfig  = require('../config/db');
const Sequelize = require('sequelize');


const model = dbConfig.define('FieldType',{
	name:{
		type:Sequelize.STRING(32),
		primaryKey: true, 
		comment:'字段类型'
	},
	title:{
		type:Sequelize.STRING(64),
		comment:'字段名称'
	},
	sort:{
		type:Sequelize.INTEGER(5),
		comment:'字段排序'
	},
	is_option:{
		type:Sequelize.INTEGER(1),
		comment:'是否需要设置选项'
	},
	is_string:{
		type:Sequelize.INTEGER(1),
		comment:'是否可以自由设置值'
	},
	rules:{
		type:Sequelize.STRING(255),
		comment:'验证规则',
	}
},{
	freezeTableName: true,
	tableName:'szj_field_type', 
	timestamps: false
})

//同步:没有就新建,有就不变
model.sync();
module.exports = model;
