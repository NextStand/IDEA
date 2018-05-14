/**
 * 日期：2018-01-09
 * 作者：BLUE
 * 描述：IDEA前台数据接口类
 *
 * @class cmd IDEA前台数据接口类
 * @constructor
*/
const cmd = class cmd {
    name = 'cmd'
    version = "1.0.1"
    author = "BLUE"
    /**
     * 数据操作接口
     * @param {object} Vue
     * @param {string} coll 集合或者函数名称
     * @param {object} params 参数字符串或对象
     * @param {function} callback 回调函数(err,res)
     * @return void
     */
    run4xml(Vue, coll, params, callback) {
        let t = typeof (params);
        if (t == "string") {
            //get请求
            this._get(Vue, coll, params, callback);
        } else if (t == "object") {
            if (params == null) {
                //get请求
                this._get(Vue, coll, params, callback);
            } else {
                //post请求
                for (let key in params) {
                    if (Object.prototype.toString.call(params[key]) == "[object Array]") {
                        params[key] = JSON.stringify(params[key]);
                    }
                }
                this._post(Vue, coll, params, callback);
            }
        }
    }
    /**
     * get请求数据
     * @param {object} Vue 
     * @param {string} coll 集合或者函数名称
     * @param {object} params 参数字符串或对象
     * @param {function} callback 回调函数(err,res)
     * @return {void}
     */
    _get(Vue, coll, params, callback) {
        params = params || null;
        if (params) {
            params = this._parseJson(params);
        }
        let p = (params && { params }) || null;
        Vue.http.get(`xml/${coll}`, p, { emulateJSON: true }).then(res => {
            callback && callback(null, JSON.parse(res.bodyText) || res.bodyText)
        }).catch(res => {
            callback(res);
        })
    }
    /**
     * post请求数据
     * @param {object} Vue 
     * @param {string} coll 集合或者函数名称
     * @param {object} params 参数字符串或对象
     * @param {function} callback 回调函数(err,res)
     * @return {void}
     */
    _post(Vue, coll, params, callback) {
        Vue.http.post(`xml/${coll}`, params, { emulateJSON: true }).then(res => {
            callback && callback(null, JSON.parse(res.bodyText) || res.bodyText)
        }).catch(res => {
            callback(res);
        });
    }
    /**
     * 转换get请求参数部分为JSON
     * @param {string} str 参数字符串
     * @return {json}
     */
    _parseJson(str) {
        if (typeof (str) != "string") {
            return str;
        }
        let iterms = str.split("&");
        let arr, Json = {};
        for (var i = 0; i < iterms.length; i++) {
            arr = iterms[i].split("=");
            Json[arr[0]] = arr[1];
        }
        return Json;
    }
}

export default new cmd();