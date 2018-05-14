<template>
  <div class="custom-tree-container" style="height:100%">
      <div class="block" style="float:left;height:100%;border-right:1px solid #E6E6E6;min-width:270px">
          <p style="text-align:center">角色结构</p>
          <el-tree
            :data="data"
            node-key="_id"
            :props="props1"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent"
            >
          </el-tree>
      </div>
      <transition enter-active-class="bounceInDown">
      <div class="block animated" v-show="state" style="float:left;height:100%;border-right:1px solid #E6E6E6">
          <p style="text-align:center;">
            【{{groupname}}】用户列表
            <i @click="addGroupUser" title="添加成员" style="color:#409EFF;cursor:pointer" class="el-icon-circle-plus-outline"></i>
          </p>
          <el-table size="mini"
    :data="gusers"
    style="width:450px">
    <el-table-column type="expand" >
      <template slot-scope="props">
        <el-form label-position="left" inline  class="demo-table-expand">
          <el-form-item label="用户头像：">
            <img :src="props.row.cu_photo ?props.row.cu_photo:'upload/user_avator/defaultAvator.jpg'" alt="头像丢失" height="50px" style="border-radius:6px;">
          </el-form-item>
          <el-form-item label="通行证号：">
            <span>{{ props.row.cu_usercode }}</span>
          </el-form-item>
          <el-form-item label="用户姓名：">
            <span>{{ props.row.cu_realname }}</span>
          </el-form-item>
          <el-form-item label="用户性别：">
            <span>{{ props.row.cu_sex }}</span>
          </el-form-item>
          <el-form-item label="联系方式：">
            <span>{{ props.row.cu_contact }}</span>
          </el-form-item>
          <el-form-item label="注册日期：">
            <span>{{ props.row.cu_regdate }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="用户名"
      prop="cu_usercode">
    </el-table-column>
    <el-table-column
      label="状态"
      prop="cu_state"
      :filters="[{ text: '正常', value: '正常' }, { text: '冻结', value: '冻结' }, { text: '查封', value: '查封' }]"
      :filter-method="filterType"
      >
    </el-table-column>
    <el-table-column
      label="操作"
      prop="desc">
       <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index, gusers)"
          type="text"
          size="small">
          移 除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
      </div>
       </transition>
        <transition enter-active-class="bounceInDown">
      <div v-show="state" class="block animated" style="float:left;height:100%;border-right:1px solid #E6E6E6;min-width:270px">
          <p style="text-align:center">【{{groupname}}】菜单权限</p>
          <el-tree
            :data="menuTree"
            default-expand-all
            ref="treeMenu"
            show-checkbox
            node-key="_id"
            @check="check"
            :props="props2">
          </el-tree>
      </div>
        </transition>
      <el-dialog title="角色详情" :visible.sync="dialogFormVisible" :center="true" width="480px">
          <el-form :rules="rules" :model="form" label-width="80px" ref="form" size="mini"  :label-position="'right'">
              <el-form-item label="角色名称" prop="cg_name">
                <el-input v-model="form.cg_name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="角色备注">
                <el-input type="textarea" v-model="form.cg_remark"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" size="mini" @click="saveMe">提 交</el-button>
          </div>
      </el-dialog>
      <el-dialog :title="'【'+groupname+'】 添加成员'" :center="true" :visible.sync="dialog_addUser">
        <el-table :data="userData" stripe border size="mini"  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column property="cu_usercode" label="通行证号"></el-table-column>
          <el-table-column property="cu_realname" label="用户姓名"></el-table-column>
          <el-table-column property="cu_state" label="账户状态"
           :filters="[{ text: '正常', value: '正常' }, { text: '冻结', value: '冻结' }, { text: '查封', value: '查封' }]"
           :filter-method="filterType"
          ></el-table-column>
          <el-table-column property="cu_contact" label="联系方式"></el-table-column>
          <el-table-column property="cu_regdate" label="注册日期"></el-table-column>
        </el-table>
         <div slot="footer" class="dialog-footer">
            <el-button @click="dialog_addUser = false" size="mini">取 消</el-button>
            <el-button type="primary" size="mini" @click="submitGroupUser">提 交</el-button>
          </div>
      </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [],
      userData: [],
      menuTree: [],
      curNode: null,
      billid: "",
      groupname: "",
      groupid: "",
      state: false,
      props1: {
        label: "cg_name"
      },
      props2: {
        label: "sm_caption"
      },
      dialogFormVisible: false, //添加角色对话框
      dialog_addUser: false, //添加成员列表
      form: {
        cg_name: "",
        cg_remark: ""
      },
      rules: {
        cg_name: [
          {
            required: true,
            message: "角色名称不能为空",
            trigger: "blur,change"
          }
        ]
      },
      gusers: [],
      multipleSelection: [] //角色新增成员选择
    };
  },
  mounted() {
    this.$run4xml("get_group_list", null, (err, res) => {
      if (!err) {
        this.data = [...this.$toTreeData(res, { pid: "cg_pid" })];
      }
    });
    this.$run4xml("get_menu_list", null, (err, res) => {
      if (!err) {
        this.menuTree = [...this.$toTreeData(res, { pid: "sm_pid" })];
      }
    });
  },
  methods: {
    resetFields() {
      let s = this;
      setTimeout(() => {
        s.form.cg_name = "";
        s.form.cg_remark = "";
        s.billid = "";
        s.curNode = null;
      }, 1000);
    },
    fmtVal() {
      let s = this,
        params = {
          cg_name: s.form.cg_name,
          cg_remark: s.form.cg_remark,
          cg_createuid: s.$prop("self")._id,
          cg_createdate: new Date().getTime()
        };
      return params;
    },
    append(data) {
      this.dialogFormVisible = true;
      this.curNode = data;
    },
    edit(node, data) {
      for (let key in this.form) {
        this.form[key] = data[key];
      }
      this.billid = data._id;
      this.dialogFormVisible = true;
      this.curNode = data;
    },
    remove(node, data) {
      let childLen = data.children.length,
        _id = data._id,
        _pid = data.cg_pid;
      if (_pid === "0") {
        this.$message.error("错误！不允许删除顶级节点");
        return false;
      }
      if (childLen > 0) {
        this.$confirm("该操作将删除所有子菜单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this.$run4xml("del_group_info", "_id=" + _id, (err, res) => {
              if (!err) {
                this.$run4xml("del_group_info", "cg_pid=" + _id, (err, res) => {
                  if (!err) {
                    const parent = node.parent,
                      children = parent.data.children || parent.data,
                      index = children.findIndex(d => d.id === data.id);
                    children.splice(index, 1);
                  } else {
                    this.$message.error("服务器忙，删除失败");
                  }
                });
              } else {
                this.$message.error("服务器忙，删除失败");
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$run4xml("del_group_info", "_id=" + _id, (err, res) => {
          if (!err) {
            const parent = node.parent,
              children = parent.data.children || parent.data,
              index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
          } else {
            this.$message.error("服务器忙，删除失败");
          }
        });
      }
    },
    sltit(data) {
      let gid = data._id,
        pid = data.cg_pid;
      this.state = true;
      if (pid !== "0") {
        this.groupname = data.cg_name;
        this.groupid = data._id;
        this.$run4xml("get_group_users", "gid=" + gid, (err, res) => {
          if (!err) {
            res.forEach(x => {
              x.cu_regdate = this.$fmtdate(
                new Date(x.cu_regdate),
                "mm-dd hh:nn"
              );
              x.cu_state =
                x.cu_state === "0"
                  ? "正常"
                  : x.cu_state === "2" ? "冻结" : "查封";
            });
            this.gusers = [...res];
          }
        });
        this.$run4xml("get_group_menu", "cm_gid=" + gid, (err, res) => {
          if (!err) {
            let sltKey = [];
            res.forEach(x => {
              sltKey.push(x.cm_mid);
            });
            this.$refs.treeMenu.setCheckedKeys(sltKey);
          }
        });
      }
    },
    saveMe() {
      let s = this,
        params = this.fmtVal(),
        cfg = "ins_group_info";
      if (this.billid) {
        cfg = "edt_group_info";
        params["_id"] = this.billid;
      } else {
        params["cg_pid"] = s.curNode._id;
      }
      this.$run4xml(cfg, params, (err, res) => {
        if (!err) {
          try {
            if (s.billid) {
              s.curNode.cg_name = s.form.cg_name;
              s.curNode.cg_remark = s.form.cg_remark;
            } else {
              const newChild = {
                _id: res,
                cg_name: s.form.cg_name,
                children: []
              };
              if (!s.curNode.children) {
                s.$set(s.curNode, "children", []);
              }
              s.curNode.children.push(newChild);
            }
            s.dialogFormVisible = false;
            s.resetFields();
          } catch (e) {
            s.$message.error("服务器忙，操作失败");
          }
        } else {
          s.$message.error("服务器忙，操作失败");
        }
      });
    },
    deleteRow(index, rows) {
      //移除分组中的人
      let data = rows[index],
        uid = data._id,
        s = this,
        params = {
          gu_uid: uid,
          gu_gid: s.groupid
        };
      this.$run4xml("del_groupuser_info", params, (err, res) => {
        if (!err) {
          rows.splice(index, 1);
        } else {
          this.$message.error("服务器忙，操作失败");
        }
      });
    },
    addGroupUser() {
      //添加组成员
      this.dialog_addUser = true;
      this.$run4xml("get_users_add", "gid=" + this.groupid, (err, res) => {
        if (!err) {
          res.forEach(x => {
            x.cu_regdate = this.$fmtdate(
              new Date(x.cu_regdate),
              "yy-mm-dd hh:nn"
            );
            x.cu_state =
              x.cu_state === "0"
                ? "正常"
                : x.cu_state === "2" ? "冻结" : "查封";
          });
          this.userData = [...res];
        } else {
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    submitGroupUser() {
      //添加组成员
      if (this.multipleSelection.length > 0) {
        let arr = [],
          s = this,
          meid = this.$prop("self")._id;
        this.multipleSelection.forEach(x => {
          arr.push({
            gu_uid: String(x._id),
            gu_gid: String(s.groupid),
            gu_createuid: String(meid),
            gu_createdate: new Date()
          });
        });
        let params = { json: arr };
        this.$run4xml("ins_group_users", params, (err, res) => {
          this.dialog_addUser = false;
          this.multipleSelection.splice(0, this.multipleSelection.length);
          this.sltit({ _id: s.groupid, cg_name: s.groupname, cg_pid: "111" });
        });
      } else {
        this.$message.error("选择人员不能为空");
      }
    },
    check(data, state) {
      let checkedNodes = this.$refs.treeMenu.getCheckedNodes(),
        validNodes = checkedNodes.filter(x => x.children.length === 0),
        validId = [];
      validNodes.forEach(x => {
        validId.push(x._id);
      });
      if (validId.length > 0) {
        let s = this,
          params = {
            gid: s.groupid,
            cid: s.$prop("self")["_id"],
            mid: validId.join(",")
          };
        this.$run4xml("edt_group_menu", params, (err, res) => {
          if (err || res === "error") {
            this.$message.error("服务器忙，操作失败");
          }
        });
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span on-click={() => this.sltit(data)} style="margin-right:20px">
            {node.label}
          </span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.append(data)}
            >
              添加
            </el-button>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.edit(node, data)}
            >
              {data.cg_pid === "0" ? "" : "编辑"}
            </el-button>
            <el-button
              class="color-danger"
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              {data.cg_pid === "0" ? "" : "删除"}
            </el-button>
          </span>
        </span>
      );
    },
    filterType(value, row) {
      return row.cu_state === value;
    }
  }
};
</script>
<style lang="css">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  color: #99a9bf;
  padding-right: 0;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>