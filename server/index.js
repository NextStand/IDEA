const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require("./db");
const Fun = require("./Fun");
const hh = require("./HandleHelper");
const app = express();
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
//引入ueditor
const ueditor = require("ueditor")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './../public')));
app.use(express.static(path.join(__dirname, './../dist')));
app.use(express.static(path.join(__dirname, './../static')));

/**
 * 集群处理负载均衡
 */
if (cluster.isMaster) {
    console.log('[master] ' + 'start master...');
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

} else if (cluster.isWorker) {
    console.log('[worker] ' + "start worker ..." + cluster.worker.id);
    app.get('/', function(req, res) {
        const html = fs.readFileSync(path.resolve(__dirname, './../dist/index.html'), 'utf-8')
        res.send(html)
    })
    /**
     * 通用请求接口
     */
    app.route('/xml/:coll').get((req, res) => {
        let collection = req.params.coll,
            params = req.query || null;
        db.eval("get_mongcondtion", { f_id: collection }, (err, docs) => {
            try {
                if (err) {
                    console.log(err);
                    res.status(500).end("The server is busy, please try again later");
                } else {
                    if (docs.length > 0) {
                        let __condtion = docs[0]["__condtion"];
                        if (__condtion.length > 0) {
                            params["__condtion"] = [...__condtion];
                            delete docs[0]["__condtion"];
                        }
                        Fun.middleware(docs, params, req, res);
                    } else {
                        res.status(403).end("The operation type is not specified");
                    }
                }
            } catch (error) {
                console.log(error);
                res.status(500).end("The server is busy, please try again later");
            }
        })
    }).post((req, res) => {
        let collection = req.params.coll,
            params = req.body || null;
        db.eval("get_mongcondtion", { f_id: collection }, (err, docs) => {
            try {
                if (err) {
                    console.log(err);
                    res.status(500).end("The server is busy, please try again later");
                } else {
                    if (docs.length > 0) {
                        let __condtion = docs[0]["__condtion"];
                        if (__condtion.length > 0) {
                            params["__condtion"] = [...__condtion];
                            delete docs[0]["__condtion"];
                        }
                        Fun.middleware(docs, params, req, res);
                    } else {
                        res.status(403).end("The operation type is not specified");
                    }
                }
            } catch (error) {
                console.log(error);
                res.status(500).end("The server is busy, please try again later");
            }

        })
    })
    //富文本编辑器配置
    app.use("/ueditor/ue", ueditor(path.join(__dirname, './../public'), function(req, res, next) {
        //客户端上传文件设置
        var imgDir = '/ueditorupload/img/'
        var ActionType = req.query.action;
        if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
          var file_url = imgDir; //默认图片上传地址
          /*其他上传格式的地址*/
          if (ActionType === 'uploadfile') {
            file_url = '/ueditorupload/file/'; //附件
          }
          if (ActionType === 'uploadvideo') {
            file_url = '/ueditorupload/video/'; //视频
          }
          res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
          res.setHeader('Content-Type', 'text/html');
        }
        // 客户端发起图片列表请求
        else if (req.query.action === 'listimage') {
          var dir_url = imgDir;
          res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
        }
        // 客户端发起其它请求
        else {
          res.setHeader('Content-Type', 'application/json');
          res.redirect('/ueditor/nodejs/config.json');
        }
      }));
    /**
     * mongo配置接口
     */
    app.post("/config", (req, res) => {
        let reqdata = req.body;
        if (reqdata.opt == "ins") {
            delete reqdata["opt"];
            reqdata = hh.do4dtype("mongocfig", reqdata);
            db.insert("mongocfig", reqdata, (err) => {
                if (err) {
                    res.status(500).end("The server is busy, please try again later");
                } else {
                    res.send(reqdata);
                }
            })
        } else {
            res.status(403).end("The operation type is not specified");
        }
    })
    /**
     * 用户登录接口
     */
    app.post('/login', function (req, res) {
        Fun.login(req, res);
    });
    /**
     * 用户退出
     */
    app.post('/logout', function (req, res) {
        res.clearCookie("_validlog_")
            .clearCookie("_validme_")
            .end("bye");
    });
    /**
     * 用户修改密码
     */
    app.post('/edtpwd', function (req, res) {
        Fun.edtpwd(req, res);
    })
    /**
     * 文件(附件)上传接口
     * 经过busi_attach
     */
    app.post('/upload/files', Fun.upload(), function (req, res, next) {
        Fun.insFilesAttach(req, res, pathArr => {
            res.send(pathArr.join(";"));
        })
    })
    /**
     * 文件（附件）上传接口
     * 文件信息不经过busi_attach
     */
    app.post('/upload/file', Fun.upload(), (req, res, next) => {
        let pathArr = [];
        req.files.forEach(ele => {
            pathArr.push(ele.path.substr(ele.path.indexOf("upload")));
        });
        res.send(pathArr.join(";"));
    })
    //错误处理中间件
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(403).send(err.stack);
    });
    app.listen(3000, function () {
        console.log("OK");
    });
}