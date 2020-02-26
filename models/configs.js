'use strict';

const szjcomo 	= require('@szjcomo/szjvuetools');
const dbConfig  = require('../config/db');
const Sequelize = require('sequelize');
const FieldType = require('./field_type');

/**
 * [model 定义配置模型]
 * @type {[type]}
 */
const model = dbConfig.define('Configs',{
	config_id:{
		type:Sequelize.INTEGER,
		primaryKey:true,
		autoIncrement: true,
		comment:'自增ID'
	},
	config_name:{
		type:Sequelize.STRING(30),
		comment:'配置索引名称'
	},
	config_title:{
		type:Sequelize.STRING(100),
		comment:'显示名称'
	},
	config_type:{
		type:Sequelize.STRING(32),
		comment:'配置类型'
	},
	config_group:{
		type:Sequelize.STRING(30),
		comment:'分组名称'
	},
	config_options:{
		type:Sequelize.STRING(255),
		comment:'选项值'
	},
	remark:{
		type:Sequelize.STRING(255),
		comment:'备注说明'
	},
	config_status:{
		type:Sequelize.INTEGER(1),
		comment:'配置状态'
	},
	config_value:{
		type:Sequelize.STRING(255),
		comment:'配置值'
	},
	config_sort:{
		type:Sequelize.INTEGER(5),
		comment:'配置项排序'
	},
	admin_id:{
		type:Sequelize.INTEGER(5),
		comment:'添加人员ID'
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
			}
		}
	}
},{
	freezeTableName: true,
	tableName:'szj_config', 
	timestamps: false
})

model.belongsTo(FieldType,{foreignKey:'config_type',targetKey:'name',as:'field_type'});

//同步:没有就新建,有就不变
model.sync();
module.exports = model;
