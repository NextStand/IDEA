function get_groupusers(obj) {
    var gid = obj["gid"];
    if (gid) {
        var uids = db.comp_groupuser.find({ gu_gid: gid }, { gu_uid: 1, _id: 0 });
        return uids;

    } else {
        return [];
    }
}

db.eval('get_groupusers({gid:"20180326000006"})')


function get_addgusers(obj) {
    var gid = obj["gid"] || "";
    if (gid === "") {
        return [];
    } else {
        var uids = [],
            result = [];
        db.comp_groupuser.find({ gu_gid: gid }, { gu_uid: 1, _id: 0 }).forEach(function (ele) {
            uids.push(ele["gu_uid"]);
        });
        db.comp_sysuser.find({ _id: { $nin: uids } }, { cu_password: -1 }).forEach(function (ele) {
            result.push(ele);
        })
        return result;
    }
}


function edt_groupmenu(obj) {
    try {
        var gid = obj["gid"] || "";
        var midArr = obj["mid"].split(",") || "";
        var cid = obj["cid"] || "";
        if (gid && midArr && cid) {
            db.comp_groupmenu.remove({ cm_gid: gid });
            var _ids = [];
            midArr.forEach(function (x) {
                var idcode = db.eval('get_pkid({pk_name:"comp_groupmenu"})');
                db.comp_groupmenu.insert({
                    "_id": idcode,
                    "cm_gid": gid,
                    "cm_mid": x,
                    "cm_createuid": "201802040001",
                    "cm_createdate": new Date()
                })
                _ids.push(idcode);
            })
            return _ids;
        } else {
            return "error"
        }
    } catch (e) {
        return "error"
    }

}

var idcode = db.edt_groupmenu('get_pkid({gid:"1111",cid:"121212",midArr:"1,2,3"})');


/**
 * 根据登录者id获取菜单权限
 */
function get_groupmenu(obj) {
    try {
        var uid = obj["uid"] || "";
        if (uid) {
            //查询登录者所在的分组
            var gArr = [];
            var menuArr = [];
            var result = [];
            db.comp_groupuser.find({ gu_uid: { $in: [uid] } }, { gu_gid: 1, _id: 0 }).forEach(function (ele) {
                gArr.push(ele["gu_gid"]);
            })
            //查询角色菜单
            db.comp_groupmenu.find({ cm_gid: { $in: gArr } }, { cm_mid: 1, _id: 0 }).forEach(function (ele) {
                menuArr.push(ele["cm_mid"]);
            })
            //菜单数组去重复
            for (var i = 0; i < menuArr.length; i++) {
                if (menuArr.indexOf(menuArr[i]) != i) {
                    menuArr.splice(i, 1);
                    i--;
                }
            }
            menuArr.forEach(function (menuid) {
                var curMenu = db.sys_menu.findOne({ _id: menuid });
                result.push(curMenu);
            })
            for (var i = 0; i < result.length; i++) {
                var curMenu = result[i];
                var pid = curMenu["sm_pid"];
                if (pid !== "0") {
                    var pMenu = db.sys_menu.findOne({ _id: pid });
                    result.push(pMenu);
                }
            }
            return result;
            /* (function a(n){
                if(n === result.length){
                    return result;
                }
                var curMenu = result[n];
                var pid = curMenu["sm_pid"];
                if(pid !== "0"){
                    var pMenu = db.sys_menu.findOne({ _id: pid });
                    result.push(pMenu);
                }
                a(n++);
            })(0) */
        } else {
            return [];
        }
    } catch (error) {
        return error;
    }
}


function uniqueJSON(array, key) {
    /** 
     * JSON数组去重
    * @param: [array] json Array
    * @param: [string] 唯一的key名，根据此键名进行去重
    */
    var result = [array[0]];
    for (var i = 1; i < array.length; i++) {
        var item = array[i];
        var repeat = false;
        for (var j = 0; j < result.length; j++) {
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

function uniqueArray(array) {
    /** 
     * 数组去重
     * @param: [array] Array
     */
    var n = {}, r = [], len = array.length, val, type;
    for (var i = 0; i < array.length; i++) {
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

function get_mongcondtion(obj) {
    /**
     * 获取mongo配置信息
     */
    try {
        var fid = obj["f_id"] || "";
        if (fid) {
            var curCfg = db.mongocfig.findOne({ "f_id": fid });
            if (curCfg) {
                var curCfg_id = curCfg._id.str;
                curCfg["__condtion"] = [];
                db.mongocondtion.find({ c__id: curCfg_id }).forEach(function(ele){
                    curCfg["__condtion"].push(ele)
                });
                return curCfg;
            } else {
                return [];
            }
        }
    } catch (error) {
        return [];
    }
}

/**
 * query.ne("_id","20180326000004").exec((err, res)  //不等于
 * query.gt("_id","20180326000007").exec((err, res)  //大于
 * query.gte("_id","20180326000007").exec((err, res)  //大于等于
 * query.lt("_id","20180326000007").exec((err, res)  //小于
 * query.lte("_id","20180326000007").exec((err, res)  //小于等于
 * query.regex("sm_caption","管").exec((err, res)     //模糊查询
 * query.exists("sm_router1",false).exec((err, res)   //不存在/存在 指定键的文档
 * query.in("_id",['20180326000004','20180326000006']).exec((err, res)  //in操作
 * query.nin("_id",['20180326000004','20180326000006']).exec((err, res)  //not in操作
 * 
 * query = query.or([{ sm_caption: { $regex: "管理" } }, { sm_pid: { $in: ['20180326000004'] } }]);
 */