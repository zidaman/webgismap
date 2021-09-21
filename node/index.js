var express = require('express');
var app = express();
var home = require('./routers/home');
var user = require('./routers/user');     //引入新建的路由文件
// var bodyParser = require('body-parser');    //首先要引入这个插件

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use('/', home);
app.use('/user', user);   //配置该文件

app.listen(3001);