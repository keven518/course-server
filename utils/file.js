'use strict';

const fs 		= require('fs');
const path 		= require('path');
const szjcomo	= require('@szjcomo/szjvuetools');

/**
 * [exports 文件操作工具]
 * @type {Object}
 */
module.exports = {
	/**
	 * [create_dir 创建文件夹]
	 * @Author   szjcomo
	 * @DateTime 2019-10-05
	 * @param    {[type]}   dirname [description]
	 * @return   {[type]}           [description]
	 */
  	create_dir:function(dirname) {
  		let that = this;
	    if (fs.existsSync(dirname)) {
	      	return true;
	    } else {
			if (that.create_dir(path.dirname(dirname))) {
				fs.mkdirSync(dirname);
				return true;
			}
	    }
  	},
  	/**
  	 * [delete_file 删除文件]
  	 * @author 	   szjcomo
  	 * @createTime 2019-11-04
  	 * @param      {[type]}   filepath [description]
  	 * @return     {[type]}            [description]
  	 */
  	delete_file:function(filepath){
  		return fs.unlinkSync(filepath);
  	},
  	/**
  	 * [get_file_size 获取文件大小]
  	 * @author 	   szjcomo
  	 * @createTime 2019-11-04
  	 * @param      {[type]}   filepath [description]
  	 * @return     {[type]}            [description]
  	 */
  	get_file_size:function(filepath){
  		let stat = fs.statSync(filepath);
  		return stat.size;
  	},
};