/**
 * 路由级中间件
 */
var express = require('express');
var router = express.Router();
var app = express();
// 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
router.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
});

// 一个中间件栈，显示任何指向 /user/:id 的 HTTP 请求的信息
router.use('/user/:id', function (req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}, function (req, res, next) {
    console.log('Request Type:', req.method);
    next();
});

// 一个中间件栈，处理指向 /user/:id 的 GET 请求
router.get('/user/:id', function (req, res, next) {
    res.send(`user:${req.params.id}`)
});

app.use('/student', router);
var server = app.listen(3000, function () {
    console.log("OK");
});