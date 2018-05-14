/**
 * 日期：2018-01-24
 * 作者：BLUE
 * 描述：服务端操作类，封装一些公用工具
 *
 * @class HandleHelper 服务端工具类
 * @constructor
*/
const crypto = require('crypto');
const exec = require('child_process').exec;
const des = require("./modules/des");
const path = require('path');
const fs = require('fs');
const HandleHelper = class HandleHelper {
    /**
     * 解码前台加密字符串
     * @param {string} str 预解码字符串
     * @return {string} 解码明文
     */
    tostr(str) {
        let str2 = this.isnull(str, "") + "";
        if (str2 == "") return str2;
        if (str2.indexOf('~h`') == 0 || str2.indexOf('~h%60') == 0) {
            if (str2.indexOf('~h%60') == 0) str2 = str2.substr(5); else str2 = str2.substr(3);
            if (str2 != '') {
                let st, t, i, rs = [];
                st = '';
                for (i = 1; i <= str2.length / 4; i++) {
                    rs[i * 3 - 3] = "%u";
                    rs[i * 3 - 2] = str2.slice(4 * i - 2, 4 * i);
                    rs[i * 3 - 1] = str2.slice(4 * i - 4, 4 * i - 2);
                };
                st = rs.join("");
                st = unescape(st);
                return (st);
            } else return ('');
        } else return str2;
    }
    /**
     * 填充空字符
     * @param {string} strs1 预判断字符
     * @param {string} def1 填充字符
     * @return {string}
     */
    isnull(strs1, def1) {
        let isnil = false;
        if (strs1 == undefined || strs1 == null || strs1 == "undefined" || strs1 == "NaN" || strs1 == "Infinity" || strs1 == "&nbsp;" || strs1 == "&#160;" || strs1 == "BsonNull") {
            strs1 = "";
            isnil = true;
        };
        if (strs1 + "" == "" && def1 != undefined && def1 != "") strs1 = def1;
        if (isnil && def1 === 0) strs1 = def1;
        return strs1;
    }
    /**
     * MD5加密字符串
     * @param {string} s1 预加密字符
     * @return {string}
     */
    hex4md5(s1) {
        let md5 = crypto.createHash("md5");
        md5.update(s1);
        let str = md5.digest('hex'),
            s = str.toUpperCase();
        return s;
    }
    /**
     * 处理参数数据类型
     * @param {string} col 集合名称
     * @param {object} param 参数对象
     * @return {object} 处理过后的数据对象
     */
    do4dtype(tbname, param) {
        let filename = path.join(path.dirname(__dirname), 'table.conf.js');
        //数据库配置文件
        let tabConf = require(filename),
            tbcfg = tabConf[tbname];
        if (!tbcfg) {
            //logger.error('No table structure');
            return false;
        } else {
            for (let key in param) {
                if (key === "__condtion") {
                    continue;
                } else {
                    param[key] = this.tostr(param[key]);
                }
            }
            for (let key in tbcfg) {
                let ktype = tbcfg[key].toLowerCase();
                switch (ktype) {
                    case "date":
                        param[key] ? param[key] = new Date(Number(param[key])) : "";
                        break;
                    case "boolean":
                    case "bool":
                        param[key] ? param[key] = Boolean(param[key]) : "";
                        break;
                    case "number":
                    case "int":
                    case "num":
                        param[key] ? param[key] = Number(param[key]) : "";
                        break;
                    case "string":
                        param[key] ? param[key] = new String(param[key]) : "";
                        break;
                }
            }
            return param;
        }
    }
    /**
     * 获取设备CPU序列号
     * @param {function} callback 执行回调
     * @return null
     */
    getboardid(callback) {
        let _cmd = 'wmic CPU get ProcessorID';
        let child_process = exec(_cmd, function (error, stdout, stderr) {
            if (stderr) {
                callback && callback(stderr);
            } else {
                child_process.kill();//杀死子进程
                stdout += '1B3E1EE9BFF86431DEA6B181365BA65F';
                callback && callback(null, stdout);
            }

        });
    }
    /**
     * 生成cookie加密信息
     * @param {string} cip 客户端ip
     * @param {function} callback 回调函数
     */
    mkCookie(cip, callback) {
        this.getboardid((err, r) => {
            if (err) {
                callback && callback(err)
            } else {
                let _s = des.e("_validuser_", r + cip);
                callback && callback(null, _s);
            }
        })
    }
    /**
     * 解码Cookie
     * @param {string} s 加密的cookie信息
     * @param {string} cip 客户端ip
     * @param {function} callback 回调函数 err,r
     * @return {null}
     */
    decCookie(s, cip, callback) {
        this.getboardid((err, r) => {
            if (err) {
                callback && callback(err)
            } else {
                let _s = des.d(s, r + cip);
                callback && callback(null, _s);
            }
        })
    }
    /**
     * 同步创建文件夹
     * @param {string} path 文件夹创建路径
     */
    mkdirSync(path1, params) {
        path1 = path.normalize(path1);
        params = params || { remove: false };
        let r = params.remove;
        try {
            fs.accessSync(path1);
            if (r) {
                fs.unlinkSync(path1);
                fs.mkdirSync(path1);
            }
        } catch (e) {
            fs.mkdirSync(path1);
        }
    }
}
module.exports = new HandleHelper();