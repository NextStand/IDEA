/**
 * 日期：2018-01-07
 * 作者：BLUE
 * 描述：原生类型扩展
 *
*/
(function () {
    String.prototype.replaceAll2 = function (ov, nv) {
        var s1 = this;
        var i = s1.indexOf(ov);
        while (i >= 0) {
            s1 = s1.replace(ov, nv);
            i = s1.indexOf(ov);
        };
        return s1;
    };

    String.prototype.replaceAll = function (ov, nv) {
        var reg = new RegExp(ov, "gi");
        return this.replace(reg, nv);
    };

    String.prototype.timeStart = function () {
        var ti1 = this.trim();
        var tili = ti1.indexOf(" ");
        if (tili > 0) return ti1.substr(0, tili) + " 00:00:00";
        else return ti1 + " 00:00:00";
    };

    String.prototype.timeEnd = function () {
        var ti1 = this.trim();
        var tili = ti1.indexOf(" ");
        if (tili > 0) return ti1.substr(0, tili) + " 23:59:59";
        else return ti1 + " 23:59:59";
    };

    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };

    String.prototype.check = function () {
        var tv1 = this;
        if (tv1.indexOf("输入") == 0) tv1 = "";
        return tv1;
    };

    String.prototype.check = function () {
        var tv1 = this;
        if (tv1.indexOf("输入") == 0) tv1 = "";
        return tv1;
    };
    //数组去重
    Array.prototype.unique = function () {
        this.sort();
        var re = [this[0]];
        for (var i = 1; i < this.length; i++) {
            if (this[i] !== re[re.length - 1]) {
                re.push(this[i]);
            }
        }
        return re;
    }
    //扩展数组方法：查找指定元素的下标
    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    //扩展数组方法:删除指定元素
    Array.prototype.rmove = function (val) {
        var index = this.indexOf(val);
        while (index > -1) {
            this.splice(index, 1);
            index = this.indexOf(val);
        }
        return this;
    };
    //删除指定下标数组元素
    Array.prototype.removeAt = function (Index) {
        if (isNaN(Index) || Index > this.length) { return false; }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this[i] != this[Index]) {
                this[n++] = this[i]
            }
        }
        this.length -= 1
    }
    //删除无效的元素(null/"")
    Array.prototype.removeVoidElement = function () {
        for (var i = 0; i < this.length; i++) {
            if ("" == this[i] || null == this[i] || "null" == this[i]) {
                this.remove(this[i]);
            }
        }
    }
})()


