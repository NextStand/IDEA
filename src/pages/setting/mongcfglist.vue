<template>
  <div>
    <div style="padding:5px;overflow:hidden">
      <el-input style="width:250px;float:right" size="mini" placeholder="请输入查询内容" v-model="key1" class="input-with-select">
        <el-button @click="(pageIndex = 1) && loadme()" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-table :data="tableData" border stripe style="width: 100%" size="mini" :highlight-current-row="true">
      <el-table-column prop="order" label="序号" width="50" fixed></el-table-column>
      <el-table-column prop="f_id" label="配置名称id" fixed width="150"></el-table-column>
      <el-table-column prop="f_type" label="类型" width="70" :filters="[{ text: '集合', value: '0' }, { text: '函数', value: '1' }]"
        :filter-method="filterType" :formatter="formatterType"></el-table-column>
      <el-table-column prop="f_name" label="集合或函数名称" width="130"></el-table-column>
      <el-table-column prop="f_optres" label="操作或返回类型" width="130" :filters="figArr" :filter-method="filterBtype" :formatter="formatterBtype"></el-table-column>
      <el-table-column prop="f_cfgtype" label="配置性质" width="100" :filters="[{ text: '开发配置', value: '0' }, { text: '系统配置', value: '1' }]"
        :filter-method="filterTag" :formatter="formatterVal"></el-table-column>
      <el-table-column prop="f_porttype" label="开放性质" width="100" :filters="[{ text: '验证接口', value: '0' }, { text: '公用接口', value: '1' }]"
        :filter-method="filterPort" :formatter="formatterPort"></el-table-column>
      <el-table-column prop="f_edtman" label="配置人" width="100"></el-table-column>
      <el-table-column prop="f_edtdate" label="配置日期" :formatter="formatterDate" width="100"></el-table-column>
      <el-table-column prop="f_fldorder" label="排序字段"></el-table-column>
      <el-table-column prop="f_ordertype" label="排序规则" width="90" :filters="[{ text: '升序', value: '1' }, { text: '降序', value: '-1' }]"
        :filter-method="filterOrd" :formatter="formatterOrd"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <span title="编辑" @click="edit(scope.row)" style="cursor:pointer" class="color-blue" type="text" size="small">编辑</span>
          <span title="删除" @click="delit(scope.row)" style="cursor:pointer" class="color-danger" type="text" size="small"> 删除</span>
        </template>
      </el-table-column>
    </el-table>
    <i @click="addSet" title="添加配置" style="color:#409EFF;cursor:pointer" class="el-icon-circle-plus">添加配置</i>
    <el-dialog :center="true" :show-close="false" :visible.sync="dialogFormVisible" width="850px">
      <el-tabs style="margin-top:-55px" v-model="activeTab">
        <el-tab-pane label="基础配置" name="baseCfg">
          <el-form label-width="160px" :model="setting" ref="setting" :inline="true" :rules="rules2">
            <el-form-item label="配置名称id：" prop="f_id">
              <el-input v-model="setting.f_id" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="配置类型：">
              <el-radio-group v-model="setting.f_type" size="mini">
                <el-radio-button label="0" value="0">集合</el-radio-button>
                <el-radio-button label="1" value="1">函数</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="集合或函数名：" prop="f_name" :rules="[{ required: true, message: '集合或函数名不能为空'}]">
              <el-input v-model="setting.f_name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="操作类型：">
              <el-select size="mini" v-model="setting.f_optres" placeholder="操作类型">
                <el-option v-for="(value,key) in opttype" :key="key" :label="value" :value="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序字段：">
              <el-input v-model="setting.f_fldorder" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="排序规则：">
              <el-radio-group v-model="setting.f_ordertype" size="mini">
                <el-radio-button label="1">升序</el-radio-button>
                <el-radio-button label="-1">降序</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="配置性质：">
              <el-radio-group v-model="setting.f_cfgtype" size="mini">
                <el-radio-button label="0">开发配置</el-radio-button>
                <el-radio-button label="1">系统配置</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item style="padding-left:20px" label="开放性质：">
              <el-radio-group v-model="setting.f_porttype" size="mini">
                <el-radio-button label="0">验证接口</el-radio-button>
                <el-radio-button label="1">公用接口</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注/说明：">
              <el-input type="textarea" v-model="setting.f_remark" size="mini"></el-input>
            </el-form-item>
              <div style="text-align:center;line-height:86px">
                <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="save" size="mini">确 定</el-button>
              </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="更多配置" name="moreCfg">
          <div style="width:100%;overflow:hidden">
            <div style="float:left;width:45%">
              <el-table :data="tableDataAnd" size="mini" width="100%"  height="318" @select = "selectAnd" @select-all = "selectAnd">
                <el-table-column header-align="center" label="并行条件（AND）">
                  <el-table-column type="selection" width="30">
                  </el-table-column>
                  <el-table-column label="字段">
                    <template slot-scope="scope">
                      <span @click="editCond(scope.row)" style="cursor:pointer" title="编辑" class="color-blue">{{ scope.row.c_fldname }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="c_optname" label="操作" width="70">
                  </el-table-column>
                  <el-table-column prop="c_valname" label="参数">
                  </el-table-column>
                  <el-table-column prop="c_valexec" label="有值执行" width="70">
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>
            <div style="width:10%;float:left;height:318px;display: flex;align-items: center;justify-content: center">
              <div class="btn-group">
                <div>
                  <el-button @click="addCond" size="small" title="新增" icon="el-icon-plus" circle :disabled='((edtid != "") && (setting.f_optres=="qry" || setting.f_optres=="qryp" || setting.f_optres=="qryone")) > 0?false:true'></el-button>
              </div>
              <div>
                  <el-button @click="moveCond('left')" size="small" title="左移" type="primary" icon="el-icon-arrow-left" circle :disabled="sltOr.length > 0?false:true"></el-button>
              </div>
              <div>
                <el-button @click="moveCond('right')" size="small" title="右移" type="primary" icon="el-icon-arrow-right" circle :disabled="sltAnd.length > 0?false:true"></el-button>
              </div>
              <div>
                <el-button @click="delCond" size="small" type="danger" icon="el-icon-delete" circle :disabled="sltOr.length > 0||sltAnd.length > 0?false:true"></el-button>
              </div>
              </div>
            </div>
            <div style="float:left;width:45%">
              <el-table :data="tableDataOr" size="mini" width="100%" height="318" @select = "selectOr" @select-all = "selectOr">
                <el-table-column header-align="center" label="选择条件（OR）">
                  <el-table-column type="selection" width="30">
                  </el-table-column>
                  <el-table-column label="字段">
                    <template slot-scope="scope">
                      <span @click="editCond(scope.row)" style="cursor:pointer" title="编辑" class="color-blue">{{ scope.row.c_fldname }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="c_optname" label="操作" width="70">
                  </el-table-column>
                  <el-table-column prop="c_valname" label="参数">
                  </el-table-column>
                  <el-table-column prop="c_valexec" label="有值执行" width="70">
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>
            <p style="clear:both" class="color-warning">
              <ul style="padding:0">
                <li style="list-style:none">1、更多配置只对操作类型为【查询数据】【查询分页数据】【查询单条数据】有效</li>
                <li style="list-style:none">2、如果为【新增配置】，在添加更多配置之前请先【保存基础配置】</li>
                <li style="list-style:none">3、在基础配置中单机【取消】或者键盘【Esc】键或者【空白处单机】即可关闭对话框</li>
              </ul>
            </p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
      :show-close="false"
      center
      width="30%"
      :visible.sync="innerVisible"
      title="配置信息"
      append-to-body>
      <el-form ref="condForm" :model="condForm" label-width="80px" size="mini">
        <el-form-item label="字段名称" prop="c_fldname" :rules="[{ required: true, message: '字段名称不能为空'}]">
          <el-input v-model="condForm.c_fldname"></el-input>
        </el-form-item>
         <el-form-item label="条件类型" prop="c_type" :rules="[{ required: true, message: '条件类型不能为空'}]">
          <el-select v-model="condForm.c_type" placeholder="选择条件类型" style="width:100%">
            <el-option label="并行条件（AND）" value="and"></el-option>
            <el-option label="选择条件（OR）" value="or"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型" prop="c_optmark" :rules="[{ required: true, message: '操作类型不能为空'}]">
          <el-select v-model="condForm.c_optmark" placeholder="选择操作类型" style="width:100%">
            <el-option v-for="(item,index) in condOptType" :key="index" :label="item.name" :value="item.mark"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数名称" prop="c_valname" :rules="[{ required: true, message: '参数名称不能为空'}]">
          <el-input v-model="condForm.c_valname"></el-input>
        </el-form-item>
         <el-form-item label="有值执行">
            <el-radio-group v-model="condForm.c_valexec">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveCond" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    </el-dialog>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10,20, 30]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageCount">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "mongcfglist",
  data() {
    let validateFid = (rule, value, callback) => {
      let params = {
        pageIndex: 1,
        pageSize: 10,
        f_id: value
      };

      this.$run4xml("get_mongocfig_list", params, (err, res) => {
        if (res) {
          if (res.length > 1) {
            if (this.edtid === "") {
              callback(new Error("该配置已经存在"));
            }
          } else {
            this.$refs.setting.validateField("f_id");
            callback();
          }
        }
      });
    };
    return {
      dialogFormVisible: false,
      innerVisible: false,
      activeTab: "baseCfg",
      key1: "",
      setting: {
        f_id: "",
        f_name: "",
        f_type: "0",
        f_optres: "",
        f_cfgtype: "0",
        f_fldorder: "",
        f_remark: "",
        f_ordertype: "",
        f_porttype: "0"
      },
      condForm: {
        c_fldname: "",
        c_type: "",
        c_optmark: "",
        c_valname: "",
        c_valexec: "0"
      },
      pageIndex: 1,
      pageSize: 20,
      pageCount: 0,
      edtid: "",
      condId: "",
      tableData: [],
      originalData: [],
      figArr: [
        { text: "增加单条数据", value: "ins" },
        { text: "增加多条数据", value: "insm" },
        { text: "查询数据", value: "qry" },
        { text: "按主键查询数据", value: "qryk" },
        { text: "查询分页数据", value: "qryp" },
        { text: "查询单条数据", value: "qryone" },
        { text: "删除数据", value: "del" },
        { text: "按主键修改数据", value: "edtk" },
        { text: "按条件修改数据", value: "edtc" },
        { text: "返回字符串", value: "string" },
        { text: "返回JSON", value: "json" }
      ],
      tableDataAnd: [], //and条件
      sltAnd: [], //选中的and条件
      tableDataOr: [], //or条件
      sltOr: [], //选中的or条件
      rules2: {
        f_id: [
          { validator: validateFid, trigger: "blur" },
          { required: true, message: "请输入配置名称", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.loadme();
  },
  methods: {
    resetCond() {
      this.condForm.c_fldname = "";
      this.condForm.c_type = "";
      this.condForm.c_optmark = "";
      this.condForm.c_valname = "";
      this.condForm.c_valexec = "0";
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.loadme();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadme();
    },
    save() {
      let _self = this,
        params = Object.assign({}, this.setting);
      params["f_edtman"] = "BLUE";
      if (_self.edtid) {
        //编辑
        params["_id"] = _self.edtid;
        _self.$run4xml("edt_mongocfig_list", params, (err, res) => {
          if (err) {
            _self.$message.error("配置信息提交失败，请重新配置");
          } else {
            _self.edtid = "";
            _self.dialogFormVisible = false;
            _self.$message({
              message: "配置信息提交成功",
              type: "success"
            });
            _self.loadme();
          }
        });
      } else {
        this.$refs.setting.validate(isok => {
          if (isok) {
            params["opt"] = "ins";
            params["f_edtdate"] = new Date().getTime();
            this.$http
              .post(`/config`, params, { emulateJSON: true })
              .then(res => {
                _self.dialogFormVisible = false;
                this.$message({
                  message: "配置信息提交成功",
                  type: "success"
                });
                this.loadme();
                let para = {
                  pageIndex: 1,
                  pageSize: 1,
                  f_id: params["f_id"]
                };
                this.$run4xml("get_mongocfig_list", para, (err, res) => {
                  this.edtid = res[1]["_id"];
                });
              })
              .catch(res => {
                this.$message.error("配置信息提交失败，请重新添加");
              });
          }
        });
      }
    },
    loadme() {
      let _self = this,
        params = {
          pageIndex: _self.pageIndex,
          pageSize: _self.pageSize
        };
      this.key1 ? (params["key1"] = this.key1.trim()) : "";
      this.$run4xml("get_mongocfig_list", params, (err, res) => {
        if (err) {
          throw err;
        } else {
          res = JSON.parse(JSON.stringify(res));
          _self.pageCount = res[0]["_count"];
          _self.originalData = JSON.parse(JSON.stringify(res.slice(1)));
          res.splice(0, 1);
          _self.tableData = res;
        }
      });
    },
    delit({ _id }) {
      let _self = this;
      this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$run4xml("del_mongofig_list", "_id=" + _id, (err, res) => {
            if (res) {
              _self.loadme();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    edit({ _id }) {
      let curr = this.originalData.filter(x => x._id == _id)[0];
      this.edtid = _id;
      for (let key in this.setting) {
        switch (key) {
          case "f_optres": {
            setTimeout(() => {
              this.setting[key] = curr[key];
            }, 500);
            break;
          }
          default: {
            this.setting[key] = curr[key];
            break;
          }
        }
      }
      this.activeTab = "baseCfg";
      this.loadCond(_id);
      this.dialogFormVisible = true;
    },
    loadCond(billid) {
      this.$run4xml("get_mongo_cond", "c__id=" + billid, (err, res) => {
        if (!err) {
          res.forEach(x => (x.c_valexec = x.c_valexec === "0" ? "是" : "否"));
          this.tableDataAnd = res.filter(x => x.c_type === "and");
          this.tableDataOr = res.filter(x => x.c_type === "or");
        }
      });
    },
    selectAnd(selection) {
      this.sltAnd = [...selection];
    },
    selectOr(selection) {
      this.sltOr = [...selection];
    },
    moveCond(direc) {
      let s = this;
      (function a(n) {
        let sltArr = direc === "left" ? s.sltOr : s.sltAnd;
        if (n === sltArr.length) {
          sltArr.splice(0, sltArr.length);
          return;
        }
        let curObj = sltArr[n];
        let params = {
          _id: curObj["_id"],
          c_type: direc === "left" ? "and" : "or"
        };
        s.$run4xml("edt_mongo_cond", params, (err, res) => {
          if (!err) {
            if (direc === "left") {
              let index = s.tableDataOr.findIndex(x => x._id === curObj._id);
              s.tableDataOr.splice(index, 1);
              curObj.c_type = "and";
              s.tableDataAnd.push(curObj);
            } else {
              let index = s.tableDataAnd.findIndex(x => x._id === curObj._id);
              s.tableDataAnd.splice(index, 1);
              curObj.c_type = "or";
              s.tableDataOr.push(curObj);
            }
            a(++n);
          }
        });
      })(0);
    },
    delCond() {
      //删除高级配置
      let s = this,
        sltArr = [...s.sltAnd, ...s.sltOr];
      (function a(n) {
        if (n === sltArr.length) {
          s.sltAnd.splice(0, s.sltAnd.length);
          s.sltOr.splice(0, s.sltOr.length);
          return;
        }
        let cid = sltArr[n]["_id"],
          type = sltArr[n]["c_type"];
        s.$run4xml("del_mongo_cond", "_id=" + cid, (err, res) => {
          if (!err) {
            if (type === "or") {
              let index = s.tableDataOr.findIndex(x => x._id === cid);
              s.tableDataOr.splice(index, 1);
            } else if (type === "and") {
              let index = s.tableDataAnd.findIndex(x => x._id === cid);
              s.tableDataAnd.splice(index, 1);
            }
            a(++n);
          }
        });
      })(0);
    },
    addCond() {
      this.condId = "";
      this.resetCond();
      this.innerVisible = true;
    },
    editCond({ _id }) {
      this.condId = _id;
      let curObj = [...this.tableDataOr, ...this.tableDataAnd].find(
        x => x._id === _id
      );
      for (let key in this.condForm) {
        switch (key) {
          case "c_optmark": {
            setTimeout(() => {
              this.condForm[key] = curObj[key];
            }, 100);
            break;
          }
          case "c_valexec": {
            this.condForm[key] = curObj[key] === "是" ? "0" : "1";
            break;
          }
          default: {
            this.condForm[key] = curObj[key];
            break;
          }
        }
      }
      this.innerVisible = true;
    },
    saveCond() {
      this.$refs.condForm.validate(isok => {
        if (isok) {
          let cid = this.edtid,
            params = Object.assign({}, this.condForm);
          params["c_edtdate"] = new Date().getTime();
          params["c_edtuid"] = this.$prop("self")["_id"];
          params["c_optname"] = this.condOptType.filter(
            x => x.mark === this.condForm.c_optmark
          )[0]["name"];

          if (this.condId) {
            //编辑
            params["_id"] = this.condId;
            this.$run4xml("edt_mongo_cond", params, (err, res) => {
              this.innerVisible = false;
              this.loadCond(cid);
            });
          } else {
            //新增
            params["c__id"] = cid;
            this.$run4xml("add_mongo_cond", params, (err, res) => {
              if (!err) {
                let type = params["c_type"];
                params["_id"] = res;
                params["c_valexec"] = params["c_valexec"] === "0" ? "是" : "否";
                if (type === "or") {
                  this.tableDataOr.push(params);
                } else if (type === "and") {
                  this.tableDataAnd.push(params);
                }
                this.innerVisible = false;
              }
            });
          }
        }
      });
    },
    addSet() {
      for (let key in this.setting) {
        switch (key) {
          case "f_type":
          case "f_cfgtype":
          case "f_porttype": {
            this.setting[key] = "0";
            break;
          }
          case "f_optres": {
            this.setting[key] = "ins";
            break;
          }
          default: {
            this.setting[key] = "";
            break;
          }
        }
      }
      this.edtid = "";
      this.activeTab = "baseCfg";
      this.dialogFormVisible = true;
    },
    filterTag(value, row) {
      return row.f_cfgtype === value;
    },
    filterType(value, row) {
      return row.f_type == value;
    },
    filterBtype(value, row) {
      return row.f_optres === value;
    },
    filterOrd(value, row) {
      return row.f_ordertype === value;
    },
    filterPort(value, row) {
      return row.f_porttype === value;
    },
    formatterVal(row, column, cellValue) {
      return cellValue == 1 ? "系统配置" : "开发配置";
    },
    formatterType(row, column, cellValue) {
      return cellValue == 0 ? "集合" : "函数";
    },
    formatterOrd(row, column, cellValue) {
      return cellValue == 1 ? "升序" : cellValue == -1 ? "降序" : "";
    },
    formatterBtype(row, column, cellValue) {
      let _o = this.figArr.filter(x => x.value == cellValue)[0];
      return _o.text;
    },
    formatterDate(row, column, cellValue) {
      return this.$fmtdate(new Date(cellValue), "mm-dd hh:nn");
    },
    formatterPort(row, column, cellValue) {
      return cellValue == 0 ? "验证接口" : cellValue == 1 ? "公用接口" : "";
    }
  },
  computed: {
    opttype() {
      let params = {};
      if (this.setting.f_type == 0) {
        this.setting.f_optres = "ins";
        for (let i = 0, len = this.figArr.length - 2; i < len; i++) {
          let key = this.figArr[i].value,
            value = this.figArr[i].text;
          params[key] = value;
        }
        return params;
      } else if (this.setting.f_type == 1) {
        this.setting.f_optres = "json";
        for (let len = this.figArr.length, i = len - 2; i < len; i++) {
          let key = this.figArr[i].value,
            value = this.figArr[i].text;
          params[key] = value;
        }
        return params;
      }
    },
    condOptType() {
      let type = this.condForm.c_type,
        optmarkList = [
          { mark: "ne", name: "不等于" },
          { mark: "gt", name: "大于" },
          { mark: "lt", name: "小于" },
          { mark: "gte", name: "大于等于" },
          { mark: "lte", name: "小于等于" },
          { mark: "regex", name: "模糊查询" },
          { mark: "in", name: "包含" },
          { mark: "nin", name: "不包含" },
          { mark: "exists", name: "是否存在" }
        ];
      this.condForm.c_optmark = "";
      if (type === "or") {
        optmarkList.unshift({ mark: "all", name: "等于" });
      }
      return optmarkList;
    }
  }
};
</script>
<style lang="less" scoped>
.btn-group > div {
  padding: 8px 0;
}
</style>