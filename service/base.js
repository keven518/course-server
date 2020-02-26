'use strict';

const fs 				= require('fs');
const path 				= require('path');
const szjcomo 	 		= require('@szjcomo/szjvuetools');
const awaitWriteStream 	= require('await-stream-ready').write;
const sendToWormhole 	= require('stream-wormhole');//管道读入一个虫洞
const tools             = require('../utils/app');
const dbTools 			= require('../utils/db');


/**
 * 项目通用的服务类基类
 */
class BaseService {
	
	/**
	 * 全局统一返回函数
	 * @param {} message 
	 * @param {*} result 
	 * @param {*} error_status 
	 * @param {*} result_code 
	 */
	async appResult(message,result = null,error_status = true,result_code = 0) {
		return tools.appResult(message,result,error_status,result_code);
	}
	/**
	 * [select 数据查询列表]
	 * @author 	   szjcomo
	 * @createTime 2019-10-31
	 * @param      {Object}   options [description]
	 * @return     {[type]}           [description]
	 */
	async select(options = {},model = null,alert = '数据',isOne = false){
		try{
			let result = isOne?await model.findOne(options):await model.findAll(options);
			return this.appResult(alert + '查询成功',result,false,0);
		} catch(err){
			return this.appResult(dbTools.getError(err));
		}
	}
	/**
	 * [selectAndCount 数据查询并统计]
	 * @author szjcomo
	 * @dateTime 2019-12-24
	 * @param    {Object}   options [description]
	 * @param    {[type]}   model   [description]
	 * @param    {String}   alert   [description]
	 * @return   {[type]}           [description]
	 */
	async selectAndCount(options = {},model = null,alert = '数据') {
		try{
			let result = await model.findAndCountAll(options);
			return this.appResult(alert + '查询成功',result,false,0);
		} catch(err){
			return this.appResult(dbTools.getError(err));
		}
	}
	/**
	 * [delete 删除数据]
	 * @author szjcomo
	 * @dateTime 2019-12-24
	 * @param    {Object}   options [description]
	 * @param    {[type]}   model   [description]
	 * @param    {String}   alert   [description]
	 * @return   {[type]}           [description]
	 */
	async delete(options = {},model = null,alert = '数据') {
		try{
			let result = await model.destroy(options);
			if(result) return this.appResult(alert + '删除成功',result,false,0);
			return this.appResult(alert + '删除失败');
		} catch(err){
			return this.appResult(dbTools.getError(err));
		}
	}

	/**
	 * [add 添加数据]
	 * @author 	   szjcomo
	 * @createTime 2019-10-31
	 * @param      {Object}   options [description]
	 * @param      {[type]}   model   [description]
	 */
	async add(options = {},model = null,alert = ''){
		try{
			let result = await model.create(options);
			if(result) return this.appResult(alert + '添加成功',result,false,0);
			return this.appResult(alert + '添加失败');
		} catch(err){
			return this.appResult(dbTools.getError(err));
		}
	}
	/**
	 * [save 数据更新]
	 * @author 	   szjcomo
	 * @createTime 2019-10-31
	 * @param      {Object}   options [description]
	 * @param      {Object}   params  [description]
	 * @param      {[type]}   model   [description]
	 * @return     {[type]}           [description]
	 */
	async update(options = {},params = {},model = null,alert = ''){
		try{
			let result = await model.update(options,params);
			if(result[0] > 0) return this.appResult(alert + '更新成功',result[0],false,0);
			return this.appResult(alert + '更新失败');
		} catch(err){
			return this.appResult(dbTools.getError(err));
		}
	}



	/**
	 * [upload 文件单个上传]
	 * @Author   szjcomo
	 * @DateTime 2019-10-05
	 * @return   {[type]}   [description]
	 */
	// async uploadOne(savePath,filename){
	// 	let that = this;
	// 	try{
	// 		// 获取文件流
	// 		let stream = await that.ctx.getFileStream();
	// 		return await that.uploadHandler(stream,savePath,filename);
	// 	} catch(err){
	// 		return this.appResult(dbTools.getError(err));
	// 	}
	// }
	/**
	 * [uploadHandler 上传的文件流]
	 * @Author   szjcomo
	 * @DateTime 2019-10-05
	 * @param    {[type]}   stream [description]
	 * @return   {[type]}          [description]
	 */
	// async uploadHandler(stream,savePath,filename){
	// 	try{
	//   		let ext 		= path.extname(filename);
	//   		if(szjcomo.empty(ext)) filename += path.extname(stream.filename);
	//   		// 生成文件路径
	//   		fileTools.create_dir(savePath);
	//   		// 目标文件
	//   		let target 		= path.join(savePath, filename);
	//   		// 创建文件流
	//   		let writeStream = fs.createWriteStream(target);
	//   		try{
	//   			//异步把文件流 写入
    // 			await awaitWriteStream(stream.pipe(writeStream));
	//   		} catch(err){
	// 		    //如果出现错误，关闭管道
	// 		    await sendToWormhole(stream);
	//   			throw err;
	//   		}
	//   		return this.appResult('文件上传成功',{
	//   			savePath:savePath,fileName:filename,fileSha1:encryptTools.fileSha1(target),
	//   			fields:stream.fields,fileSize:writeStream.bytesWritten,mime:stream.mime,
	//   			encoding:stream.encoding,orgFileName:stream.filename,ext:path.extname(filename).replace('.','')
	//   		},false,0);
	// 	} catch(err){
	// 		return this.appResult(dbTools.getError(err));
	// 	}
	// }
	/**
	 * [getAdminUserId 获取后台操作人员ID]
	 * @author 	   szjcomo
	 * @createTime 2019-11-04
	 * @return     {[type]}   [description]
	 */
	async getAdminUserId(){
		return 1;
	}
}
module.exports = BaseService;