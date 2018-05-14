<template>
  <div style="height:100%">
        <el-table
      :data="tableData"
      size="mini"
      :highlight-current-row="true"
      border stripe
      style="width: 100%">
       <el-table-column prop="order" label="序号" width="50" fixed></el-table-column>
      <el-table-column
        prop="cu_usercode"
        label="登录ID">
         <template slot-scope="scope">
        <el-popover trigger="hover" placement="bottom">
          <img :src="scope.row.cu_photo?scope.row.cu_photo:'upload/user_avator/defaultAvator.jpg'" alt="头像丢失" width="50px" style="border-radius:6px;display:block">
          <div slot="reference" class="name-wrapper" style="cursor:normal">
            <el-tag size="medium">{{ scope.row.cu_usercode }}</el-tag>
          </div>
        </el-popover>
      </template>
      </el-table-column>
      <el-table-column
        prop="cu_realname"
        label="用户姓名">
      </el-table-column>
      <el-table-column
        prop="cu_state"
        label="账户状态"
        width="90"
        :filters="[{ text: '正常', value: '正常' }, { text: '查封', value: '查封' },{text:'冻结',value:'冻结'}]"
         :filter-method="filterType"
        >
      </el-table-column>
       <el-table-column
        prop="cu_sex"
        label="性别"
        width="50">
      </el-table-column>
      <el-table-column
        prop="cu_contact"
        label="联系方式"
        width="180">
      </el-table-column>
      <el-table-column
        prop="cu_regdate"
        label="注册日期"
        width="180"
        >
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <span title="修改" @click="edit(scope.row)" style="cursor:pointer" class="color-blue" type="text" size="small">修改</span>
          <span title="密码重置" @click="resetPwd(scope.row)" style="cursor:pointer;margin-left:10px" class="color-warning" type="text" size="small">密码重置</span>
          <span title="状态修改" @click="changeState(scope.row)" style="cursor:pointer;margin-left:10px" class="color-danger" type="text" size="small">状态修改</span>
        </template>
      </el-table-column>
    </el-table>
    <i @click="addUser" title="新增用户" style="color:#409EFF;cursor:pointer" class="el-icon-circle-plus">新增用户</i>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10,20, 30]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageCount">
    </el-pagination>

    <el-dialog
    :title='`修改【${curNode["cu_usercode"]?curNode["cu_usercode"]:""}】的账户状态`'
    :visible.sync="stateDialog"
    width="30%"
    center>
    <div style="text-align:center">
     <el-button size="mini"  type="primary" @click="edtState('0')">正常</el-button>
      <el-button size="mini" type="warning" @click="edtState('2')">冻结</el-button>
      <el-button size="mini" type="danger" @click="edtState('1')">查封</el-button>
    </div>
  </el-dialog>
     <el-dialog title="用户信息" :center="true" :visible.sync="dialogFormVisible">
        <el-form label-width="110px" :model="userForm" :rules="rules2" ref="userForm" :inline="true">
        <el-form-item label="通行证号：" prop="cu_usercode">
          <el-input v-model="userForm.cu_usercode" size="mini" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名：">
          <el-input v-model="userForm.cu_realname" size="mini" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：">
          <el-input v-model="userForm.cu_contact" size="mini" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户性别：">
          <el-radio-group v-model="userForm.cu_sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户头像：">
         <el-upload
            class="avatar-uploader"
            action="/upload/file"
            name="files"
            list-type="picture-card"
            :multiple="true"
            :show-file-list="false"
            :data="{target:'user_avator'}"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            >
            <img v-if="avatorUrl" :src="avatorUrl" class="avatar">
            <i v-if="!avatorUrl" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveMe" size="mini">提 交</el-button>
      </div>
     </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    let validateUid = (rule, value, callback) => {
      let params = {
        pageIndex: 1,
        pageSize: 10,
        cu_usercode: value
      };
      this.$run4xml("get_users_list", params, (err, res) => {
        if (res) {
          if (res.length > 1) {
            if(this.billid === ""){
              callback(new Error("该ID已经被注册"));
            }
          } else {
            this.$refs.userForm.validateField("cu_usercode");
            callback();
          }
        }
      });
    };
    return {
      tableData: [],
      treeData: [],
      pageIndex: 1,
      pageSize: 10,
      pageCount: 0,
      curNode: {},
      billid: "",
      stateDialog: false,
      dialogFormVisible: false,
      avatorUrl: "",
      userForm: {
        cu_usercode: "",
        cu_realname: "",
        cu_contact: "",
        cu_sex: "男"
      },
      rules2: {
        cu_usercode: [
          { validator: validateUid, trigger: "blur" },
          { required: true, message: "请输入用户ID", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.loadme();
  },
  methods: {
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.loadme();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadme();
    },
    loadme(obj) {
      let _self = this,
        params = {
          pageIndex: _self.pageIndex,
          pageSize: _self.pageSize
        };
      if (JSON.stringify(obj) === "{}") {
        Object.assign(params, obj);
      }
      this.$run4xml("get_users_list", params, (err, res) => {
        if (err) {
          throw err;
        } else {
          res = JSON.parse(JSON.stringify(res));
          _self.pageCount = res[0]["_count"];
          res.splice(0, 1);
          res.forEach(x => {
            x.cu_regdate = this.$fmtdate(
              new Date(x.cu_regdate),
              "yyyy-mm-dd hh:nn:ss"
            );
            x.cu_state =
              x.cu_state === "0"
                ? "正常"
                : x.cu_state === "2" ? "冻结" : "查封";
          });
          _self.tableData = res;
        }
      });
    },
    saveMe() {
      let params = {};
      Object.assign(params, this.userForm);
      try {
        if (this.billid !== "") {
          //编辑
          params["_id"] = this.billid;
          this.$run4xml("edt_user_info", params, (err, res) => {
            if (!err) {
              this.$message({ message: "数据提交成功", type: "success" });
              this.dialogFormVisible = false;
              this.loadme();
            } else {
              throw new Error(err);
            }
          });
        } else {
          //新增
          this.$refs.userForm.validate(isok => {
            if (isok) {
              params["cu_regdate"] = new Date().getTime();
              params["cu_createuid"] = this.$prop("self")["_id"];
              params["cu_password"] = "202CB962AC59075B964B07152D234B70";
              params["cu_state"] = "0";
              this.avatorUrl ? (params["cu_photo"] = this.avatorUrl) : "";
              this.$run4xml("ins_user_info", params, (err, res) => {
                if (!err) {
                  this.$message({ message: "数据提交成功", type: "success" });
                  this.dialogFormVisible = false;
                  this.loadme();
                } else {
                  throw new Error(err);
                }
              });
            }
          });
        }
      } catch (e) {
        this.$message.error(e);
      }
    },
    changeState(row) {
      this.curNode = row;
      this.stateDialog = true;
    },
    edtState(stateCode) {
      let uid = this.curNode["_id"],
        params = {
          _id: uid,
          cu_state: stateCode
        };
      this.$run4xml("edt_user_info", params, (err, res) => {
        if (!err) {
          this.loadme();
          this.$message({
            showClose: true,
            message: "状态修改成功",
            type: "success"
          });
          this.stateDialog = false;
        } else {
          this.$message.error("服务器忙，操作失败");
        }
      });
    },
    resetPwd(row) {
      let uid = row["_id"],
        params = {
          _id: uid,
          cu_password: "202CB962AC59075B964B07152D234B70"
        };
      this.$run4xml("edt_user_info", params, (err, res) => {
        if (!err) {
          this.$message({
            showClose: true,
            message: "密码已被重置，当前密码为【123】",
            type: "success"
          });
        } else {
          this.$message.error("服务器忙，操作失败");
        }
      });
    },
    edit(row) {
      this.dialogFormVisible = true;
      let uid = row["_id"],
        curKey = {
          cu_usercode: row.cu_usercode,
          cu_realname: row.cu_realname,
          cu_contact: row.cu_contact,
          cu_sex: row.cu_sex
        };
      this.avatorUrl = row["cu_photo"];
      Object.assign(this.userForm, curKey);
      this.billid = uid;
    },
    addUser() {
      this.billid = "";
      this.avatorUrl = "";
      for (let key in this.userForm) {
        if (key === "cu_sex") {
          this.userForm[key] = "男";
        } else {
          this.userForm[key] = "";
        }
      }
      this.dialogFormVisible = true;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(response, file, fileList) {
      let uid = this.billid;
      if (uid) {
        //编辑
        let params = {
          _id: uid,
          cu_photo: response
        };
        this.$run4xml("edt_user_info", params, (err, res) => {
          if (err) {
            this.$message.error("服务器忙，头像提交失败");
          }
        });
      }
      this.avatorUrl = response;
    },
    filterType(value, row) {
      return row.cu_state === value;
    }
  }
};
</script>
<style lang="css" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>
