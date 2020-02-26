'use strict';

const Base 		= require('./base');
const szjcomo 	= require('@szjcomo/szjvuetools');
const path 				= require('path');
const fs  				= require('fs');
const fileTools 		= require('../utils/file');
const uploadQNClient  	= require('../utils/upload');
const QINIU 			= require('../config/qiniu_config');

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
			let savePath = path.join(that.ctx.appPath,'uploads',szjcomo.date('Ymd'));
			let saveName = szjcomo.date('YmdHis') + '' + szjcomo.mt_rand(10000,99999) + path.extname(file.name);
			fileTools.create_dir(savePath);
			let filePath = path.join(savePath,saveName);
			let upStream = fs.createWriteStream(filePath);
			reader.pipe(upStream);
			let result = await uploadQNClient(filePath,saveName);
			//fileTools.delete_file(file.path);
			//fileTools.delete_file(filePath);
			return that.appJson(that.appResult('附件上传成功',result,false));
		} catch(err) {
			console.log(err);
			return that.appJson(that.appResult(err.message));
		}
	}
}
module.exports = AttachmentController;