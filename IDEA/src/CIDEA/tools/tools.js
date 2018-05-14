/**
 * 日期：2018-01-09
 * 作者：BLUE
 * 描述：IDEA前台工具类
 *
 * @class tools IDEA工具类
 * @constructor
*/
const tools = class tools {
    name = 'tools'
    version = "1.0.1"
    /**
     * 判断空并填充空字符
     * @param {any} strs1 判断对象
     * @param {string} def1 预填充字符
     */
    _isnull(strs1, def1) {
        let isnil = false;
        if (strs1 == undefined || strs1 == null || strs1 == "undefined" || strs1 == "NaN" || strs1 == "Infinity" || strs1 == "&nbsp;" || strs1 == "&#160;" || strs1 == "BsonNull") {
            strs1 = "";
            isnil = true;
        };
        if (strs1 + "" == "" && def1 != undefined && def1 != "") strs1 = def1;
        if (isnil && def1 === 0) strs1 = def1;
        return strs1;
    }
    _myparseInt(oi1_, def1_) {
        let ov11 = oi1_,
            isstr = (typeof (oi1_) == "string"),
            def01 = 0;
        if (def1_) def01 = def1_; else def01 = 0;
        let oir1 = def01;
        if (!isstr) {
            try {
                oir1 = parseInt(oi1_);
                if (oir1 == "NaN") oir1 = def01;
                if (isNaN(oir1)) oir1 = def01;
            } catch (e) { } finally { };
            return oir1;
        };
        while (ov11.substr(0, 1) == "0") ov11 = ov11.substr(1);
        let i = ov11.indexOf("&");
        if (i >= 0) {
            ov11 = ov11.replaceAll("&nbsp;", "");
            ov11 = ov11.replaceAll("&#160;", "");
        };
        i = ov11.indexOf(",");
        if (i >= 0) {
            ov11 = ov11.replaceAll(",", "");
        };
        i = ov11.indexOf(" ");
        if (i >= 0) {
            ov11 = ov11.replaceAll(" ", "");
        };
        try {
            oir1 = parseInt(ov11);
            if (oir1 == "NaN") oir1 = def01;
            if (isNaN(oir1)) oir1 = def01;
        } catch (e) { } finally { };
        return oir1;
    }
    /**
     * 解码字符串
     * @param {string} 预解码字符串
     */
    _tostr(str) {
        let str2 = this._isnull(str, "") + "";
        if (str2 == "") return str2;
        //str2.indexOf('~h%60') == 0 为了支持火狐;
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
     * 转码字符串
     * @param {string} 预转码字符串
     */
    _tohex(str1) {
        let str = this._isnull(str1, "") + "";
        if (str == "") return str;
        if (str.indexOf('~h`') == 0) return str;
        let t, i, tl = 0, t0 = "", rs = [], t1 = "";
        for (i = 0; i < str.length; i++) {
            t = str.charCodeAt(i).toString(16);
            tl = t.length;
            switch (tl) {
                case 4: t0 = ""; break;
                case 2: t0 = "00"; break;
                case 1: t0 = "000"; break;
                case 3: t0 = "0"; break;
                default: t0 = "0000"; break;
            };
            t1 = t0 + t;
            rs[i] = t1.slice(2, 4) + t1.slice(0, 2);
        }
        return ('~h`' + rs.join(""));
    }
    _fs_(str1) {
        return "<span class=fontalternate>" + str1 + "</span>";
    }
    /**
     * 将数字年份转换汉字年份
     * @param {string} str001 年份字符串
     * @return {string } 转化后的汉字年份字符
     */
    _year2chinesenum(str001) {
        let s01 = "", s02 = "";
        for (let i = 0; i < (str001 + "").length; i++) {
            s02 = (str001 + "").substr(i, 1);
            switch (s02) {
                case "0": s01 += "〇"; break;
                case "1": s01 += "一"; break;
                case "2": s01 += "二"; break;
                case "3": s01 += "三"; break;
                case "4": s01 += "四"; break;
                case "5": s01 += "五"; break;
                case "6": s01 += "六"; break;
                case "7": s01 += "七"; break;
                case "8": s01 += "八"; break;
                case "9": s01 += "九"; break;
                default: s01 += s02; break;
            };
        };
        return s01;
    };
    /**
     * 将数字月份转换汉字月份
     * @param {string} str001 月份份字符串
     * @return {string } 转化后的汉字月份字符
     */
    _month2chinesenum(str001) {
        let s01 = this._year2chinesenum(str001);
        if (("" + str001).substr(0, 1) == "0") s01 = s01.substr(1);
        if (s01.length == 2) {
            if (s01.substr(0, 1) == "一") {
                s01 = "十" + s01.substr(1, 1);
            } else {
                s01 = s01.substr(0, 1) + "十" + s01.substr(1, 1);
            };
            if (s01.substr(s01.length - 1) == "〇") s01 = s01.substr(0, s01.length)
        };
        return s01;
    };
    /**
     * 将数字日转换汉字日份
     * @param {string} str001 日字符串
     * @return {string } 转化后的汉字日字符
     */
    _today_date(date1) {
        let src11 = date1 + " 00:00:00", sep1 = "-";
        if (src11.indexOf(sep1) < 0) sep1 = ".";
        if (src11.indexOf(sep1) < 0) sep1 = "/";
        let i1 = 0;
        i1 = src11.indexOf(sep1);
        let year1 = src11.substr(0, i1);
        src11 = src11.substr(i1 + 1);
        i1 = src11.indexOf(sep1);
        let month1 = src11.substr(0, i1);
        src11 = src11.substr(i1 + 1);
        //2008-10-13T22:35:01.7630000+08:00
        i1 = src11.indexOf("T");
        if (i1 < 0) i1 = src11.indexOf(" ");
        let day1 = src11.substr(0, i1),
            now = new Date(),
            date00 = new Date(now.getYear(), now.getMonth(), now.getDate()),
            date11 = new Date(year1, (parseInt(month1) - 1), day1);
        return parseInt(date00 - date11) / 86400000;
    };
    /**
     * 获取当前格式日期
     * @param {string} date111 格式字符串
     * @return {string } 当前格式日期
     */
    _todate(date111) {
        let mii = parseInt(this._fmtdate(date111, "m")) - 1;
        if (mii >= 12) mii = 0;
        let date11 = new Date(this._fmtdate(date111, "yyyy"), mii,
            this._fmtdate(date111, "d"),
            this._fmtdate(date111, "h"),
            this._fmtdate(date111, "n"),
            this._fmtdate(date111, "s"));
        return date11;
    };
    /**
     * 日期格式化
     * @param {any} date22 日期参数
     * @param {string} fmt1 格式化格式
     * @return {string } 格式结果
     */
    _fmtdate(date22, fmt1) {

        let date1 = "", i1 = 0;
        if (typeof (date22) == "object" && date22 != null) {
            i1 = parseInt(date22.getMonth());
            i1 = i1 + 1;
            date1 = date22.getFullYear() + "-" + i1 + "-" + date22.getDate() + " " +
                date22.getHours() + ":" + date22.getMinutes() + ":" + date22.getSeconds();
        } else {
            date1 = this._isnull(date22, "");
            if (date1 == "") { return _v[1]; };
            let date11 = "";
            i1 = ("" + date1).indexOf(" ");
            if (i1 > 0) {
                date11 = date1.substr(0, i1);
                date1 = date1.substr(i1 + 1);
            } else {
                date11 = date1;
                date1 = "";
            };
            date1 = date11 + " " + date1;
            if ((date1 + "_").indexOf("<") >= 0) return date1;
            if ((date1 + "_").indexOf("&") >= 0) return date1;
            date1 = date1.trim();
        };
        if (this._isnull(date1, "") == "") { return ""; };
        // fmt1 : yy y m d h n s : yy:2位年 /p表示人性化 今天 昨天 前天 明天 后天
        let src11 = date1 + " 00:00:00",
            sep1 = "-";
        if (src11.indexOf(sep1) < 0) sep1 = ".";
        if (src11.indexOf(sep1) < 0) sep1 = "/";

        i1 = src11.indexOf(sep1);
        let year1 = this._myparseInt(src11.substr(0, i1));
        src11 = src11.substr(i1 + 1);
        i1 = src11.indexOf(sep1);
        let month1 = src11.substr(0, i1);
        month1 = this._myparseInt(src11.substr(0, i1));
        src11 = src11.substr(i1 + 1);

        if (year1 <= 1900) { return ""/*_v[1] */; };
        //2008-10-13T22:35:01.7630000+08:00

        i1 = src11.indexOf("T");
        if (i1 < 0) i1 = src11.indexOf(" ");

        let day1 = (src11.substr(0, i1));
        if (day1.substr(0, 1) == "0") day1 = day1.substr(1);
        src11 = src11.substr(i1 + 1);

        i1 = src11.indexOf(":");
        let hour1 = (src11.substr(0, i1));
        if (hour1.substr(0, 1) == "0") hour1 = hour1.substr(1);
        src11 = src11.substr(i1 + 1);

        i1 = src11.indexOf(":");
        let minute1 = (src11.substr(0, i1));
        if (minute1.substr(0, 1) == "0") minute1 = minute1.substr(1);
        src11 = src11.substr(i1 + 1);
        //console.log(src11+"-->"+minute1);
        i1 = src11.indexOf(".");
        let second1 = src11.replace("00:00:00", "");
        if (i1 > 0) second1 = src11.substr(0, i1);
        if (second1.substr(0, 1) == "0") second1 = second1.substr(1);
        let res1 = fmt1,
            res111 = fmt1;
        i1 = res1.indexOf("/p");

        let nowwk = new Date(year1, month1 - 1, day1),
            weeki = nowwk.getDay(),
            weeks = "";
        switch (weeki) {
            case 0: { weeks = "日"; weeki = 7; } break;
            case 1: weeks = "一"; break;
            case 2: weeks = "二"; break;
            case 3: weeks = "三"; break;
            case 4: weeks = "四"; break;
            case 5: weeks = "五"; break;
            case 6: weeks = "六"; break;
        };

        let now = new Date(),
            now_hour = now.getHours(),
            now_minute = now.getMinutes(),
            thisy2 = now.getFullYear(),
            ii1 = 0,
            thism1 = now.getMonth() + 1,
            res11 = "";
        if (i1 > 0) {
            i1 = res1.indexOf("m");
            if (i1 > 0) {
                if (thisy2 == year1) {
                    ii1 = res1.indexOf("d");
                    if (ii1 > 0) {
                        if (thism1 == month1) {
                            res11 = this._fs_("<b>本月</b>");
                            res1 = res1.substr(ii1);
                        } else
                            if (thism1 == (month1 + 1)) {
                                res11 = this._fs_("上个月");
                                res1 = res1.substr(ii1);
                            } else
                                if (thism1 == (month1 - 1)) {
                                    res11 = this._fs_("下个月");
                                    res1 = res1.substr(ii1);
                                } else
                                    if (thism1 == (month1 - 1)) {
                                        res11 = this._fs_("二个月后");
                                        res1 = res1.substr(ii1);
                                    }
                    } else {
                        res11 = this._fs_("<b>今年</b>");
                        res1 = res1.substr(i1);
                    };
                } else
                    if (thisy2 == (year1 + 1)) {
                        res11 = this._fs_("去年");
                        res1 = res1.substr(i1);
                    } else
                        if (thisy2 == (year1 + 2)) {
                            res11 = this._fs_("前年");
                            res1 = res1.substr(i1);
                        } else
                            if (thisy2 == (year1 - 1)) {
                                res11 = this._fs_("明年");
                                res1 = res1.substr(i1);
                            } else
                                if (thisy2 == (year1 - 2)) {
                                    res11 = this._fs_("后年");
                                    res1 = res1.substr(i1);
                                };
            };
        };

        res1 = res1.replace("yyyy", year1);
        res1 = res1.replace("YYYY", this._year2chinesenum(year1));

        res111 = res111.replace("yyyy", year1);
        res111 = res111.replace("YYYY", this._year2chinesenum(year1));

        res1 = res1.replace("yy", (year1 + "").substr(2, 2));
        res1 = res1.replace("YY", this._year2chinesenum((year1 + "").substr(2, 2)));

        res111 = res111.replace("yy", (year1 + "").substr(2, 2));
        res111 = res111.replace("YY", this._year2chinesenum((year1 + "").substr(2, 2)));

        res1 = res1.replace("y", year1);
        res1 = res1.replace("Y", this._year2chinesenum(year1));
        res111 = res111.replace("y", year1);
        res111 = res111.replace("Y", this._year2chinesenum(year1));

        res1 = res1.replace("ww", weeks);
        res111 = res111.replace("ww", weeks);

        res1 = res1.replace("W", weeks);
        res111 = res111.replace("W", weeks);

        res1 = res1.replace("w", weeki);
        res111 = res111.replace("w", weeki);

        var aa1 = "00" + month1;
        res1 = res1.replace("mm", aa1.substr(aa1.length - 2, 2));
        res1 = res1.replace("MM", this._month2chinesenum(aa1.substr(aa1.length - 2, 2)));

        res111 = res111.replace("mm", aa1.substr(aa1.length - 2, 2));
        res111 = res111.replace("MM", this._month2chinesenum(aa1.substr(aa1.length - 2, 2)));

        res1 = res1.replace("m", month1);
        res1 = res1.replace("M", this._month2chinesenum(month1));

        res111 = res111.replace("m", month1);
        res111 = res111.replace("M", this._month2chinesenum(month1));

        aa1 = "00" + day1;
        res1 = res1.replace("dd", aa1.substr(aa1.length - 2, 2));
        res1 = res1.replace("DD", this._month2chinesenum(aa1.substr(aa1.length - 2, 2)));

        res111 = res111.replace("dd", aa1.substr(aa1.length - 2, 2));
        res111 = res111.replace("DD", this._month2chinesenum(aa1.substr(aa1.length - 2, 2)));

        res1 = res1.replace("d", day1);
        res1 = res1.replace("D", this._month2chinesenum(day1));

        res111 = res111.replace("d", day1);
        res111 = res111.replace("D", this._month2chinesenum(day1));

        aa1 = "00" + hour1;
        res1 = res1.replace("hh", aa1.substr(aa1.length - 2, 2));
        res1 = res1.replace("HH", this._month2chinesenum(aa1.substr(aa1.length - 2, 2)));

        res111 = res111.replace("hh", aa1.substr(aa1.length - 2, 2));
        res111 = res111.replace("HH", this._month2chinesenum(aa1.substr(aa1.length - 2, 2)));

        res1 = res1.replace("h", hour1);
        res1 = res1.replace("H", this._month2chinesenum(hour1));

        res111 = res111.replace("h", hour1);
        res111 = res111.replace("H", this._month2chinesenum(hour1));

        aa1 = "00" + minute1;
        res1 = res1.replace("nn", aa1.substr(aa1.length - 2, 2));
        res1 = res1.replace("NN", this._month2chinesenum(aa1.substr(aa1.length - 2, 2)));

        res111 = res111.replace("nn", aa1.substr(aa1.length - 2, 2));
        res111 = res111.replace("NN", this._month2chinesenum(aa1.substr(aa1.length - 2, 2)));

        res1 = res1.replace("n", minute1);
        res1 = res1.replace("N", this._month2chinesenum(minute1));

        res111 = res111.replace("n", minute1);
        res111 = res111.replace("N", this._month2chinesenum(minute1));

        aa1 = (second1 > 9 ? second1 : "0" + second1);
        res1 = res1.replace("ss", aa1);//printme(second1+","+ aa1 +","+res1);
        res1 = res1.replace("SS", this._month2chinesenum(aa1.substr(aa1.length - 2, 2)));

        res111 = res111.replace("ss", aa1.substr(aa1.length - 2, 2));
        res111 = res111.replace("SS", this._month2chinesenum(aa1.substr(aa1.length - 2, 2)));

        res1 = res1.replace("s", second1);
        res1 = res1.replace("S", this._month2chinesenum(second1));

        res111 = res111.replace("s", second1);
        res111 = res111.replace("S", this._month2chinesenum(second1));

        res111 = res111.replace("/p", "");

        let res2 = "";
        i1 = res1.indexOf("/p");
        let hasp = i1 > 0;
        // "y/m/d/p hh:mm"
        if (i1 > 0) {
            res2 = res1.substr(0, i1);
            res1 = res1.substr(i1 + 2);
            i1 = this._today_date(year1 + "-" + month1 + "-" + day1);
            switch (i1) {
                case 0: { res2 = this._fs_("<b>今天</b>"); res11 = ""; break; };
                case 1: { res2 = this._fs_("昨天"); res11 = ""; break; };
                case 2: { res2 = this._fs_("前天"); res11 = ""; break; };
                case 3: { res2 = this._fs_("三天前"); res11 = ""; break; };
                case 4: { res2 = this._fs_("四天前"); res11 = ""; break; };
                case 5: { res2 = this._fs_("五天前"); res11 = ""; break; };
                case 6: { res2 = this._fs_("六天前"); res11 = ""; break; };
                case 7: { res2 = this._fs_("一周前"); res11 = ""; break; };
                case 8: { res2 = this._fs_("八天前"); res11 = ""; break; };
                case 9: { res2 = this._fs_("九天前"); res11 = ""; break; };
                case 10: { res2 = this._fs_("十天前"); res11 = ""; break; };
                case 14: { res2 = this._fs_("二周前"); res11 = ""; break; };
                case 15: { res2 = this._fs_("半月前"); res11 = ""; break; };
                case -1: { res2 = this._fs_("明天"); res11 = ""; break; };
                case -2: { res2 = this._fs_("后天"); res11 = ""; break; };
                case -3: { res2 = this._fs_("三天后"); res11 = ""; break; };
                case -4: { res2 = this._fs_("四天后"); res11 = ""; break; };
                case -5: { res2 = this._fs_("五天后"); res11 = ""; break; };
                case -6: { res2 = this._fs_("六天后"); res11 = ""; break; };
                case -7: { res2 = this._fs_("一周后"); res11 = ""; break; };
                case -8: { res2 = this._fs_("八天后"); res11 = ""; break; };
                case -9: { res2 = this._fs_("九天后"); res11 = ""; break; };
                case -10: { res2 = this._fs_("十天后"); res11 = ""; break; };
                case -14: { res2 = this._fs_("二周后"); res11 = ""; break; };
                case -15: { res2 = this._fs_("半月后"); res11 = ""; break; };
            };
        };
        //if (res2!="") res11 = "" ;
        if ((hasp) && ((res2.indexOf("今天") > 0) || (res2.indexOf("昨天") > 0) || (res2.indexOf("明天") > 0))) {
            if (res2.indexOf("昨天") > 0) hour1 = this._myparseInt(hour1, 0) - 24;
            if (res2.indexOf("明天") > 0) hour1 = this._myparseInt(hour1, 0) + 24;
            if (now_hour == hour1) {
                var mi1 = this._myparseInt(now_minute, 0) - this._myparseInt(minute1, 0);
                if (mi1 == 0) {
                    res11 = ""; res2 = ""; res1 = this._fs_("1分钟前");
                } else
                    if (mi1 > 0) {
                        res11 = ""; res2 = "";
                        if (mi1 <= 2) res1 = this._fs_("2分钟前");
                        else if (mi1 <= 3) res1 = this._fs_("3分钟前");
                        else if (mi1 <= 4) res1 = this._fs_("4分钟前");
                        else if (mi1 <= 5) res1 = this._fs_("5分钟前");
                        else if (mi1 <= 10) res1 = this._fs_("约10分钟前");
                        else if (mi1 <= 15) res1 = this._fs_("约15分钟前");
                        else if (mi1 <= 30) res1 = this._fs_("约半小时前");
                        else if (mi1 <= 45) res1 = this._fs_("约45分钟前");
                        else res1 = this._fs_("约1小时前");
                    } else {
                        res11 = ""; res2 = "";
                        if (mi1 >= -2) res1 = this._fs_("2分钟后");
                        else if (mi1 >= -3) res1 = this._fs_("3分钟后");
                        else if (mi1 >= -4) res1 = this._fs_("4分钟后");
                        else if (mi1 >= -5) res1 = this._fs_("5分钟后");
                        else if (mi1 >= -10) res1 = this._fs_("约10分钟后");
                        else if (mi1 >= -15) res1 = this._fs_("约15分钟后");
                        else if (mi1 >= -30) res1 = this._fs_("约半小时后");
                        else if (mi1 >= -45) res1 = this._fs_("约45分钟后");
                        else res1 = this._fs_("约1小时后");
                    };
            } else {
                let mi1 = this._myparseInt(now_hour, 0) - this._myparseInt(hour1, 0);
                if (mi1 > 0) {
                    res11 = ""; res2 = "";
                    if (mi1 <= 1) res1 = this._fs_("约1小时前");
                    else if (mi1 <= 2) res1 = this._fs_("约2小时前");
                    else if (mi1 <= 3) res1 = this._fs_("约3小时前");
                    else if (mi1 <= 4) res1 = this._fs_("约4小时前");
                    else if (mi1 <= 5) res1 = this._fs_("约5小时前");
                    else if (mi1 <= 6) res1 = this._fs_("约6小时前");
                    else if (mi1 <= 7) res1 = this._fs_("约7小时前");
                    else if (mi1 <= 8) res1 = this._fs_("约8小时前");
                    else if (mi1 <= 9) res1 = this._fs_("约9小时前");
                    else if (mi1 <= 10) res1 = this._fs_("约10小时前");
                    else if (mi1 <= 12) res1 = this._fs_("约半天前");
                    else if (mi1 <= 15) res1 = this._fs_("约15小时前");
                    else if (mi1 <= 18) res1 = this._fs_("约18小时前");
                    else res1 = this._fs_("约一天前");
                } else {
                    res11 = ""; res2 = "";
                    if (mi1 >= -1) res1 = this._fs_("约1小时后");
                    else if (mi1 >= -2) res1 = this._fs_("约2小时后");
                    else if (mi1 >= -3) res1 = this._fs_("约3小时后");
                    else if (mi1 >= -4) res1 = this._fs_("约4小时后");
                    else if (mi1 >= -5) res1 = this._fs_("约5小时后");
                    else if (mi1 >= -6) res1 = this._fs_("约6小时后");
                    else if (mi1 >= -7) res1 = this._fs_("约7小时后");
                    else if (mi1 >= -8) res1 = this._fs_("约8小时后");
                    else if (mi1 >= -9) res1 = this._fs_("约9小时后");
                    else if (mi1 >= -10) res1 = this._fs_("约10小时后");
                    else if (mi1 >= -12) res1 = this._fs_("约半天后");
                    else if (mi1 >= -15) res1 = this._fs_("约15小时后");
                    else if (mi1 >= -18) res1 = this._fs_("约18小时后");
                    else res1 = this._fs_("约一天前");
                };
            };
        };
        if (hasp) return "<span class=mypsndate title='" + res111 + "'>" + res11 + res2 + res1 + "</span>";
        else return res11 + res2 + res1;
    }
    _convertCurrency(currencyDigits) {
        let MAXIMUM_NUMBER = 99999999999.99,
            CN_ZERO = "零",
            CN_ONE = "壹",
            CN_TWO = "贰",
            CN_THREE = "叁",
            CN_FOUR = "肆",
            CN_FIVE = "伍",
            CN_SIX = "陆",
            CN_SEVEN = "柒",
            CN_EIGHT = "捌",
            CN_NINE = "玖",
            CN_TEN = "拾",
            CN_HUNDRED = "佰",
            CN_THOUSAND = "仟",
            CN_TEN_THOUSAND = "万",
            CN_HUNDRED_MILLION = "亿",
            CN_SYMBOL = "(大写): 人民币",
            CN_DOLLAR = "元",
            CN_TEN_CENT = "角",
            CN_CENT = "分",
            CN_INTEGER = "整";
        // Variables:
        let integral,
            // Represent integral part of digit number.
            decimal,
            // Represent decimal part of digit number.
            outputCharacters,
            // The output result.
            parts,
            digits, radices, bigRadices, decimals,
            zeroCount,
            i, p, d,
            quotient, modulus;
        // Validate input string:
        currencyDigits = currencyDigits.toString();
        if (currencyDigits == "") {
            //alert("Empty input!");
            return "";
        };
        if (currencyDigits.match(/[^,.\d]/) != null) {
            //alert("Invalid characters in the input string!");
            return "";
        };
        if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
            //alert("Illegal format of digit number!");
            return "";
        };
        // Normalize the format of input digits:
        currencyDigits = currencyDigits.replace(/,/g, "");
        // Remove comma delimiters.
        currencyDigits = currencyDigits.replace(/^0+/, "");
        // Trim zeros at the beginning.
        // Assert the number is not greater than the maximum number.
        if (Number(currencyDigits) > MAXIMUM_NUMBER) {
            alert("Too large a number to convert!");
            return "";
        };
        // Process the coversion from currency digits to characters:
        // Separate integral and decimal parts before processing coversion:
        parts = currencyDigits.split(".");
        if (parts.length > 1) {
            integral = parts[0];
            decimal = parts[1];
            // Cut down redundant decimal digits that are after the second.
            decimal = decimal.substr(0, 2);
        } else {
            integral = parts[0];
            decimal = "";
        };
        // Prepare the characters corresponding to the digits:
        digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN,
            CN_EIGHT, CN_NINE);
        radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
        bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
        decimals = new Array(CN_TEN_CENT, CN_CENT);
        // Start processing:
        outputCharacters = "";
        // Process integral part if it is larger than 0:
        if (Number(integral) > 0) {
            zeroCount = 0;
            for (i = 0; i < integral.length; i++) {
                p = integral.length - i - 1;
                d = integral.substr(i, 1);
                quotient = p / 4;
                modulus = p % 4;
                if (d == "0") zeroCount++; else {
                    if (zeroCount > 0) outputCharacters += digits[0];
                    zeroCount = 0;
                    outputCharacters += digits[Number(d)] + radices[modulus];
                };
                if (modulus == 0 && zeroCount < 4) outputCharacters += bigRadices[quotient];
            };
            outputCharacters += CN_DOLLAR;
        };
        // Process decimal part if there is:
        if (decimal != "") {
            for (i = 0; i < decimal.length; i++) {
                d = decimal.substr(i, 1);
                if (d != "0") outputCharacters += digits[Number(d)] + decimals[i];
            };
        };
        // Confirm and return the final output string:
        if (outputCharacters == "") outputCharacters = CN_ZERO + CN_DOLLAR;
        if (decimal == "") outputCharacters += CN_INTEGER;
        outputCharacters = CN_SYMBOL + outputCharacters;
        return outputCharacters;
    }

    _myparseFloat(oi1_, def1_) {
        let isstr = (typeof (oi1_) == "string"), def01;
        if (def1_) def01 = def1_; else def01 = 0;
        let oir1 = def01;
        if (!isstr) {
            try {
                oir1 = parseFloat(oi1_);
                if (oir1 == "NaN") oir1 = def01;
                if (isNaN(oir1)) oir1 = def01;
            } catch (e) { } finally { };
            return oir1;
        };

        let ods1 = oi1_;
        try {
            let i = ods1.indexOf("</font>");
            if (i > 0) ods1 = ods1.substr(i + 7);
            i = ods1.indexOf("&");
            if (i >= 0) {
                ods1 = ods1.replaceAll("&nbsp;", "");
                ods1 = ods1.replaceAll("&#160;", "");
            };
            i = ods1.indexOf(",");
            if (i >= 0) ods1 = ods1.replaceAll(",", "");
            i = ods1.indexOf(" ");
            if (i >= 0) ods1 = ods1.replaceAll(" ", "");
            oir1 = parseFloat(ods1);
            if (oir1 == "NaN") oir1 = def01;
            if (isNaN(oir1)) oir1 = def01;
        } catch (e) { } finally { };
        return oir1;
    }
    /**
     * @param {string|number} flt1 预格式化字符或数字
     * @param {string} fmt12 格式字符 "#.##"
     * @return {string } 格式结果,小数位数不足以0补充
     */
    _fmtfloat(flt1, fmt12) {
        let ischinese = false,
            fmt123 = fmt12.toLowerCase();
        ischinese = fmt123.indexOf("c") >= 0;
        fmt123 = fmt123.replace("c", ".");
        let val001 = "_" + flt1;
        if (val001.indexOf(",") >= 0) val001 = val001.replaceAll(",", "");
        val001 = val001.substr(1);
        try {
            let hasflag = false,
                haszero = false,
                fmti = fmt123.indexOf("0");
            haszero = fmti >= 0;
            fmt123 = fmt123.replace("0", "");
            fmti = fmt123.indexOf(".");
            if (fmti < 0) {
                fmti = fmt123.indexOf(",");
                if (fmti >= 0) hasflag = true;
            };
            if (fmti >= 0) fmti = fmt123.substr(fmti + 1).length; else fmti = 0;
            val001 = parseFloat(val001);
            if ((val001 == 0) && (haszero)) return "";

            val001 = (Number(val001)).toFixed(parseInt(fmti));
            if (hasflag) {
                fmti = val001.indexOf(".");
                if (fmti < 0) fmti = val001.length;
                if ((fmti > 3) && (fmti <= 6)) {
                    val001 = val001.substr(0, fmti - 3) + "," + val001.substr(fmti - 3);
                } else
                    if ((fmti > 6) && (fmti <= 9)) {
                        val001 = val001.substr(0, fmti - 6) + "," + val001.substr(fmti - 6, 3) + "," + val001.substr(fmti - 3);
                    } else
                        if ((fmti > 9) && (fmti <= 12)) {
                            val001 = val001.substr(0, fmti - 9) + "," + val001.substr(fmti - 9, 3) + "," + val001.substr(fmti - 6, 3) + "," + val001.substr(fmti - 3);
                        } else
                            if ((fmti > 12)) {
                                val001 = val001.substr(0, fmti - 12) + "," + val001.substr(fmti - 12, 3) + "," + val001.substr(fmti - 9, 3) + "," + val001.substr(fmti - 6, 3) + "," + val001.substr(fmti - 3);
                            };
                val001 = val001.replace("-,", "-");
            };
        } catch (e) { } finally { };
        if (ischinese) {
            val001 = val001.replaceAll(",", "");
            let i = val001.indexOf("."),
                part1 = "",
                part2 = "";
            if (i >= 0) {
                part1 = val001.substr(0, i);
                part2 = val001.substr(i + 1);
            } else {
                part1 = val001;
                part2 = "";
            };
            if (part2 != "") part2 = "点" + this._year2chinesenum(part2);
            part1 = this._convertCurrency(part1);
            i = part1.indexOf("元");
            part1 = part1.substr(0, i);
            part1 = part1.replaceAll("零", "〇");
            part1 = part1.replaceAll("壹", "一");
            part1 = part1.replaceAll("贰", "二");
            part1 = part1.replaceAll("叁", "三");
            part1 = part1.replaceAll("肆", "四");
            part1 = part1.replaceAll("伍", "五");
            part1 = part1.replaceAll("陆", "六");
            part1 = part1.replaceAll("柒", "七");
            part1 = part1.replaceAll("捌", "八");
            part1 = part1.replaceAll("玖", "九");
            part1 = part1.replaceAll("拾", "十");
            part1 = part1.replaceAll("佰", "百");
            part1 = part1.replaceAll("仟", "千");
            part1 = part1.replaceAll("万", "万");
            part1 = part1.replaceAll("亿", "亿");
            return part1 + part2;
        } else return val001
    }
    /**
     * 获取当前日期
     * @return {object } 当前日期
     */
    _today() {
        let now = new Date(),
            date00 = new Date(now.getYear(), now.getMonth(), now.getDate());
        return date00;
    }
    /**
     * 
     */
    _monday() {
        let now = new Date(),
            date00 = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            week001 = date00.getDay();
        if ((week001) == 0) week001 = 6; else week001 = week001 - 1;
        let date11 = new Date(Date.parse(date00) - (1 * 1000 * 60 * 60 * 24) * week001);
        return date11;
    }
    /**
     * 
     */
    _monthstart(month1) {
        let now = new Date(),
            date00 = now;
        if (typeof (month1) == "object") {
            now = month1;
            date00 = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
            let mi = this._myparseInt(month1, -1);
            mi = mi - 1;
            if (mi < 0) mi = now.getMonth();
            date00 = new Date(now.getFullYear(), mi, 1);
        };
        return date00;
    }
    /**
     * 
     */
    _monthend(month1) {
        let now = new Date(),
            date00 = now;
        if (typeof (month1) == "object") {
            now = month1;
            date00 = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
            let mi = this._myparseInt(month1, -1);
            mi = mi - 1;
            if (mi < 0) mi = now.getMonth();
            let date00 = new Date(now.getFullYear(), mi, 1);
        };
        let oldmth = date00.getMonth(),
            date11 = new Date(Date.parse(date00) + (1 * 1000 * 60 * 60 * 24) * 31);
        if (date11.getMonth() != oldmth) date11 = new Date(Date.parse(date00) + (1 * 1000 * 60 * 60 * 24) * 30);
        if (date11.getMonth() != oldmth) date11 = new Date(Date.parse(date00) + (1 * 1000 * 60 * 60 * 24) * 29);
        if (date11.getMonth() != oldmth) date11 = new Date(Date.parse(date00) + (1 * 1000 * 60 * 60 * 24) * 28);
        return date11;
    }
    /**
     * 
     */
    _yearstart() {
        let now = new Date(),
            date00 = new Date(now.getFullYear(), 0, 1);
        return date00;
    }
    /**
     * 
     */
    _yearend() {
        let now = new Date(),
            date00 = new Date(now.getFullYear(), 11, 31);
        return date00;
    }
    /**
     * 
     */
    _lastyearstart() {
        let now = new Date(),
            date00 = new Date(now.getFullYear() - 1, 0, 1);
        return date00;
    }
    _lastyearend() {
        let now = new Date(),
            date00 = new Date(now.getFullYear() - 1, 11, 31);
        return date00;
    }
    _lastmonthstart(td1) {
        let now = new Date();
        if (td1) now = td1;
        let date00 = new Date(now.getYear(), now.getMonth(), 1),
            oldmth = date00.getMonth(),
            year1 = date00.getYear();
        oldmth--;
        if (oldmth < 0) {
            oldmth = 11;
            year1--;
        };
        let date11 = new Date(year1, oldmth, 1);
        return date11;
    }
    _lastmonthend(td1) {
        let now = new Date();
        if (td1) now = td1;
        let date00 = new Date(now.getYear(), now.getMonth(), 1),
            oldmth = date00.getMonth(),
            date11 = new Date(Date.parse(date00) - (1 * 1000 * 60 * 60 * 24) * 1);
        return date11;
    }
    _nextmonthstart(td1) {
        let now = new Date();
        if (td1) now = td1;
        let date00 = new Date(now.getFullYear(), now.getMonth(), 1),
            oldmth = date00.getMonth(),
            date11 = new Date(Date.parse(date00) + (1 * 1000 * 60 * 60 * 24) * 28);
        if (date11.getMonth() == oldmth) date11 = new Date(Date.parse(date00) + (1 * 1000 * 60 * 60 * 24) * 29);
        if (date11.getMonth() == oldmth) date11 = new Date(Date.parse(date00) + (1 * 1000 * 60 * 60 * 24) * 30);
        if (date11.getMonth() == oldmth) date11 = new Date(Date.parse(date00) + (1 * 1000 * 60 * 60 * 24) * 31);
        return date11;
    }
    _nextmonthend(td1) {
        let now = new Date();
        if (td1) now = td1;
        now = this._nextmonthstart(now);
        now = this._nextmonthstart(now);
        let date11 = new Date(Date.parse(now) - (1 * 1000 * 60 * 60 * 24) * 1);
        return date11;
    }
    _dateadd(date111, num1) {
        let date11 = this._todate(date111);
        date11 = new Date(Date.parse(date11) + (1 * 1000 * 60 * 60 * 24) * this._myparseFloat(num1, 0));
        return date11;
    }
    /**
      * 日期数据加减
      * @param  {Date|String} obj 日期数据
      * @param  {number} val 间隔差值（相减为负数）
      * @param {String} type 计算对象[ "y", "M", "d", "h", "m", "s", "ms" ]，默认为"d"（日）
      * @return {object} 计算结果
      */
    _dateadd1(obj, val, type) {
        type = type || "d";
        val = parseInt(val, 10);
        if (!val) return obj;
        if ("string" === typeof obj) obj = new Date(obj);
        switch (type) {
            case "d": obj.setDate(obj.getDate() + val); break;
            case "M": obj.setMonth(obj.getMonth() + val); break;
            case "y": obj.setYear(obj.getYear() + val); break;
            case "h": obj.setHours(obj.getHours() + val); break;
            case "m": obj.setMinutes(obj.getMinutes() + val); break;
            case "s": obj.setSeconds(obj.getSeconds() + val); break;
            case "ms": obj.setMilliseconds(obj.getMilliseconds() + val); break;
        }
        return obj;
    }
    /**
     * 格式化url地址
     * @param {string} url url地址
     * @return {object} 解析对象
     */
    _fmturl(url) {
        url = url || location.search.substring(1);
        let arrPair = url.split(/[\&\?]/g),
            args = {}, idx;
        for (let i = 0; i < arrPair.length; i++) {
            idx = arrPair[i].indexOf('=');
            if (idx == -1) continue;
            let pname = arrPair[i].substring(0, idx),
                pval = arrPair[i].substring(idx + 1);
            args[pname] = pval;
        }
        return args;
    }
    /**
     * cookie操作接口
     * @param {string} cname cookie名称
     * @param {string} cvalue cookie值
     * @param {number} exdays cookie有效天数 default
     */
    _cookie(cname, cvalue, exdays) {
        if (cvalue || exdays) {
            //设置cookie
            return this._setCookie(cname, cvalue, exdays);
        } else {
            return this._getCookie(cname);
        }
    }
    /**
     * 获取cookie
     * @param {string} cname cookie名称
     * @returns {string} cookie值
     */
    _getCookie(cname) {
        let name = cname + "=",
            ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    }
    /**
     * 设置cookie
     * @param {string} cname cookie名称
     * @param {string} cvalue cookie值
     * @param {number} exdays cookie有效天数 default 14
     */
    _setCookie(cname, cvalue, exdays) {
        exdays = exdays || 14;
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
        return cvalue;
    }
    /**
     * 将json格式化为树形结构数据
     * @param {JSON} data 预格式化json数据
     * @param {Object} attributes 格式化参数
     * @returns {JSON} 树形结构数据
     */
    _toTreeData(data, attributes) {
        attributes = Object.assign({
            id: '_id',
            pid: 'pid',
            rootId: 0
        }, attributes)
        if ((data instanceof Array) && data.length > 0) {
            let resData = data,
                tree = [];
            for (let i = 0; i < resData.length; i++) {
                if (resData[i][attributes.pid] == attributes.rootId) {
                    resData[i]["children"] = new Array();
                    let obj = resData[i];
                    tree.push(obj);
                    resData.splice(i, 1);
                    i--;
                }
            }
            function run(chiArr) {
                if (resData.length !== 0) {
                    for (let i = 0; i < chiArr.length; i++) {
                        for (let j = 0; j < resData.length; j++) {
                            if (chiArr[i][attributes.id] === resData[j][attributes.pid]) {
                                resData[j]["children"] = new Array()
                                let obj = resData[j];
                                chiArr[i].children.push(obj);
                                resData.splice(j, 1);
                                j--;
                            }
                        }
                        run(chiArr[i].children);
                    }
                }
            }
            run(tree);
            return tree;
        } else {
            return new Array();
        }
    }
    /** 
     * JSON数组去重
     * @param: [array] json Array
     * @param: [string] 唯一的key名，根据此键名进行去重
     */
    _uniqueJSON(array, key) {
        let result = [array[0]];
        for (let i = 1; i < array.length; i++) {
            let item = array[i];
            let repeat = false;
            for (let j = 0; j < result.length; j++) {
                if (item[key] == result[j][key]) {
                    repeat = true;
                    break;
                }
            }
            if (!repeat) {
                result.push(item);
            }
        }
        return result;
    }
    /** 
     * 数组去重
     * @param: [array] Array
     */
    _uniqueArray(array) {
        let n = {}, r = [], len = array.length, val, type;
        for (let i = 0; i < array.length; i++) {
            val = array[i];
            type = typeof val;
            if (!n[val]) {
                n[val] = [type];
                r.push(val);
            } else if (n[val].indexOf(type) < 0) {
                n[val].push(type);
                r.push(val);
            }
        }
        return r;
    }
}
export default new tools();