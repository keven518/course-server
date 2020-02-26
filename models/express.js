'use strict';

const szjcomo 	= require('@szjcomo/szjvuetools');
const dbConfig  = require('../config/db');
const Sequelize = require('sequelize');

const model = dbConfig.define('Express',{
	express_id:{
		type:Sequelize.INTEGER.UNSIGNED,
		primaryKey: true,
		autoIncrement: true,
		comment:'主键ID'
	},
	express_name:{
		type:Sequelize.STRING(50),
		comment:'快递名称'
	},
	sort_order:{
		type:Sequelize.INTEGER(5),
		comment:'字段排序'
	},
	express_sign:{
		type:Sequelize.STRING(20),
		comment:'快递代码'
	},
	admin_id:{
		type:Sequelize.INTEGER(6).UNSIGNED,
		comment:'添加管理员id'
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
	tableName:'szj_express', 
	timestamps: false
})

//同步:没有就新建,有就不变
model.sync();
module.exports = model;
