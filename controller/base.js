'use strict';

const {comoRules,validate} 	= require('como-validator');
const utils                 = require('../utils/app'); 

/** 
 * 控制器基类
*/
module.exports = class base {

    /**
     *Creates an instance of base.
     * @param {*} ctx
     */
    constructor(ctx) {
        this.ctx = ctx;
        this.debug = true;
    }
    /**
     * 控制器统一返回值
     *
     * @param {*} message
     * @param {*} [result=null]
     * @param {boolean} [error_status=true]
     * @param {*} error_code
     */
    appResult(message,result = null,error_status = true,error_code = 0) {
        return utils.appResult(message,result,error_status,error_code);
    }
    /**
     * 响应json数据
     *
     * @param {*} data
     */
    Json(data = {}) {
        let that = this;
        return that.ctx.body = data;
    }

    /**
     * 获取验证规则
     *
     * @readonly
     */
    get rule() {
        return comoRules.getInstance();
    }
    /**
     * 验证参数
     *
     * @param {*} rules
     * @param {*} data
     */
    async validator(rules,data) {
        return await validate(rules,data);
    }

	/**
	 * [htmlspecialchars html转义符号]
	 * @Author   szjcomo
	 * @DateTime 2019-10-04
	 * @param    {[type]}   str [description]
	 * @return   {[type]}       [description]
	 */
	htmlspecialchars(str) {        
		var s = "";
		if (str.length == 0) return "";
		for   (var i=0; i<str.length; i++){  
			switch (str.substr(i,1)){
				case "<": s += "&lt;"; break;
				case ">": s += "&gt;"; break;
				case "&": s += "&amp;"; break;
				case " ":
					if(str.substr(i + 1, 1) == " "){
						s += " &nbsp;";
						i++;
					} else s += " ";
					break;
				case "\"": s += "&quot;"; break;
				case "\n": s += "<br>"; break;
				default: s += str.substr(i,1); break;
			}
		}
		return s;
    }
	/**
	 * [post 获取post过来的参数]
	 * @Author szjcomo
	 * @DateTime 2019-10-03
	 * @param    {[type]}   name     [description]
	 * @param    {[type]}   defaults [description]
	 * @param    {[type]}   handler  [description]
	 * @return   {[type]}            [description]
	 */
	async post(name = null,defaults = null,handler = null){
        let that = this;
		return await that.params_handler(that.ctx.request.body,name,defaults,handler);
	}
	/**
	 * [get 获取get请求参数]
	 * @Author   szjcomo
	 * @DateTime 2019-10-03
	 * @param    {[type]}   name     [description]
	 * @param    {[type]}   defaults [description]
	 * @param    {[type]}   handler  [description]
	 * @return   {[type]}            [description]
	 */
	async get(name = null,defaults = null,handler = null){
        let that = this;
		return await that.params_handler(JSON.parse(JSON.stringify(that.ctx.query)),name,defaults,handler);
    }
	/**
	 * [params_handler 统一的参数请求处理]
	 * @Author   szjcomo
	 * @DateTime 2019-10-03
	 * @param    {[type]}   result   [description]
	 * @param    {[type]}   name     [description]
	 * @param    {[type]}   defaults [description]
	 * @param    {[type]}   handler  [description]
	 * @return   {[type]}            [description]
	 */
	async params_handler(result,name = null,defaults = null,handler = null){
		let that = this;
		try{
			if(name === null){
				let tmp = {};
				Object.getOwnPropertyNames(result).forEach(key => {
					if(typeof result[key] !== 'string'){
						tmp[key] = result[key];
					} else {
						tmp[key] = that.htmlspecialchars(result[key]);
					}
				})
				return tmp;
			}
			if(result.hasOwnProperty(name)) {
				if(typeof(handler) == 'function'){
					return await handler(result[name]);
				}
				if(typeof result[name] !== 'string'){
					return result[name];
				}
				return that.htmlspecialchars(result[name]);
			}
			return defaults;
		} catch(err){
			that.console(err.message);
			return null;
		}
	}

    /**
     * 打印调试信息
     *
     * @param {*} message
     */
    console(message) {
        if(this.debug) console.info(message);
    }
}