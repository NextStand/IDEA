/**
 * 日期：2018-01-08
 * 作者：BLUE
 * 描述：mongodb操作类，基于mongoose
 *
 * @class DB mongodb操作类
 * @constructor
*/
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const logger = require('pomelo-logger').getLogger('mongodb-log');
const options = require(path.join(path.dirname(__dirname), 'web.config.js'));
//let dbURL = "mongodb://" + options.db_user + ":" + options.db_pwd + "@" + options.db_host + ":" + options.db_port + "/" + options.db_name;
let dbURL = `mongodb://${options.db_user}:${options.db_pwd}@${options.db_host}:${options.db_port}/${options.db_name}`
mongoose.connect(dbURL);

mongoose.connection.on('connected', function (err) {
    if (err) logger.error('Database connection failure');
});

mongoose.connection.on('error', function (err) {
    logger.error('Mongoose connected error ' + err);
});

mongoose.connection.on('disconnected', function () {
    logger.error('Mongoose disconnected');
});
mongoose.connection.on('open', function () {
    console.log("数据库连接成功");
});
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        logger.info('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

const DB = class DB {
    constructor() {
        //存放数据连接对象，模拟连接池
        this.mongoClient = {};
        let filename = path.join(path.dirname(__dirname), 'table.conf.js');
        //数据库配置文件
        this.tabConf = require(filename);
    }
    /**
     * 初始化mongoose model
     * @method getConnection
     * @param {string} tbname 集合名称
     * @return {object } 连接Model
    */
    getConnection(tbname) {
        if (!tbname) return;
        if (!this.tabConf[tbname]) {
            logger.error('No table structure');
            return false;
        }
        let client = this.mongoClient[tbname];
        if (!client) {
            //构建Schema
            let schema = new mongoose.Schema(this.tabConf[tbname]),
                //构建Model
                client = mongoose.model(tbname, schema, tbname);
            //console.log(client);
            //扔进连接池
            this.mongoClient[tbname] = client;
            return client;
        } else {
            return client;
        }
    }
    /**
     * 插入单条数据
     * @method insert
     * @param {string} tbname 集合名称
     * @param {object} fields 数据键值对
     * @param {function} callback 回调函数
     * @return {void}
     */
    insert(tbname, fields, callback) {
        if (!fields) {
            callback && callback({ msg: "Field is not allowed for null" });
            return false;
        }
        //判断key是否合法
        let err_num = 0;
        for (let key of Object.keys(fields)) {
            if (key != "_id") {
                if (!this.tabConf[tbname].hasOwnProperty(key)) err_num++;
            }
        }
        if (err_num > 0) {
            callback && callback({ msg: `There are ${err_num} wrong fields` });
            return false;
        }
        let model = this.getConnection(tbname),
            entity = new model(fields);
        if (model) {
            entity.save((err, res) => {
                if (err) {
                    callback && callback(err)
                } else {
                    callback && callback(null, res);
                }
            })
        } else {
            callback && callback("The collections of configurations does not exist");
        }

    }

    /**
     * 保存多条数据
     * @method insertMany
     * @param {string} tbname 集合名称
     * @param {Array} docs 数据json
     * @param {function} callback 回调函数(err,docs)
     * @return {void}
     */
    insertMany(tbname, docs = [], callback) {
        if (docs.length == 0) {
            callback && callback({ msg: "JSON is not allowed for null" });
            return false;
        }
        //判断key是否合法
        let err_num = 0;
        docs.forEach(fields => {
            for (let key of Object.keys(fields)) {
                if (key != "_id") {
                    if (!this.tabConf[tbname].hasOwnProperty(key)) err_num++;
                }
            }
        })
        if (err_num > 0) {
            callback && callback({ msg: `There are ${err_num} wrong fields` });
            return false;
        }
        let model = this.getConnection(tbname);
        if (model) {
            model.insertMany(docs, (err, docs) => {
                if (err) {
                    callback && callback(err);
                } else {
                    callback && callback(null, docs);
                }
            })
        } else {
            callback && callback("The collections of configurations does not exist");
        }

    }

    /**
     * 更新数据
     * @method update
     * @param {string} tbname 集合名称
     * @param {object} conditions 条件数据键值对
     * @param {object} fields 更新数据键值对
     * @param {function} callback 回调函数(err,res)
     * @return {void}
     */
    update(tbname, conditions, fields, callback) {
        if (!tbname || !fields || !conditions) {
            callback && callback({ msg: 'Parameter error' });
            return false;
        }
        let model = this.getConnection(tbname);
        if (model) {
            model.update(conditions, { $set: fields }, { multi: true, upsert: true }, (err, res) => {
                if (err) {
                    callback && callback(err);
                } else {
                    callback && callback(null, res);
                }
            })
        } else {
            callback && callback("The collections of configurations does not exist");
        }

    }

    /**
     * 删除数据
     * @method remove
     * @param {string} tbname 集合名称
     * @param {object} conditions 条件数据键值对
     * @param {function} callback 回调函数(err,res)
     * @return {void}
     */
    remove(tbname, conditions, callback) {
        if (!conditions || !tbname) {
            callback && callback({ msg: 'Parameter error' });
            return false
        }
        let model = this.getConnection(tbname);
        if (model) {
            model.remove(conditions, (err, res) => {
                if (err) {
                    callback && callback(err);
                } else {
                    callback && callback(null, res);
                }
            })
        } else {
            callback && callback("The collections of configurations does not exist");
        }

    }

    /**
     * 查询数据
     * @method find
     * @param {string} tbname 集合名称
     * @param {object} conditions 条件键值对
     * @param {function} callback 回调函数(err,res)
     * @return {void}
     */
    find(tbname, conditions, callback) {
        let model = this.getConnection(tbname),
            _orderk = conditions["_orderk"],
            _ordert = conditions["_ordert"],
            query = null,
            __condtionParams = null,
            _condtion = null;   //高级配置中的内容
        if (model) {
            delete conditions["_orderk"];
            delete conditions["_ordert"];
            //处理高级配置
            if (conditions["__condtion"]) {
                _condtion = [...conditions["__condtion"]];
                __condtionParams = this.condParamsFactory(conditions, _condtion);
                delete conditions["__condtion"];
            }
            query = model.find(conditions);
            //根据高级配置生产query
            if (_condtion && _condtion.length > 0) {
                query = this.queryFactory(query, _condtion, __condtionParams);
            }
            if (_orderk && _ordert) {
                let _s = {};
                _s[_orderk] = _ordert;
                query = query.sort(_s);
            }
            query.exec((err, res) => {
                if (err) {
                    callback && callback(err);
                } else {
                    callback && callback(null, res);
                }
            })
        } else {
            callback && callback("The collections of configurations does not exist");
        }
    }

    /**
     * 查询单条数据   
     * @method find
     * @param {string} tbname 集合名称
     * @param {object} conditions 条件键值对
     * @param {function} callback 回调函数(err,res)
     * @return {void}
     */
    findOne(tbname, conditions, callback) {
        let model = this.getConnection(tbname);
        if (model) {
            model.findOne(conditions, (err, res) => {
                if (err) {
                    callback && callback(err);
                } else {
                    callback && callback(null, res);
                }
            })
        } else {
            callback && callback("The collections of configurations does not exist");
        }

    }

    /**
     * 根据主键_id查询数据
     * @method findById
     * @param {string} tbname 集合名称
     * @param {string} id 主键id值
     * @param {function} callback 回调函数(err,res)
     * @return {void}
     */

    findById(tbname, id, callback) {
        let model = this.getConnection(tbname);
        if (model) {
            model.findById(id, (err, res) => {
                if (err) {
                    callback && callback(err);
                } else {
                    callback && callback(null, res);
                }
            })
        } else {
            callback && callback("The collections of configurations does not exist");
        }

    }

    /**
     * 查询符合条件的文档数
     * @method count
     * @param {string} tbname 集合名称
     * @param {object} conditions 条件键值对
     * @param {function} callback 回调函数(err,res)
     * @return {void}
     */
    count(tbname, conditions, callback) {
        let model = this.getConnection(tbname);
        if (model) {
            model.count(conditions, (err, res) => {
                if (err) {
                    callback && callback(err);
                } else {
                    callback && callback(null, res);
                }
            })
        } else {
            callback && callback("The collections of configurations does not exist");
        }
    }

    /**
     * 分页查询
     * @method find4page
     * @param {string} tbname 集合名称
     * @param {object} conditions 条件键值对
     * @param {Number} pageIndex 当前页
     * @param {Number} pageSize 每页数据量
     * @param {function} callback 回调函数(err,res)
     */
    find4page(tbname, conditions, pageIndex, pageSize, callback) {
        let model = this.getConnection(tbname),
            _self = this,
            _orderk = conditions["_orderk"],
            _ordert = conditions["_ordert"],
            query = null,
            __condtionParams = null,
            queryCount = null,//用于查询总共数据量
            _condtion = null;   //高级配置中的内容
        if (model) {
            delete conditions["_orderk"];
            delete conditions["_ordert"];
            //处理高级配置
            if (conditions["__condtion"]) {
                _condtion = [...conditions["__condtion"]];
                __condtionParams = this.condParamsFactory(conditions, _condtion);
                delete conditions["__condtion"];
            }
            query = model.find(conditions);
            queryCount = model.find(conditions);
            //根据高级配置生产query
            if (_condtion && _condtion.length > 0) {
                query = this.queryFactory(query, _condtion, __condtionParams);
                queryCount = this.queryFactory(queryCount, _condtion, __condtionParams);
            }
            if (_orderk && _ordert) {
                let _s = {};
                _s[_orderk] = _ordert;
                query = query.sort(_s);
            }
            queryCount.count({}, function (err, count) {
                query.skip(pageSize * (pageIndex - 1))
                    .limit(pageSize)
                    .exec((err, res) => {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, res, count);
                        }
                    })
            });
        } else {
            callback && callback("The collections of configurations does not exist");
        }

    }

    /**
     * 执行数据库函数
     * @method eval
     * @param {string} fname 函数名称
     * @param {object} params 参数对象键值对
     * @param {function} callback 回调函数(err,res)
     * @return {void}
     */
    eval(fname, params, callback) {
        let str = `${fname}(${JSON.stringify(params)})`;
        mongoose.connection.db.eval(str, (err, res) => {
            if (err) {
                callback && callback(err)
            } else {
                callback && callback(null, res);
            }
        })
    }
    //以下为一些辅助方法，为db服务
    /**
     * query工厂，对高级配置的query就行加工
     * @param {Object} query1 mongoose的query对象
     * @param {JSON} _condtion 高级配置json
     * @return {Object} query 加工完成的query对象
     */
    queryFactory(query1, _condtion, condtionParams) {
        let condtion1 = _condtion.filter(x => x.c_type === "and"),  //并行条件
            condtion2 = _condtion.filter(x => x.c_type === "or");   //or条件
        query1 = this.andCondFactory(query1, condtion1, condtionParams);
        query1 = this.orCondFactory(query1, condtion2, condtionParams);
        return query1;
    }
    /**
     * 并行条件高级配置工厂
     * @param {Object} query1 mongoose的query对象
     * @param {JSON} condtion1 高级配置为and执行条件的json
     * @param {Object} condtionParams 参数key和值的映射
     * @return {Object} query 加工完成的query对象
     */
    andCondFactory(query1, condtion1, condtionParams) {
        if (condtion1 instanceof Array && condtion1.length > 0) {
            condtion1.forEach(ele => {
                let value = condtionParams[ele["c_valname"]] ? condtionParams[ele["c_valname"]] : "",
                    valexec = ele["c_valexec"];     //有值才执行0 ，无值得时候赋值为""  1
                switch (ele["c_optmark"]) {
                    case "regex": {
                        //模糊查询
                        valexec !== "0" ? query1 = query1.regex(ele["c_fldname"], value) :
                            value ? query1 = query1.regex(ele["c_fldname"], value) : "";
                        break;
                    }
                    case "ne": {
                        //不等于
                        valexec !== "0" ? query1 = query1.ne(ele["c_fldname"], value) :
                            value ? query1 = query1.ne(ele["c_fldname"], value) : "";
                        break;
                    }
                    case "gt": {
                        //大于
                        valexec !== "0" ? query1 = query1.gt(ele["c_fldname"], value) :
                            value ? query1 = query1.gt(ele["c_fldname"], value) : "";
                        break;
                    }
                    case "gte": {
                        //大于等于
                        valexec !== "0" ? query1 = query1.gte(ele["c_fldname"], value) :
                            value ? query1 = query1.gte(ele["c_fldname"], value) : "";
                        break;
                    }
                    case "lt": {
                        //小于
                        valexec !== "0" ? query1 = query1.lt(ele["c_fldname"], value) :
                            value ? query1 = query1.lt(ele["c_fldname"], value) : "";
                        break;
                    }
                    case "lte": {
                        //小于等于
                        valexec !== "0" ? query1 = query1.lte(ele["c_fldname"], value) :
                            value ? query1 = query1.lte(ele["c_fldname"], value) : "";
                        break;
                    }
                    case "exists": {
                        //不存在/存在 指定键的文档
                        if (typeof value !== "boolean") {
                            value === "false" ? false : true;
                        }
                        valexec !== "0" ? query1 = query1.exists(ele["c_fldname"], Boolean(value)) :
                            value ? query1 = query1.exists(ele["c_fldname"], Boolean(value)) : "";
                        break;
                    }
                    case "in": {
                        //包含于
                        if (value) {
                            if (!(value instanceof Array)) {
                                value = value.split(",");
                            }
                        } else {
                            value = [];
                        }
                        valexec !== "0" ? query1 = query1.in(ele["c_fldname"], value) :
                            value.length > 0 ? query1 = query1.in(ele["c_fldname"], value) : "";
                        break;
                    }
                    case "nin": {
                        if (value) {
                            if (!(value instanceof Array)) {
                                value = value.split(",");
                            }
                        } else {
                            value = [];
                        }
                        valexec !== "0" ? query1 = query1.nin(ele["c_fldname"], value) :
                            value.length > 0 ? query1 = query1.nin(ele["c_fldname"], value) : "";
                        break;
                    }
                }
            })
        }
        return query1;
    }
    /**
     * or条件高级配置工厂
     * @param {Object} query1 mongoose的query对象
     * @param {JSON} condtion1 高级配置为and执行条件的json
     * @param {Object} condtionParams 参数key和值的映射
     * @return {Object} query 加工完成的query对象
     */
    orCondFactory(query1, condtion1, condtionParams) {
        //query = query.or([{ sm_caption: { $regex: "管理" } }, { sm_pid: { $in: ['20180326000004'] } }]);
        if (condtion1 instanceof Array && condtion1.length > 0) {
            let _cd = [];
            condtion1.forEach(ele => {
                let value = condtionParams[ele["c_valname"]] ? condtionParams[ele["c_valname"]] : "",
                    valexec = ele["c_valexec"],     //有值才执行0 ，无值得时候赋值为""  1
                    optmark = ele["c_optmark"];
                switch (optmark) {
                    case "all":
                    case "ne":
                    case "gt":
                    case "gte":
                    case "lt":
                    case "lte":
                    case "regex":
                        {
                            if (valexec === "0") {
                                if (value === "") {
                                    break;
                                }
                            }
                            let c = {};
                            let _om = '$' + optmark;
                            c[ele["c_fldname"]] = {};
                            c[ele["c_fldname"]][_om] = value;
                            _cd.push(c);
                            break;
                        }
                    case "exists":
                        {
                            if (valexec === "0") {
                                if (value === "") {
                                    break;
                                }
                            }
                            let c = {};
                            let _om = '$' + optmark;
                            c[ele["c_fldname"]] = {};
                            if (typeof value === "boolean") {
                                c[ele["c_fldname"]][_om] = value;
                            } else {
                                c[ele["c_fldname"]][_om] = value === "false" ? false : true;
                            }
                            _cd.push(c);
                            break;
                        }
                    case "in":
                    case "nin": {
                        if (valexec === "0") {
                            if (value === "") {
                                break;
                            }
                        }
                        if (value) {
                            if (!(value instanceof Array)) {
                                value = value.split(",");
                            }
                        } else {
                            value = [];
                        }
                        let c = {};
                        let _om = '$' + optmark;
                        c[ele["c_fldname"]] = {};
                        c[ele["c_fldname"]][_om] = value;
                        _cd.push(c);
                        break;
                    }
                }
            })
            if (_cd.length > 0) {
                return query1.or(_cd);
            }
            return query1;
        } else {
            return query1;
        }
    }
    /**
     * 根据参数key和高级配置的参数可以，组装参数key和值的映射
     * @param {Object} conditions 前台传来的参数对象
     * @param {JSON} __condtion 高级配置组装的JSON数组
     * @return {Object} 参数key和值的映射
     */
    condParamsFactory(conditions, __condtion) {
        let result = {};
        if (__condtion.length > 0) {
            let keys = [];
            __condtion.forEach(ele => {
                let key = ele["c_valname"],
                    index = keys.findIndex(x => x === key);
                if (index < 0) {
                    keys.push(key);
                }
            });
            keys.forEach(x => {
                if (conditions[x] || conditions[x] === "") {
                    result[x] = conditions[x];
                    delete conditions[x];
                }
            })
        }
        return result;
    }
}
module.exports = new DB();