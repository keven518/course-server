'use strict';

const dbConfig  		= require('../config/db');
const Sequelize	 		= require('sequelize');
const ProductCategory 	= require('./product_category');
const ProductExtend   	= require('./product_extend');
const szjcomo 			= require('@szjcomo/szjvuetools');


const model = dbConfig.define('Product',{
	product_id:{
		type:Sequelize.INTEGER.UNSIGNED,
		primaryKey: true, 
		autoIncrement: true,
		comment:'产品ID'
	},
	category_id:{
		type:Sequelize.INTEGER.UNSIGNED,
		comment:'分类ID',
	},
	title:{
		type:Sequelize.STRING(255),
		comment:'产品标题'
	},
	remark_title:{
		type:Sequelize.STRING(255),
		comment:'产品副标题'
	},
	product_desc:{
		type:Sequelize.STRING(255),
		comment:'产品描述',
	},
	product_image:{
		type:Sequelize.STRING(255),
		comment:'产品图片',
	},
	market_price:{
		type:Sequelize.FLOAT(10,2).UNSIGNED,
		comment:'市场价'
	},
	shop_price:{
		type:Sequelize.FLOAT(10,2).UNSIGNED,
		comment:'商店价'
	},
	sales_volume:{
		type:Sequelize.INTEGER.UNSIGNED,
		comment:'销量'
	},
	stock_num:{
		type:Sequelize.INTEGER.UNSIGNED,
		comment:'库存'
	},
	product_sn:{
		type:Sequelize.STRING(30),
		comment:'产品编号'
	},
	is_show:{
		type:Sequelize.INTEGER(1).UNSIGNED,
		comment:'是否显示'
	},
	is_new:{
		type:Sequelize.INTEGER(1).UNSIGNED,
		comment:'是否新品'
	},
	is_best:{
		type:Sequelize.INTEGER(1).UNSIGNED,
		comment:'是否精品'
	},
	is_hot:{
		type:Sequelize.INTEGER(1).UNSIGNED,
		comment:'是否热销'
	},
	sort_order:{
		type:Sequelize.INTEGER(5),
		comment:'字段排序'
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
	tableName:'szj_product', 
	timestamps: false
})
//同步:没有就新建,有就不变
model.sync();
model.belongsTo(ProductCategory,{foreignKey:'category_id',targetKey:'category_id',as:'category'});
model.belongsTo(ProductExtend,{foreignKey:'product_id',targetKey:'product_id',as:'extends'});
module.exports = model;