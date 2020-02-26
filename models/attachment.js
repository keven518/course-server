'use strict';

const dbConfig = require('../config/db');
const Sequelize = require('sequelize');

const model = dbConfig.define('Attachment',{
	attach_id:{
		type:Sequelize.INTEGER.UNSIGNED,
		primaryKey: true, 
		autoIncrement: true,
		comment:'自增ID'
	},
	attach_url:{
		type:Sequelize.STRING(255),
		comment:'附件地址'
	},
	attach_type:{
		type:Sequelize.STRING(30),
		comment:'附件类型'
	},
	attach_hash:{
		type:Sequelize.STRING(100),
		comment:'附件的hash值'
	},
	driver:{
		type:Sequelize.STRING(10),
		comment:'上传驱动'
	},
	attach_status:{
		type:Sequelize.INTEGER(1),
		comment:'附件状态'
	},
	attach_sort:{
		type:Sequelize.INTEGER(3),
		comment:'排序'
	},
	attach_size:{
		type:Sequelize.INTEGER(10),
		comment:'附件大小'
	},
	attach_group:{
		type:Sequelize.STRING(30),
		comment:'附件分组'
	},
	extends_id:{
		type:Sequelize.STRING(100),
		comment:'扩展ID'
	},
	extends_url:{
		type:Sequelize.STRING(255),
		comment:'扩展地址'
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
			} else {
				this.setDataValue('create_time',val);
			}
		}
	}
},{
	//是否使用自定义表名,如何为false 那么就同模型名一致
	freezeTableName: true,
	//自定义表名
	tableName:'szj_attachment', 
	//添加create,update,delete时间戳
	timestamps: false
})

//同步:没有就新建,有就不变
model.sync();

module.exports = model;
