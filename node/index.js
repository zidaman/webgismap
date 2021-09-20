var express = require('express');
var app = express();

var home = require('./routers/home');
var user = require('./routers/user');     //引入新建的路由文件

app.use('/', home);
app.use('/user', user);   //配置该文件

app.listen(3001);