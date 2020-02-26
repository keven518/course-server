'use strict';

const Base 				= require('./base');
const szjcomo 			= require('@szjcomo/szjvuetools');
const path 				= require('path');
const fs  				= require('fs');
const fileTools 		= require('../utils/file');
const qiniu  			= require('../utils/upload');

/**
 * 后台控制器
 */
class AttachmentController extends Base {

	/**
	 * 七牛云文件上传
	 *
	 * @memberof AttachmentController
	 */
	async uploadQN() {
		let that = this;
		try {
			let file = that.ctx.request.files.attach;
			let reader = fs.createReadStream(file.path);
			let saveName = szjcomo.date('YmdHis') + '' + szjcomo.mt_rand(10000,99999) + path.extname(file.name);
			let result = await qiniu.upToQiniu(reader,saveName);
			fileTools.delete_file(file.path);
			return that.appJson(that.appResult('附件上传成功',result,false));
		} catch(err) {
			console.log(err);
			return that.appJson(that.appResult(err.message));
		}
	}
}
module.exports = AttachmentController;