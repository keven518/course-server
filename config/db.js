'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('szjkj', 'root', 'root', {
    host: '127.0.0.1',
    dialect: 'mysql',
    delegate: 'model',
    baseDir: 'models',
    pool: {
        max: 5,
        min: 1,
        acquire: 30000,
        idle: 10000
    },
    charset: "utf8",
    logging:console.log,
    timezone: '+08:00', //东八时区,
    dialectOptions: {  // 让读取date类型数据时返回字符串而不是UTC时间
        dateStrings: true,
        typeCast:true
    }	
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
module.exports = sequelize;