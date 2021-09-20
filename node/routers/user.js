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
    var pool = mysql.createPool(db_config);
    pool.getConnection(function (err, connect) {//通过getConnection()方法进行数据库连接
        if (err) {
            console.log(`mysql链接失败${err}`);
        } else {
            connect.query("select * from `t_user` where username = '张三'", function (err, rst) {
                if (err) {
                    console.log(`SQL error:${err}`)
                    res.send({
                        status: 'fail',
                        msg: 'SQL error'
                    });
                } else {
                    // console.log(rst);
                    // console.log(JSON.parse(JSON.stringify(rst)));
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

router.post('/insert', function (req, res) {
    res.send('user insert');
});

module.exports = router;