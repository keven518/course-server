'use strict';

const szjcomo   = require('@szjcomo/szjvuetools');
const dbConfig  = require('../config/db');
const Sequelize = require('sequelize');

const model = dbConfig.define('ProductCategory',{
	category_id:{
		type:Sequelize.INTEGER.UNSIGNED,
		primaryKey: true, 
		autoIncrement: true,
		comment:'产品分类ID'
	},
	category_name:{
		type:Sequelize.STRING(50),
		comment:'分类名称'
	},
	category_desc:{
		type:Sequelize.STRING(255),
		comment:'分类描述'
	},
	category_image:{
		type:Sequelize.STRING(255),
		comment:'分类图片'
	},
	pid:{
		type:Sequelize.INTEGER(5).UNSIGNED,
		comment:'父级ID'
	},
	sort_order:{
		type:Sequelize.INTEGER(3).UNSIGNED,
		comment:'排序'
	},
	is_show:{
		type:Sequelize.INTEGER(1).UNSIGNED,
		comment:'是否显示'
	},
	is_home:{
		type:Sequelize.INTEGER(1).UNSIGNED,
		comment:'是否首页展示'
	},
	level:{
		type:Sequelize.INTEGER(1).UNSIGNED,
		comment:'分类级别'
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
	tableName:'szj_product_category', 
	timestamps: false
})
//同步:没有就新建,有就不变
model.sync();

module.exports = model;