/**
 * 日期：2018-01-24
 * 作者：BLUE
 * 描述：IEDA 服务端函数类,主要作为中间件
 *
 * @class Fun 服务端函数类
 * @constructor
*/
const db = require("./db");
const api = require("./api");
const hh = require("./HandleHelper");
const path = require('path');
const fs = require("fs");
const multer = require('multer');
const Fun = class Fun {
    /**
     * 请求处理验证
     * @param {object} docs 查询出的配置文档
     * @param {object} params 请求参数对象
     * @param {object} req 请求对象
     * @param {object} res 响应对象
     * @return {void}
     */
    middleware(docs, params, req, res) {
        if (docs.length > 0) {
            //接口类型，0为验证接口
            let portType = docs[0].f_porttype;
            if (portType == 0) {
                let _s = req.cookies._validme_ ? req.cookies._validme_ : "";
                if (_s) {
                    let _self = this;
                    hh.decCookie(_s, req.ip, (err, r) => {
                        if (r != "_validuser_" || Boolean(err)) {
                            res.status(403).end("The server rejects the request");
                            return false;
                        } else {
                            res.cookie("_validme_", req.cookies._validme_, { expires: new Date(Date.now() + 1000 * 60 * 20), httpOnly: true })//加密cookie保持登录状态
                            res.cookie("_validlog_", req.cookies._validlog_, { expires: new Date(Date.now() + 1000 * 60 * 20) })
                            _self.midfun(docs, params, req, res);
                        }
                    })
                } else {
                    res.status(403).end("The server rejects the request");
                    return false;
                }
            } else {
                this.midfun(docs, params, req, res);
            }
        } else {
            res.status(500);
        }
    }
    /**
     * 请求处理中间件
     * @param {object} docs 查询出的配置文档
     * @param {object} params 请求参数对象
     * @param {object} req 请求对象
     * @param {object} res 响应对象
     * @return {void}
     */
    midfun(docs, params, req, res) {
        let col = docs[0].f_name,
            opt = docs[0].f_optres,
            type = docs[0].f_type,
            keys = docs[0];
        if (type == 0) {
            params = hh.do4dtype(col, params);
            //集合
            switch (opt) {
                case "ins": {
                    //增加单条数据
                    api.insert(col, params, req, res);
                    break;
                }
                case "insm": {
                    //增加多条数据
                    api.insertMany(col, params, req, res);
                    break;
                }
                case "qry": {
                    //查询数据
                    api.find(col, params, req, res, keys);
                    break;
                }
                case "qryk": {
                    //按主键查询数据
                    api.findById(col, params, req, res);
                    break;
                }
                case "qryp": {
                    //查询分页数据
                    api.find4page(col, params, req, res, keys);
                    break;
                }
                case "qryone": {
                    //查询单条数据
                    api.findOne(col, params, req, res);
                    break;
                }
                case "del": {
                    //删除数据
                    if (docs[0].f_id == "del_files_list") {
                        let del = Boolean(params.del) || false,
                            _self = this;
                        delete params["del"];
                        if (del) {
                            //针对删除附件特殊处理，用户指定删除源文件
                            //删除源文件处理
                            this.getFiles(params, (err, pathArr) => {
                                if (!err) {
                                    api.remove(col, params, req, res);
                                    _self.delFiles(pathArr);
                                }
                            });
                        } else {
                            api.remove(col, params, req, res);
                        }
                    } else {
                        delete params["del"];
                        api.remove(col, params, req, res);
                    }
                    break;
                }
                case "edtk": {
                    //按主键修改数据
                    api.updateById(col, params, req, res);
                    break;
                }
                case "edtc": {
                    //按条件修改数据
                    api.updateByCond(col, params, req, res);
                    break;
                }
            }
        } else if (type == 1) {
            //函数
            db.eval(col, params, (err, docs) => {
                if (err) {
                    res.status(500);
                } else {
                    res.send(docs);
                }
            })
        }
    }


    /**
     * 处理登录
     * @param {object} req 请求对象 
     * @param {object} res 响应对象
     */
    login(req, res) {
        let uid = hh.tostr(req.body.uid),
            pwd = hh.tostr(req.body.pwd),
            _self = this;
        if (uid && pwd) {
            db.findOne("comp_sysuser", {
                cu_usercode: uid,
                cu_password: hh.hex4md5(pwd),
                cu_state: "0"
            }, (err, docs) => {
                if (err) {
                    res.status(500).end("The server is busy, please try again later");
                } else {
                    if (docs) {
                        hh.mkCookie(req.ip, (err, s) => {
                            //加密cookie保持登录状态,仅http访问，避免前台修改影响登录
                            res.cookie("_validme_", s, { expires: new Date(Date.now() + 1000 * 60 * 20), httpOnly: true })
                            res.cookie("_validlog_", s, { expires: new Date(Date.now() + 1000 * 60 * 20) })
                            res.send(docs);
                        })
                    } else {
                        res.status(404).end("error");
                    }
                }
            })
        } else {
            res.status(403).end("Lack of user name or password");
        }
    }
    /**
     * 处理密码修改
     * @param {object} req 请求对象 
     * @param {object} res 响应对象
     */
    edtpwd(req, res) {
        let uid = hh.tostr(req.body._id),
            oldpwd = hh.tostr(req.body.oldpwd),
            newpwd = hh.tostr(req.body.newpwd);
        let _s = req.cookies._validme_ ? req.cookies._validme_ : "";
        hh.decCookie(_s, req.ip, (err, r) => {
            if (r != "_validuser_" || Boolean(err)) {
                res.status(403).end("The server rejects the request");
                return false;
            } else {
                res.cookie("_validme_", req.cookies._validme_, { expires: new Date(Date.now() + 1000 * 60 * 20), httpOnly: true })//加密cookie保持登录状态
                res.cookie("_validlog_", req.cookies._validlog_, { expires: new Date(Date.now() + 1000 * 60 * 20) })
                let params = {
                    _id: uid,
                    cu_password: hh.hex4md5(oldpwd)
                }
                db.findOne("comp_sysuser", params, (err, docs) => {
                    if (err) {
                        res.status(500).end("The server is busy, please try again later");
                    } else {
                        if (docs) {
                            db.update("comp_sysuser", { _id: uid }, { cu_password: hh.hex4md5(newpwd) }, (err, doc) => {
                                if (!err) {
                                    res.send("ok");
                                } else {
                                    res.status(500).end("The server is busy, please try again later");
                                }
                            })
                        } else {
                            res.status(404);
                        }
                    }
                })
            }
        })
    }
    /**
     * 文件(附件)上传中间件
     * 经过busi_attach
     */
    upload(req, res) {
        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                let _d = req.body.target || 'attach';
                let uploadFolder = path.join(__dirname, "./../public/upload", _d);
                hh.mkdirSync(uploadFolder);
                cb(null, uploadFolder);
            },
            filename: function (req, file, cb) {
                let _fn = path.basename(file.originalname, path.extname(file.originalname)) + '_' + Date.now() + path.extname(file.originalname);
                cb(null, _fn);
            }
        });
        return multer({
            storage: storage, fileFilter(req, file, cb) {
                if (file.mimetype.indexOf("html") != -1
                    || file.mimetype.indexOf("application") != -1) {
                    cb(new Error('File format ' + file.mimetype + ' is not allowed'), false)
                } else {
                    cb(null, true)
                }
            }
        }).array('files', 99);
    }
    /**
     * 附件上传信息入库
     * @param {object} req  
     * @param {object} res
     * @param {function} callback 回调函数
     */
    insFilesAttach(req, res, callback) {
        let params = {
            json: []
        },
            pathArr = [];
        let billid = hh.tostr(req.body.da_billid),
            target = req.body.target || 'attach';
        req.files.forEach(ele => {
            params.json.push({
                da_billid: billid,
                da_tagid: target,
                da_origname: ele.originalname,
                da_filename: ele.filename,
                da_extname: ele.mimetype,
                da_path: ele.path.substr(ele.path.indexOf("upload")),
                da_size: ele.size,
                da_date: new Date()
            })
            pathArr.push(ele.path.substr(ele.path.indexOf("upload")));
        })
        api.insertMany("busi_attach", params, req, res, () => {
            callback && callback(pathArr)
        })
    }
    /**
     * 获取预删除的附件路径
     * @param {object} params 要删除的文件参数对象
     * @param {function} callback 获取的回调函数
     */
    getFiles(params, callback) {
        db.find("busi_attach", params, (err, docs) => {
            if (err) {
                callback && callback(err);
            } else {
                let pathArr = [];
                docs.forEach(ele => {
                    if (ele.da_path) {
                        pathArr.push(ele.da_path);
                    }
                });
                callback && callback(null, pathArr);
            }
        })
    }
    /**
     * 异步删除文件,可以循环删除，我不关心结果
     * @param {array} pathArr 预删除文件路径数组
     */
    delFiles(pathArr) {
        if (pathArr.length > 0) {
            pathArr.forEach(pt => {
                pt = path.join(__dirname, "../public", pt);
                pt = path.normalize(pt);
                fs.access(pt, (err) => {
                    if (!err) {
                        fs.unlink(pt, (err) => { });
                    }
                })
            })
        }
    }
}
module.exports = new Fun();