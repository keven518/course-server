// 上传到七牛
let qiniu = require('qiniu'); // 需要加载qiniu模块的
// 引入key文件
const QINIU = require('../config/qiniu_config')
const upToQiniu = (filePath, key) => {
    const accessKey = QINIU.accessKey
    const secretKey = QINIU.secretKey
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    const options = {scope: QINIU.bucket}
    const putPolicy =  new qiniu.rs.PutPolicy(options);
    const uploadToken= putPolicy.uploadToken(mac);
    const config= new qiniu.conf.Config()
    config.zone = qiniu.zone.Zone_z0;
    const localFile = filePath
    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()
    return new Promise((resolved, reject) => {
        formUploader.putStream(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
            if (respErr) {
                reject(respErr)
            } else {
                respBody.url = QINIU.origin + '/' + respBody.key;
                resolved(respBody)
            }
        })
    })
}
module.exports = {upToQiniu};
