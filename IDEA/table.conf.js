module.exports = {
  //mongo配置信息
  "mongocfig": {
    "f_id": "String",              //配置名称id
    "f_type": "Number",            //配置类型(0:集合,:1:函数)
    "f_name": "String",            //集合或函数名称
    "f_optres": "String",          //操作类型 函数:(返回类型:string,json), 集合:(ins,edtk,edtc,delk, delc, qry, qryp)
    "f_fldorder": "String",        //排序字段
    "f_ordertype": "string",       //排序方式排序方式（1正序  -1倒序）
    "f_cfgtype": "String",         //配置类型（0开发配置  1系统配置）
    "f_porttype": "String",        //接口类型（0验证接口  1公用接口）
    "f_remark": "String",           //备注
    "f_edtdate": "date",           //创建日期
    "f_edtman": "String"           //创建人
  },
  //mongo高级配置
  "mongocondtion": {
    "_id": "String",                //主键
    "c__id": "String",              //基础配置id
    "c_fldname": "String",          //用于查询条件的key
    "c_type": "String",             //操作类型  and  或者  or
    "c_optmark": "String",          //操作符
    "c_optname": "String",          //操作符描述
    "c_valname": "String",          //参数名称
    "c_valexec": "String",          //是否有值执行（0是，1否）
    "c_edtdate": "date",             //创建/修改日期
    "c_edtuid": "String"             //创建/修改人id
  },
  //生的id代码信息
  "pk_code": {
    "_id": "String",               //集合名称
    "k_len": "Number",            //长度
    "k_curr": "String",           //当前代码
    "k_date": "String",           //当前日期
    "k_fmt": "String"             //类型
  },
  //系统用户
  "comp_sysuser": {
    "_id": "String",               //主键id
    "cu_usercode": "String",       //用户登录代码
    "cu_realname": "String",        //用户真实名称
    "cu_password": "String",       //密码
    "cu_contact": "String",        //联系方式
    "cu_sex": "string",            //性别
    "cu_state": "string",          //状态（0允许登录，1禁止登录，2冻结）
    "cu_photo": "String",          //头像地址
    "cu_regdate": "date",           //注册日期
    "cu_createuid": "String",       //创建者id
  },
  //人员和分组映射
  "comp_groupuser": {
    "_id": "String",                //主键id
    "gu_uid": "String",             //用户id
    "gu_gid": "String",             //分组id
    "gu_createuid": "String",       //创建者id
    "gu_createdate": "Date"         //创建日期    
  },
  //用户分组
  "comp_group": {
    "_id": "String",                //主键id
    "cg_name": "String",            //分组名称
    "cg_pid": "String",             //分组父节点id
    "cg_remark": "String",          //分组备注
    "cg_createuid": "String",       //创建者id
    "cg_createdate": "Date"         //分组创建日期
  },
  //分组和权限映射
  "comp_groupmenu": {
    "_id": "String",                //主键id
    "cm_gid": "String",             //分组id
    "cm_mid": "String",             //权限菜单id
    "cm_createuid": "String",       //创建者id
    "cm_createdate": "Date"         //创建日期
  },
  //系统菜单
  "sys_menu": {
    "_id": "String",               //主键id
    "sm_pid": "String",             //菜单父ID
    "sm_caption": "String",        //菜单名称
    "sm_router": "String",         //菜单路由
    "sm_order": "Number",          //菜单排序
    "sm_icon": "String",           //菜单图标
    "sm_color": "String",           //菜单前景色
    "sm_bgcolor": "String",         //菜单背景色
    "sm_createuid": "String",       //菜单创建人id
    "sm_createdate": "Date",        //菜单创建日期
  },
  //文件系统附件信息
  "busi_attach": {
    "_id": "String",               //附件ID
    "da_billid": "String",         //对应业务单据系统编号ID
    "da_tagid": "String",          //存的表名
    "da_origname": "String",        //原始文件名         
    "da_filename": "String",       //文件名称
    "da_extname": "String",        //文件扩展后缀名
    "da_path": "String",            //文件存放路径
    "da_size": "Number",           //文件大小
    "da_date": "date"              //上传日期
  },
  //图标库
  "sys_icons": {
    "_id": "String",                //主键id
    "si_icon": "String"             //图标class名称
  }
}