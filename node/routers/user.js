var express = require('express');
var router = express.Router();
var mysql = require("mysql");
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '0990',
//     port: '3306',
//     database: 'book'
// });
const db_config = {
    host: "localhost",
    user: "root",
    password: "0990",
    port: "3306",
    database: "book"
}

//获取用户信息接口
router.get('/get', function (req, res) {
    // connection.connect();
    // var sql = 'SELECT * FROM t_user';
    // //查
    // connection.query(sql, function (err, result) {
    //     if (err) {
    //         console.log('[SELECT ERROR] - ', err.message);
    //         return;
    //     }
    //     console.log('--------------------------SELECT----------------------------');
    //     console.log(result);
    //     console.log('------------------------------------------------------------\n\n');
    // });
    // connection.end();
    var name = req.query.name;
    var pool = mysql.createPool(db_config);
    pool.getConnection(function (err, connect) {//通过getConnection()方法进行数据库连接
        if (err) {
            console.log(`mysql链接失败${err}`);
        } else {
            //查询数据
            // connect.query('select * from `t_user` where username = name', function (err, rst) {  //语句错误         
            connect.query('select * from `t_user` where username = ?', [name], function (err, rst) {
                if (err) {
                    console.log(`query error:${err}`)
                    res.send({
                        status: 'fail',
                        msg: 'select error'
                    });
                } else {
                    // console.log(rst);
                    // console.log(JSON.parse(JSON.stringify(rst)));
                    console.log('[insert success] - ' + rst);
                    res.send({
                        status: 'success',
                        data: rst
                    });
                }
                connect.release();//释放连接池中的数据库连接
                pool.end();//关闭连接池
            });
        }
    });
});

//用户注册接口
router.post('/insert', function (req, res) {
    var pool = mysql.createPool(db_config);
    pool.getConnection(function (err, connect) {//通过getConnection()方法进行数据库连接
        if (err) {
            console.log(`mysql链接失败${err}`);
            connect.release();//释放连接池中的数据库连接
            pool.end();//关闭连接池
            return;
        } else {
            //插入数据
            var addSql = 'INSERT INTO t_user(id,username,password,email) VALUES(?,?,?,?)';
            var addSqlParams = [16, '李四16', 'lisi16', 'lisi16@126.com'];
            connect.query(addSql, addSqlParams, function (err, rst) {
                if (err) {
                    console.log('[insert error] - ', err.message)
                    res.send({
                        status: 'fail',
                        msg: 'insert error'
                    });
                } else {
                    console.log('[insert success] - ', rst);
                    res.send({
                        status: 'success',
                        data: []
                    });
                }
                connect.release();//释放连接池中的数据库连接
                pool.end();//关闭连接池
            });
        }
    });
});

module.exports = router;