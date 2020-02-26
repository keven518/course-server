'use strict';

const szjcomo   = require('@szjcomo/szjvuetools');
const dbConfig  = require('../config/db');
const Sequelize = require('sequelize');

/**
 * [model 定义课程分类模型]
 * @type {[type]}
 */
const model = dbConfig.define('CollectAddress',{
	collect_id:{
		type:Sequelize.INTEGER.UNSIGNED,
		primaryKey: true, 
		autoIncrement: true,
		comment:'自增ID'
	},
	province_id:{
		type:Sequelize.INTEGER.UNSIGNED,
		comment:'省ID'
	},
	city_id:{
		type:Sequelize.INTEGER.UNSIGNED,
		comment:'市ID'
	},
	county_id:{
		type:Sequelize.INTEGER.UNSIGNED,
		comment:'县/区ID'
	},
	address:{
		type:Sequelize.STRING(255),
		comment:'详情地址'
	},
	user_id:{
		type:Sequelize.INTEGER.UNSIGNED,
		comment:'用户ID'
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
	tableName:'szj_collect_address', 
	timestamps: false
})
//同步:没有就新建,有就不变
model.sync();
module.exports = model;

