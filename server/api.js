/**
 * 日期：2018-01-08
 * 作者：BLUE
 * 描述：配置用户操作类
 *
 * @class api 代码配置操作类
 * @constructor
*/

const db = require("./db");
const api = class api {

    /**
     * insert 插入单条数据
     * @param {string} col 集合名
     * @param {object} params 参数对象
     * @param {obj} req 请求对象
     * @param {obj} res 响应对象
     */
    insert(col, params, req, res) {
        //插入单条数据
        if (params["_id"]) {
            params["pk_len"] && delete params["pk_len"];
            params["pk_fmt"] && delete params["pk_fmt"];
            params["pk_prev"] && delete params["pk_prev"];
            db.insert(col, params, (err, docs) => {
                if (err) {
                    res.status(500).end(err);
                } else {
                    res.send(docs);
                }
            })
        } else {
            let p = {
                pk_name: col,
                pk_len: params["pk_len"] || 6,
                pk_fmt: params["pk_fmt"] || "d",
                pk_prev: params["pk_prev"] || ""
            }
            params["pk_len"] && delete params["pk_len"];
            params["pk_fmt"] && delete params["pk_fmt"];
            params["pk_prev"] && delete params["pk_prev"];
            this.getPkCode(p, (err, code) => {
                if (err) {
                    res.status(500).end(err);
                } else {
                    params["_id"] = code;
                    db.insert(col, params, (err, docs) => {
                        if (err) {
                            res.status(500).end(err);
                        } else {
                            res.send(code);
                        }
                    })
                }
            })
        }

    }
    /**
     * insert 插入多条数据
     * @param {string} col 集合名
     * @param {object} params 参数对象
     * @param {obj} req 请求对象
     * @param {obj} res 响应对象
     * @param {function} callback 回调函数
     */
    insertMany(col, params, req, res, callback) {
        let docs = params["json"] || [];
        docs = typeof (params["json"]) == 'object' ? docs : JSON.parse(docs);
        let c = {
            coll: col,
            json: docs
        }
        db.eval("sys_import", c, (err, r) => {
            if (err) {
                res.status(500).end(err);
            } else {
                if (callback) {
                    callback();
                } else {
                    res.send(r);
                }
            }
        })
        /* db.insertMany(col, docs, (err, docs) => {
            if (err) {
                res.status(500)
            } else {
                res.send("ok");
            }
        }) */
    }

    /**
     * remove 删除数据
     * @param {string} col 集合名
     * @param {object} params 参数对象
     * @param {obj} req 请求对象
     * @param {obj} res 响应对象
     */
    remove(col, params, req, res) {
        db.remove(col, params, (err, docs) => {
            if (err) {
                res.status(500).end(err);
            } else {
                res.send(docs);
            }
        })
    }
    /**
     * find 查询数据
     * @param {string} col 集合名
     * @param {object} params 参数对象
     * @param {object} req 请求对象
     * @param {object} res  响应对象
     * @param {object} keys 配置参数对象
    */
    find(col, params, req, res, keys) {
        let _orderk = keys["f_fldorder"],
            _ordert = keys["f_ordertype"];
        params["_orderk"] = _orderk;
        params["_ordert"] = _ordert;
        db.find(col, params, (err, docs) => {
            if (err) {
                res.status(500).end(err);
            } else {
                res.send(docs);
            }
        });
    }
    /**
     * findById 按主键查询数据
     * @param {string} col 集合名
     * @param {object} params 参数对象
     * @param {obj} req 请求对象
     * @param {obj} res 响应对象
    */
    findById(col, params, req, res) {
        if (params["_id"]) {
            db.findById(col, params["_id"], (err, docs) => {
                if (err) {
                    res.status(500).end(err);
                } else {
                    res.send(docs);
                }
            })
        } else {
            res.status(400);
        }
    }

    /**
     * find4page 查询分页数据
     * @param {string} col 集合名
     * @param {object} params 参数对象
     * @param {obj} req 请求对象
     * @param {obj} res 响应对象
     * @param {object} keys 配置参数对象
    */
    find4page(col, params, req, res, keys) {
        let pageIndex = params["pageIndex"] || 1,
            pageSize = params["pageSize"] || 20;
        delete params["pageIndex"];
        delete params["pageSize"];
        let _orderk = keys["f_fldorder"],
            _ordert = keys["f_ordertype"];
        params["_orderk"] = _orderk;
        params["_ordert"] = _ordert;
        db.find4page(col, params, pageIndex, pageSize, (err, docs, count) => {
            if (err) {
                res.status(500).end(err)
            } else {
                let r = [],
                    PageLowerBound = (Number(pageIndex) - 1) * Number(pageSize) + 1;
                docs.forEach(element => {
                    element = element.toObject({ vituals: true });
                    element["order"] = PageLowerBound;
                    r.push(element);
                    PageLowerBound++;
                });
                r.unshift({ "_count": count });
                res.send(r);
            }
        })
    }

    /**
     * findOne 查询单条数据
     * @param {string} col 集合名
     * @param {object} params 参数对象
     * @param {obj} req 请求对象
     * @param {obj} res 响应对象
    */
    findOne(col, params, req, res) {
        db.findOne(col, params, (err, docs) => {
            if (err) {
                res.status(500).end(err)
            } else {
                res.send(docs);
            }
        })
    }

    /**
    * updateByKey 按主键修改数据
    * @param {string} col 集合名
    * @param {object} params 参数对象
    * @param {obj} req 请求对象
    * @param {obj} res 响应对象
   */
    updateById(col, params, req, res) {
        if (params["_id"]) {
            let conditions = {};
            conditions["_id"] = params["_id"];
            delete params["_id"];
            db.update(col, conditions, params, (err, docs) => {
                if (err) {
                    res.status(500).end(err)
                } else {
                    res.send(docs);
                }
            })
        } else {
            res.status(400);
        }
    }
    /**
    * updateByCond 根据条件修改数据
    * @param {string} col 集合名
    * @param {object} params 参数对象
    * @param {obj} req 请求对象
    * @param {obj} res 响应对象
   */
    updateByCond(col, params, req, res) {
        let conditions = {};
        for (let key in params) {
            if (key.substring(key.length - 5, key.length) === "_Cond") {
                conditions[key.replace("_Cond", "")] = params[key];
                delete params[key];
                break;
            }
        }
        if (JSON.stringify(conditions) != "{}") {
            db.update(col, conditions, params, (err, docs) => {
                if (err) {
                    res.status(500).end(err)
                } else {
                    res.send(docs);
                }
            })
        } else {
            //未发现修改条件
            res.status(400);
        }
    }
    /**
     * 
     * 生成pkcode
     * @method getPkCode
     * @param {object} params (pk_name,pk_len=4,pk_fmt=d,pk_prev="")
     * @param {function} callback 回调函数(err,res)
     */
    getPkCode(params, callback) {
        db.eval("get_pkid", params, (err, res) => {
            if (err) {
                callback(err);
            } else {
                callback(null, res);
            }
        })
    }
}
module.exports = new api();