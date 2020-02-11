'use strict';
//项目工具
module.exports = {

    /**
     * 项目统一返回值
     *
     * @param {*} message
     * @param {*} [result=null]
     * @param {boolean} [err=true]
     * @param {number} [error_code=0]
     */
    appResult(message,result = null,err = true,error_code = 0) {
        return {message:message,result:result,error_status:err,error_code:error_code};
    }
};