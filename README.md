# IDEA

> 作者：BLUE

> 文档日期：2018-04-10

> 描述：基于vue+node+mongo的一套基本开发引擎


## 目录
- 介绍
- 快速起步
- 方法和接口
- MONGO配置说明
- 开发完成之后的项目部署
- 组件库


## 1、介绍
IDEA引擎分为三个部分，前端、业务端和数据库端，基于vue-cli脚手架搭建的目录结构
开发环境：

- node v8.2.1
- vue v2.8.2
- MongoDB shell version: 3.0.6
- windows 10
#####  1.1 项目文件结构
![image](https://note.youdao.com/yws/api/personal/file/C8FC54050101455CA2951100D70C02C7?method=download&shareKey=8250be5735b17fdfc22919e536540e5b)

#####  1.2 前端部分
前端部分技术结构：

- 基本框架：[vue （2.5.13）](https://cn.vuejs.org/v2/api/) 
- 数据交互：[vue-resource（1.3.5）](https://www.npmjs.com/package/vue-resource)
- 前端路由：[vue-router（3.0.1](https://router.vuejs.org/zh-cn/)）
- 前端状态管理（可更换）：[ vuex（3.0.1）](https://vuex.vuejs.org/zh-cn/)
- 前端界面（可更换）：[ element-ui（2.3.2）](http://element.eleme.io/#/)

#####  1.3 业务部分
业务部分技术结构：

- 开发框架： [express（4.16.2）](http://www.expressjs.com.cn/)
- 数据操作： [mongoose（5.0.0-rc2）](http://www.nodeclass.com/api/mongoose.html)

#####  1.4 数据库
数据库采用mongoDB,
推荐使用【mongodbmanager】可视化工具

【说明】：

- 系统基于cookie验证登录状态，cookie根据服务器主板号和客户机IP共同加密生成
- cookie默认有效时间为20分钟，如果20分钟内没有任何操作，再次进行访问的时候将会退回到登录
- 服务端只对【public】和【static】文件夹进行了静态化
- 使用之前你应该对Vue一系列技术、mongoDB数据库、命令行，webpack自动构建工具等技术有所了解
- 为了时间的精确性，系统对时间精确到毫秒级别，所以希望在操作时间的时候传参以毫秒字符进行传递

【注意】：系统数据操作是基于数据模型的，也就是根目录下的【table.conf.js】文件中对每个集合的定义，如果在数据交换过程中出现了未在【table.conf.js】文件中出现的key时，系统将报错，除非【更多配置】中指定的参数名称和【函数】中自定义的参数名称

## 2、快速起步
#####  2.1 环境搭建

- 如果你没有node环境，请先搭建node环境，参考 [【如何搭建node环境】](https://blog.csdn.net/nextstand/article/details/53493441)
- 如果你没有安装MongoDB,先[【下载MongoDB】](https://www.mongodb.com/download-center?jmp=nav#atlas)，然后进行安装，这儿是[【安装配置参考】](https://www.yiibai.com/mongodb/mongodb_environment.html),安装完成之后，我们的环境就搭建完成了，现在准备启动数据库

```
//启动数据库CMD，假设数据库文件所在目录 “F:\IDEA\DATA”

mongd --dbpath F:\IDEA\DATA

```
如果想了解一些基本操作，可以参考[【MongoDB 使用手册】](https://segmentfault.com/a/1190000011195544)

我们可以将MongoDB写进系统服务中，以免每次都需要重新执行上面的操作，[【MongoDB 通过配置文件启动及注册服务】](https://segmentfault.com/n/1330000013067960)

如果想为数据库设置用户和密码，那么请参考[【mongo用户名和密码配置cmd+mongodbmanager】](https://segmentfault.com/n/1330000012691091),这儿也是通过命令配合可视化工具mongodbmanager进行的配置，如果你不了解mongodbmanager的基本使用，那就戳 [这儿](https://www.mongodbmanager.com/)


#####  2.2 启动项目

- 命令行进入到项目根目录安装所有依赖

```
npm install
```
- 所有依赖安装完成，我们启动业务层服务并启动页面服务

```
//启动业务层服务,执行server中的index.js,也就是服务端入口
//当CMD中提示OK 和 数据库连接成功时，说明服务端成功启动

node ../server/index.js

//启动页面服务，在项目根目录下执行
npm run dev

```

【提示】：

1. 服务端端口默认监听3000端口，如需修改监听端口，请进入server/index.js的尾部自行修改，由于客户端端口和服务端监听端口在开发期间不一致，则会出现跨域的问题，我们做了请求映射，所以当你修改了服务端监听端口的时候，请将config/index.js中的proxyTable中指定的映射端口修改成为服务端端口
2. 客户端端口默认为8080端口，如需修改，请进入config/index.js将dev属性中的端口修改为你想要的端口

- 完成了上面的操作之后，我们就可以在浏览器中http://localhost:8080/进行访问了

## 3、方法和接口

##### 3.1 方法
所有的方法均为vue的实例方法，采用vue方法扩展规范，以$符号开头
- $run4xml(coll, params, callback)
- $isnull(strs1, def1)
- $tohex(str)
- $tostr(str)
- $fmtdate(date1, fmt1)
- $fmtfloat(flt1, fmt12)
- $fmtfloatno0(flt1, fmt12)
- $fmtmoney(flt1)
- $fmtmoneyno0(flt1)
- $today()
- $monday()
- $monthstart()
- $monthend()
- $yearstart()
- $yearend()
- $lastyearstart()
- $lastyearend()
- $lastmonthstart()
- $lastmonthend()
- $nextmonthstart()
- $nextmonthend()
- $monthxstart(yy1, monthindex1)
- $monthxend(yy1, monthindex1)
- $dateadd(obj, val, type)
- $toTreeData(data, attributes)
- $fmturl(url)
- $uniqueJSON(array, key)
- $uniqueArray(array)
- $cookie(cname, cvalue, exdays)
- $prop(key, value)


##### 3.2 接口
接口是为了处理在配置生效之前需要的一些操作
- config
- login
- logout
- edtpwd
- upload/files
- upload/file
- 删除附件物理文件

### 3.3方法详解
**$run4xml(coll [, params][, callback][,tohex])**

通用数据接口，结合配置中的配置项实现数据交互,
- coll  <String> 【配置的集合或者函数名称】
- params <object|string> 【参数字符串或对象】字符串进行get请求，对象进行post请求
- callback <Function> 【==错误优先的回调函数==】 （err,res）res为数据
- tohex <boolean> 是否对post请求传输数据进行加密  默认true


```
 this.$run4xml("get_users_list", null, (err, res) => {
    if(!err){
        dosomthing();
    }else{
        throw new Error(err);
    }
 })
```
---
**$isnull(strs1 [, def1])**

判断空并填充空字符
- strs1  <any> 【预判断对象】
- def1 <string> 【预填充字符】

【提示】空格不认为是空

---
**$tohex(str)**

转码字符串
- str  <String> 【预转码字符串】


```
this.$tohex("hello world")

//~h`680065006c006c006f00200077006f0072006c006400
```
---
**$tostr(str)**

解码字符串
- str  <String> 【预解码字符串】


```
this.$tostr("~h`680065006c006c006f00200077006f0072006c006400")

//hello world
```
---
**$fmtdate(date1, fmt1)**

格式化日期
- date1  <Object|String> 【预格式日期】
- fmt1 <String> 【格式字符串】

```
this.$fmtdate(new Date(),'yyyy-mm-dd hh:nn:ss')
//2018-04-11 11:26:18

this.$fmtdate(new Date(),'YYYY年MM月DD日')
//二〇一八年四月十一日
```
- y-年
- m-月
- d-日
- h-时
- n-分
- s-秒

上面格式字符如若改成大写，则转换成中文

---
**$fmtfloat(flt1, fmt12)**

格式化浮点数，小数位数不足以0补充

- flt1  <String|Number> 【预格式化字符或数字】
- fmt12 <String> 【格式字符】 "#.##"

```
this.$fmtfloat(10.1,'#.###')

//10.100
```
---
**$fmtfloatno0(flt1, fmt12)**

格式化浮点数，格式结果,排除0

- flt1  <String|Number> 【预格式化字符或数字】
- fmt12 <String> 【格式字符】 "#.##"


```
this.$fmtfloatno0(10.10000,'#.##')

//10.10
```
---
**$fmtmoney(flt1)**

将字符格式成人民币格式

- flt1  <String|Number> 【预格式化字符或数字】
---
**fmtmoneyno0(flt1)**

将字符格式成人民币格式，格式结果,排除0

- flt1  <String|Number> 【预格式化字符或数字】

---
**$today()**

获取当前日期

---
**$monday()**

获取当前日期

---
**$monthstart()**

获取当前月份的开始日期

---
**$monthend()**

获取当前月份的结束日期

---
**$yearstart()**

获取当前年份的开始日期

---
**$yearend()**

获取当前年份的结束日期

---
**$lastyearstart()**

获取去年的开始日期

---
**$lastyearend()**

获取去年的结束日期

---
**$lastmonthstart()**

获取上个月的开始日期

---
**$lastmonthend()**

获取上个月的结束日期

----
**$nextmonthstart()**

获取下个月的开始日期

---
**$nextmonthend()**

获取下个月的结束日期

---
**$monthxstart(yy1, monthindex1)**

获取某年某月的开始日期

- yy1  <String|Number> 【年份】
- monthindex1  <String|Number> 【月份】 


---
**$monthxend(yy1, monthindex1)**

获取某年某月的结束日期

- yy1  <String|Number> 【年份】
- monthindex1  <String|Number> 【月份】 


---
**$dateadd(obj, val, type)**

日期数据加减

- obj  <Date|String> 【日期数据】
- val  <Number> 【间隔差值】 （相减为负数）
- type <String> 【计算对象】  [ "y", "M", "d", "h", "m", "s", "ms" ]，默认为"d"（日）

```
let result = this.$dateadd(new Date(),1,"M");
//2018-04-11

this.$fmtdate(result,'yyyy-mm-dd')
//2018-05-11
```
---
**$toTreeData(data [, attributes])**

将json格式化为树形结构数据

- obj  <JSON> 【预格式化json数据】
- attributes <Object> 【格式化参数】
- - id 【json主键key】 默认“_id”
- - pid 【json父子关系标识key】 默认“_pid”
- - rootId 【根节点id】 默认为“0”


```
let data = [
 {"_id":"20180326000001","cg_name":"IDEA角色管理","cg_pid":"0"},
 {"_id":"20180329000007","cg_name":"开发维护","cg_pid":"20180326000001"},
 {"_id":"20180402000001","cg_name":"测试角色","cg_pid":"20180326000001"}
]
this.$toTreeData(a, { pid: "cg_pid" })
/*
[{
  "_id":"20180326000001",
  "cg_name":"IDEA角色管理",
  "cg_pid":"0",
  "children":[
              {"_id":"20180329000007","cg_name":"开发维护","cg_pid":"20180326000001"},
              {"_id":"20180402000001","cg_name":"测试角色","cg_pid":"20180326000001"}
             ]
}]
*/
```
---
**$fmturl(url)**

格式化url地址

- url  <String> 【预格式化url地址】
---
**$uniqueJSON(array, key)**

JSON数组去重
- array  <Json> 【预去重数组】
- key <String> 【唯一的key名】 根据此键名进行去重


```
let json = [{a:1},{a:2},{a:3},{a:1}];

this.$uniqueJSON(json,"a");
//[{a:1},{a:2},{a:3}]
```

---
**$uniqueArray(array)**

一般数组去重
- array  <Array> 【预去重数组】


```
let array = [1,2,3,4,4];

this.$uniqueArray(array);
//[1,2,3,4]
```

---
**$cookie(cname [, cvalue][, exdays])**

cookie操作

- cname  <String> 【cookie名称】
- cvalue <String> 【cookie值】
- exdays <Number> 【cookie有效天数】 默认14

【提示】：忽略后面两个参数则为取值

---
**$prop(key [, value])**

全局属性操作

- key  <String> 【属性key】
- value <Any> 【属性值】

【提示】：忽略后面个参数则为取值


### 3.4接口详解

**/config**

新增Mongo配置，在参数对象中需要有opt=“ins”;

接收post请求，入库成功则返回请求传输过来的数据，否则返回错误信息对象

---
**/login**

用户登录接口

接收post请求，必须传递参数【uid】用户名 和【pwd】密码，验证成功则返回该登录者信息，否则返回错误信息对象

---

**/logout**

用户退出接口

接收post请求，成功则返回字符串bye，错误返回错误信息对象

---
**/edtpwd**

密码修改接口


接收post请求，必须传递参数【_id】用户id，【oldpwd】原始密码，【newpwd】新密码

修改成功返回字符串“ok”，否则返回错误信息对象

---

**/upload/files**

文件(附件)上传接口，会在【经过busi_attach】中留下记录,支持多个文件，限制数量为99

- 上传input的【name】必须为“files”
- 通过额外参数【traget】指定文件夹，默认“attach”，【da_billid】业务id

上传成功返回【文件存储路径】，多个文件路径以分号分隔，失败则无返回


```
<template>
    <el-upload
      action="/upload/files"
      name="files"
      list-type="picture-card"
      :multiple="true"
      :data="{
        target: "mps_test",
        da_billid: "20180130001"
      }"
      :before-remove="handleRemove"
      :on-success="handleSuccess"
      >
      <i class="el-icon-plus"></i>
    </el-upload>
</template>

<script>
export default {
  methods: {
   
    handleSuccess(response, file, fileList) {
      console.log(response);
    }
  }
};
</script>

//upload\mps_test\QQ图片20180125164852_1523428247818.jpg
```

---
**/upload/file**


文件(附件)上传接口，不会在【经过busi_attach】中留下记录,支持多个文件，限制数量为99

- 上传input的【name】必须为“files”
- 通过额外参数【traget】指定文件夹，默认“attach”
- 上传成功返回【文件存储路径】，多个文件路径以分号分隔，失败则无返回

---
**删除附件物理文件**

这是一个特殊的接口，可以删除服务器的物理文件，服务端限定了只能删除public文件夹下面的附件，但是这里也要注意避免用户输入路径进行文件删除或者请求数据被截获修改后删除一些意想不到的文件，所以该接口一定要 **慎重使用 ！！！**  **慎重使用 ！！！**  **慎重使用 ！！！** 重要的事情说三遍

```
this.$run4xml(
        "del_files_list",
        "da_path=" + 文件路径 + "&del=true",
        (err, res) => {
          console.log(res);
          //成功对象
        }
      );
```
上面请求的【del】参数为true时候会删除源文件，否则只删除附件表中的记录

**慎重使用啊 ！！！**  **慎重使用啊 ！！！**  **慎重使用啊 ！！！**



## 4、MONGO配置说明

### 4.1基础配置

IDEA中对集合支持9种操作类型的快速配置和两种配置类型，其中有一些配置在参数要求上面有一些特殊，下面将特殊的参数格式用特殊标记进行了标记
1. 增加单条数据
2. ==增加多条数据==
3. 查询数据
4. 按主键查询数据
5. ==查询分页数据==
6. 查询单条数据
7. 删除数据
8. 按主键修改数据
9. ==按条件修改数据==

以上列举的操作类型，除了特俗标记的2、5、9之外，其他的参数都是统一的按照对象或者字符串的形式进行传参，key对应数据库中的key即可，所有操作类型为数据查询的操作中，如果未在更多配置中指定的key都会被作为【全等于】过滤条件

【提示】：IDEA针对数据查询进行了增强，可以拥有更加灵活的配置，在系统中的【更多配置】进行配置，接下来对【更多配置】进行说明

**# 增加多条数据**

增加多条数据为了方便进行数据的导入导出而设计，但是参数我们需要进行一点特殊的处理
- 将每一条数据组装成一个对象，并放入一个数组中
- 将数据数组的参数key定义为“json”
- 建议使用对象的形式进行传参，系统会执行post请求，字符串传参由于是get请求，会由于数据量原因导致失败


```
let json = [
            {_id:"201804110001","code":"01"},
            {_id:"201804110002","code":"02"},
            {_id:"201804110003","code":"03"}
           ],
    params={
        json
    };
this.$run4xml("insert_many_data",params,(err,res)=>{
    if(!err){
        console.log(res) //成功返回“ok”
    }
})

```

---
**# 查询分页数据**

查询分页数据传参和响应都有特殊的地方

请求传入的参数应该包含【pageIndex】当前页和【pageSize】每页数据量，如果不传则当前页默认为1，每页数据量默认为20


```
let params={
    pageIndex:1,
    pageSize:15
}
```
响应数据为一个json数组，json数组的第一个元素为【{ "_count": 120 }】，该对象描述了总的数据量，“_count”为固定的key

---

**# 按条件修改数据**

按条件修改数据由于要确定修改对象和目标状态，为了API格式的统一，这儿也是在参数的key上面做了功夫，系统将以【_Cond】结束的参数名称作为了修改条件，所以在使用或者设计数据库字段的时候应该避开参数以【_Cond】结尾

例如：

```
let params={
    c_name_Cond:"hello",
    c_edu_Cond:"研究生",
    c_gender:"男",
    c_score:"90"
}
/*
    上面的参数对象将以 c_name="hello" 和 c_edu="研究生" 作为条件对象
    将过滤的结果的c_gender和c_score更新为指定的值
*/
```

### 4.2 更多配置
更多配置是对查询数据的一个扩展，对于查询数据可以配置【and操作】和【or操作】两种查询条件，每个字段的配置提供了9或10种配置，并且可以在【and操作】和【or操作】两种配置中进行切换
1. 等于（选择条件OR的时候存在）
2. 不等于
3. 大于
4. 小于
5. 小于等于
6. 大于等于
7. 模糊查询
8. 包含
9. 不包含
10. 是否存在

【说明】：

- AND条件不存在【等于】的配置，这是因为如果是等于的and操作，我们==只需要在参数对象中传入指定key就可以了==
- 上面的配置中【包含】【不包含】【是否存在】三个配置对参数格式有一点要求


【注意】：

- 【包含】【不包含】这两个配置在传递条件参数值的时候，如果参数值为多个值，请用【逗号】分隔
- 【是否存在】配置的参数值只能是布尔值才会生效

## 5、开发完成之后的项目部署

项目采用前端打包，后端部署的方式进行部署，具体请参照

[【Vue+Node+MongoDB从开发到正式部署】](https://segmentfault.com/a/1190000012492225)

## 6、组件库

##### 6.1 ueditor-富文本编辑器

---

> methods

- getAllHtml() 获得整个html的内容
- getContent() 获得内容
- setContent(content)   写入内容
- appendContent(content) 追加内容
- getContentTxt() 获得纯文本
- getPlainTxt() 获取带格式的纯文本
- getSltText() 获得当前选中的文本
- insertHtml(content) 插入给定的内容
- hasContents() 判断编辑器中是否有内容
- setFocus() 使编辑器获取焦点
- setBlur() 使编辑器失去焦点
- isFocus() 编辑器是否获得焦点
- setEnabled() 设置编辑器为可编辑
- setDisabled() 设置编辑器为不可编辑
- setHide() 隐藏编辑器
- setShow() 显示编辑器
- destroy() 销毁编辑器实例
