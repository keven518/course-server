'use strict';

const Sequelize = require('sequelize');

/**
 * [exports 数据库/模型工具]
 * @type {Object}
 */
module.exports = {
	/**
	 * [getError 获取错误信息]
	 * @Author   szjcomo
	 * @DateTime 2019-10-05
	 * @param    {[type]}   err [description]
	 * @return   {[type]}       [description]
	 */
	getError(errObj){
		let result = 'unknown error';
		try{
			if(errObj.errors){
				let length = errObj.errors.length;
				for(let i = 0;i < length;i++){
					result = errObj.errors[i].message;
					break;
				}			
			} else {
				result = errObj.message;
			}
			return result;
		} catch(err){
			return err.message;
		}
	},
  	/**
  	 * [getValues 获取json数据而不是对象]
  	 * @Author   szjcomo
  	 * @DateTime 2019-10-06
  	 * @return   {[type]}   [description]
  	 */
  	getValues:function(data){
  		let tmp = [];
  		if(data instanceof Sequelize.Model){
  			return data.get({plain:true});
  		} else {
  			data.forEach(item => {
  				tmp.push(item.get({plain:true}));
  			})
  			return tmp;
  		}
  		return null;
  	},
	/**
	 * [htmlspecialchars_decode html反转义]
	 * @Author   szjcomo
	 * @DateTime 2019-10-04
	 * @param    {[type]}   str [description]
	 * @return   {[type]}       [description]
	 */
    htmlspecialchars_decode:function(str){           
		str = str.replace(/&amp;/g, '&');
		str = str.replace(/&lt;/g, '<');
		str = str.replace(/&gt;/g, '>');
		str = str.replace(/&quot;/g, "''");
		str = str.replace(/&#039;/g, "'");
		return str;
    },
};