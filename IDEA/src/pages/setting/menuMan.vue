<template>
<div class="custom-tree-container"  style="height:100%">
  <div class="block" style="float:left;min-width:270px;border-right:1px solid #E6E6E6;height:100%;">
    <el-tree
      :data="data"
      node-key="_id"
      :props="props1"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
   </div>
    <el-dialog title="菜单详情" :visible.sync="dialogFormVisible" :center="true" width="590px">
      <el-form :model="form" ref="form" size="mini" :inline="true"  :label-position="'right'">
        <el-form-item label="菜单名称">
          <el-input v-model="form.sm_caption" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单路由">
          <el-input v-model="form.sm_router" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="菜单图标">
          <!-- <el-input v-model="form.sm_icon" auto-complete="off"></el-input> -->
          <el-input v-model="form.sm_icon" @focus="innerVisible = true">
          </el-input>
        </el-form-item>
         <el-form-item label="图标颜色">
          <el-color-picker v-model="form.sm_color" show-alpha></el-color-picker>
        </el-form-item>
        <br/>
        <el-form-item label="图标预览">
          <i  class="fa fa-lg" :class="form.sm_icon" :style="{'color':form.sm_color}"></i>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveMenu" size="mini">确 定</el-button>
      </div>
        <el-dialog
        width="70%"
        title="图标库"
        :center="true"
        :visible.sync="innerVisible"
        append-to-body
        >
        <el-row >
            <el-col :span="6" v-for="(item,index) in  icons" :key="index" style="cursor:pointer" @click.native="sltIcon(item.si_icon)"> 
              <i style="padding:15px 0" class="fa " :class="item.si_icon"></i> {{item.si_icon}}
            </el-col>
        </el-row>
      </el-dialog>
    </el-dialog>
</div>
</template>
<script>
export default {
  data() {
    return {
      data: [],
      curNode: null,
      billid: "",
      icons: [],
      props1: {
        label: "sm_caption"
      },
      dialogFormVisible: false,
      innerVisible: false,
      form: {
        sm_caption: "",
        sm_router: "",
        sm_icon: "fa-align-justify",
        sm_color: "rgba(19, 206, 102, 1)"
      }
    };
  },
  mounted() {
    let _self = this;
    this.$run4xml("get_menu_list", null, (err, res) => {
      if (!err) {
        _self.data = [...this.$toTreeData(res, { pid: "sm_pid" })];
      }
    });
  },
  methods: {
    resetFields() {
      let s = this;
      setTimeout(() => {
        s.form.sm_caption = "";
        s.form.sm_router = "";
        s.billid = "";
        s.form.sm_icon = "fa-align-justify";
        s.form.sm_color = "rgba(19, 206, 102, 1)";
      }, 500);
    },
    fmtVal() {
      let s = this,
        params = {
          sm_caption: s.form.sm_caption,
          sm_router: s.form.sm_router,
          sm_icon: s.form.sm_icon,
          sm_color: s.form.sm_color,
          sm_createuid: s.$prop("self")._id,
          sm_createdate: new Date().getTime()
        };
      return params;
    },
    append(data) {
      this.resetFields();
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
        _pid = data.sm_pid;
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
            this.$run4xml("del_menu_list", "_id=" + _id, (err, res) => {
              if (!err) {
                this.$run4xml("del_menu_list", "sm_pid=" + _id, (err, res) => {
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
        this.$run4xml("del_menu_list", "_id=" + _id, (err, res) => {
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

    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.append(data)}
            >
              {data.sm_pid === "0" ? "" : "添加"}
            </el-button>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.edit(node, data)}
            >
              {data.sm_pid === "0" ? "" : "编辑"}
            </el-button>
            <el-button
              class="color-danger"
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              {data.sm_pid === "0" ? "" : "删除"}
            </el-button>
          </span>
        </span>
      );
    },
    sltIcon(c) {
      this.form.sm_icon = c;
      this.innerVisible = false;
    },
    saveMenu() {
      let s = this,
        params = this.fmtVal(),
        cfg = "ins_menu_list";
      if (this.billid) {
        cfg = "edt_menu_info";
        params["_id"] = this.billid;
      } else {
        params["sm_pid"] = s.curNode._id;
      }
      this.$run4xml(cfg, params, (err, res) => {
        if (!err) {
          s.dialogFormVisible = false;
          if (s.billid) {
            s.curNode.sm_caption = s.form.sm_caption;
            s.curNode.sm_router = s.form.sm_router;
            s.curNode.sm_icon = s.form.sm_icon;
            s.curNode.sm_color = s.form.sm_color;
          } else {
            const newChild = {
              _id: res,
              sm_caption: s.form.sm_caption,
              children: []
            };
            if (!s.curNode.children) {
              s.$set(s.curNode, "children", []);
            }
            s.curNode.children.push(newChild);
          }
          this.resetFields();
        }
      });
    }
  },
  watch: {
    innerVisible(val) {
      if (val && this.icons.length === 0) {
        this.$run4xml("get_icons_list", null, (err, res) => {
          if (!err) {
            this.icons = [...res];
          }
        });
      }
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
 .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
