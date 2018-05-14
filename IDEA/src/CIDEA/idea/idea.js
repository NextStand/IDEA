/**
 * 日期：2018-01-09
 * 作者：BLUE
 * 描述：IDEA前台核心类
 *
 * @class idea IDEA前台核心类
 * @constructor
*/
import "./../extend"
import c from "./../cmd"
import t from "./../tools"
const idea = {
    name : 'idea',
    version : "1.0.1",
    install(Vue) {
        let s = this;
        /**
         * 数据接口
         * @param {string} coll 集合或者函数名称
         * @param {object|string} params 参数字符串或对象
         * @param {function} callback  回调函数(err,res)
         */
        Vue.prototype.$run4xml = function (coll, params, callback) {
            c.run4xml(Vue, coll, params, callback);
        }
        /**
         * 判断空并填充空字符
         * @param {any} strs1 判断对象
         * @param {string} def1 预填充字符
         * @return {string} 格式结果
         */
        Vue.prototype.$isnull = function (strs1, def1) {
            return t._isnull(strs1, def1);
        }
        /**
         * 解码字符串
         * @param {string} 预解密字符串
         */
        Vue.prototype.$tostr = function (str) {
            return t._tostr(str)
        }
        /**
         * 转码字符串
         * @param {string} 预转码字符串
         */
        Vue.prototype.$tohex = function (str) {
            return t._tohex(str)
        }
        /**
         * 格式化日期
         * @param {any} date1 预格式日期
         * @param {string} fmt1 格式字符串
         * @return {string } 当前日期格式结果
         */
        Vue.prototype.$fmtdate = function (date1, fmt1) {
            return t._fmtdate(date1, fmt1);
        }
        /**
         * 
         * @param {string} date11 格式字符串
         * @return {string } 当前日期格式结果
         */
        Vue.prototype.$todate = function (date11) {
            return t._todate(date11);
        }
        /**
         * 格式化浮点数
         * @param {string|number} flt1 预格式化字符或数字
         * @param {string} fmt12 格式字符 "#.##"
         * @return {string } 格式结果,小数位数不足以0补充
         */
        Vue.prototype.$fmtfloat = function (flt1, fmt12) {
            return t._fmtfloat(flt1, fmt12);
        }
        /**
        * 格式化浮点数
        * @param {string|number} flt1 预格式化字符或数字
        * @param {string} fmt12 格式字符 "#.##"
        * @return {string } 格式结果,排除0
        */
        Vue.prototype.$fmtfloatno0 = function (flt1, fmt12) {
            let rtsv1 = t._fmtfloat(flt1, fmt12);
            if (parseFloat(rtsv1) == 0) return "";
            else return rtsv1;
        }
        /**
       * 将字符格式成认人民币格式
       * @param {string|number} flt1 预格式化字符或数字
       * @return {string } 格式结果
       */
        Vue.prototype.$fmtmoney = function (flt1) {
            var res12 = t._fmtfloat(flt1, "#,##");
            return "￥" + res12;
        }
        /**
      * 将字符格式成认人民币格式
      * @param {string|number} flt1 预格式化字符或数字
      * @return {string } 格式结果,排除0
      */
        Vue.prototype.$fmtmoneyno0 = function (flt1) {
            var rtsv1 = t._fmtfloat(flt1, "#,##");
            if (parseFloat(rtsv1) == 0) return "";
            else return "<font color='#a8a8a8'>￥</font>" + rtsv1;
        }
        /**
         * 获取当前日期
         * @return {Date } 当前日期
         */
        Vue.prototype.$today = function () {
            return t._today();
        }
        /**
         * 获取当前日期
         * @return {Date} 当前日期
         */
        Vue.prototype.$monday = function () {
            return t._monday();
        }
        /**
         * 获取当前月份的开始日期
         * @return {Date} 
         */
        Vue.prototype.$monthstart = function () {
            return t._monthstart();
        }
        /**
        * 获取当前月份的结束日期
        * @return {Date} 
        */
        Vue.prototype.$monthend = function () {
            return t._monthend();
        }
        /**
         * 获取当前年份的开始日期
         * @return {Date} 
         */
        Vue.prototype.$yearstart = function () {
            return t._yearstart();
        }
        /**
         * 获取当前年份的结束日期
         * @return {Date} 
         */
        Vue.prototype.$yearend = function () {
            return t._yearend();
        }
        /**
         * 获取去年的开始日期
         * @return {Date} 
         */
        Vue.prototype.$lastyearstart = function () {
            return t._lastyearstart();
        }
        /**
        * 获取去年的结束日期
        * @return {Date}
        */
        Vue.prototype.$lastyearend = function () {
            return t._lastyearend();
        }
        /**
        * 获取上个月的开始日期
        * @return {Date}
        */
        Vue.prototype.$lastmonthstart = function () {
            return t._lastmonthstart();
        }
        /**
        * 获取上个月的结束日期
        * @return {Date}
        */
        Vue.prototype.$lastmonthend = function () {
            return t._lastmonthend();
        }
        /**
         * 获取下个月的开始日期
         * @return {Date}
         */
        Vue.prototype.$nextmonthstart = function () {
            return t._nextmonthstart();
        }
        /**
         * 获取下个月的结束日期
         * @return {Date}
         */
        Vue.prototype.$nextmonthend = function () {
            return t._nextmonthend();
        }
        /**
         * 获取某年某月的开始日期
         * @param {string|number} yy1 年份
         * @param {string|number} monthindex1 月份
         * @return {Date}
         */
        Vue.prototype.$monthxstart = function (yy1, monthindex1) {
            var now = new Date();
            var yy2 = t._isnull(yy1, now.getYear());
            var newd = new Date(yy2, Number(monthindex1) - 1, 1);
            return newd;
        }
        /**
         * 获取某年某月的结束日期
         * @param {string|number} yy1 年份
         * @param {string|number} monthindex1 月份
         * @return {Date}
         */
        Vue.prototype.$monthxend = function (yy1, monthindex1) {
            var now = new Date();
            var yy2 = t._isnull(yy1, now.getYear());
            var newd = null;
            if (monthindex1 == 12) newd = new Date(yy2 + 1, 0, 1); else newd = new Date(yy2, monthindex1, 1);
            return t._dateadd(newd, -1);
        }
        /**
         * 日期数据加减
         * @param  {Date|String} obj 日期数据
         * @param  {number} val 间隔差值（相减为负数）
         * @param {String} type 计算对象[ "y", "M", "d", "h", "m", "s", "ms" ]，默认为"d"（日）
         * @return {object} 计算结果
         */
        Vue.prototype.$dateadd = function (obj, val, type) {
            return t._dateadd1(obj, val, type);
        }
        /**
         * 将json格式化为树形结构数据
         * @param {JSON} data 预格式化json数据
         * @param {Object} attributes 格式化参数
         * @returns {JSON} 树形结构数据
         */
        Vue.prototype.$toTreeData = function (data, attributes) {
            return t._toTreeData(data, attributes);
        }
        /**
         * 格式化url地址
         * @param {string} url url地址
         * @return {object} 解析对象
         */
        Vue.prototype.$fmturl = function (url) {
            return t._fmturl(url);
        }
        /** 
         * JSON数组去重
         * @param: [array] json Array
         * @param: [string] 唯一的key名，根据此键名进行去重
         */
        Vue.prototype.$uniqueJSON = function (array, key) {
            return t._uniqueJSON(array, key)
        }
        /** 
         * 一般数组去重
         * @param: [array] Array
         */
        Vue.prototype.$uniqueArray = function (array) {
            return t._uniqueArray(array);
        }
        /**
         * cookie操作接口
         * @param {string} cname cookie名称
         * @param {string} cvalue cookie值
         * @param {number} exdays cookie有效天数 default 14
         */
        Vue.prototype.$cookie = function (cname, cvalue, exdays) {
            return t._cookie(cname, cvalue, exdays)
        }
        /**
         * 设置vue全局属性
         * @param {string} key 
         * @param {any} value 
         */
        Vue.prototype.$prop = function (key, value) {
            if (key && value) {
                Vue.prototype[key] = value;
            } else {
                return Vue.prototype[key];
            }
        }
    }
}
export default idea;