<template>
  <el-container style="height:100%">
  <el-header style="padding-left:0;height:40px;background-color:#409EFF;border-bottom:2px solid #00264D;box-sizing:content-box">
     <div style="width:200px;float:left;line-height:40px">
      <img height="40px" style="display:inline-block;vertical-align: middle" :src="require('@/assets/img/logos.png')" alt="logo">
      <a style="float:right;border-right:1px solid #1881EC;padding-right: 5px" class="color-white" effect="dark" href="javascript:void(0)">
        <i class="fa fa-navicon fa-fw"></i>
      </a>
    </div>
    <div style="float:left">
      <el-menu 
      style="border-bottom:2px solid #00264D"
      class="el-menu-demo"
      text-color="#fff" 
      mode="horizontal" 
      @select="handleSelect"
      background-color="#409EFF"
      >
        <el-menu-item v-for="(item,index) in firstMenu" :key="index" :index="item._id">{{item.sm_caption}}</el-menu-item>
      </el-menu>
    </div> 
    <div style="float:right">
        <div style="height:40px;align-items: center;display:flex">
           <img @click="dialogUserInfo = true" title="查看登录者信息" width="40px" height="40px" 
                style="display:block;float:left;cursor:pointer;" 
                :src='mineInfo.cu_photo?mineInfo.cu_photo:"upload/user_avator/defaultAvator.jpg"'>
            <div @click="logout" title="安全退出" style="cursor:pointer;background:#007CFD;width:40px;height:40px;line-height:40px;text-align:center;border-left:1px solid #fff">
             <i class="fa fa-power-off color-white"></i>
            </div>
        </div>
    </div>
  </el-header>
   <el-container style="height:calc(100% - 42px)">
       <el-aside class="animated" style="height:100%;width:auto">
    <el-tabs @tab-click="gotoPage" tab-position="left" style="height: 100%">
      <el-tab-pane v-for="item in curSecondMenu" :label="item.sm_caption" :name="item.sm_router" :key="item._id"></el-tab-pane>
    </el-tabs>
    </el-aside>
    <el-main style="padding:0;height:100%">
        <router-view></router-view>
    </el-main>
    <el-dialog
      :visible.sync="dialogUserInfo"
      :show-close="false"
      width="370px"
      center>
      <div style="width:320px;">
        <div style="position:relative">
         <img :src='mineInfo.cu_photo?mineInfo.cu_photo:"upload/user_avator/defaultAvator.jpg"' width="80" height="80" class="avator">
         <i @click="sltImg"
         style="position: absolute;
                left: 180px;
                top: 60px;
                font-size: 22px;
                cursor:pointer;" 
                class="el-icon-circle-plus color-danger" title="上传头像">
                <input style="visibility: hidden" @change="uploadImg" id="f" accept="image/*" type="file" name="files" class="el-upload__input1">
                </i>
        </div>
          <div class="user_info">
            <p>
              <label>
              <span>通行证</span>
              <input type="text" class="cursor_disabled" disabled v-model="mineInfo.cu_usercode">
            </label>
            </p>
            <p>
              <label>
              <span>姓名</span>
              <input type="text" class="cursor_disabled" disabled v-model="mineInfo.cu_realname">
            </label>
            </p>
             <p>
              <label>
              <span>电话</span>
              <input type="text" class="cursor_disabled" disabled v-model="mineInfo.cu_contact">
            </label>
            </p>
            <p>
              <label>
              <span>性别</span>
              <label style="float:right">
                <el-radio-group v-model="mineInfo.cu_sex">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
              </label>
            </label>
            </p>
            <p v-show="!pwdPan">
              <label>
              <span>密码</span>
              <input type="password" style="width:224px" disabled v-model="mineInfo.cu_password">
              <a @click="edtPwd" class="color-blue" style="text-decoration:none;font-size:12px" href="javascript:void(0)">修改</a>
            </label>
            </p>
            <transition enter-active-class="bounceIn">
                <div v-show="pwdPan" class="animated">
                    <p>
                      <label>
                        <span>原密码</span>
                        <input v-model="oldPwd" type="password">
                      </label>
                    </p>
                    <p>
                      <label>
                        <span>新密码</span>
                        <input v-model="newPwd" type="password">
                      </label>
                    </p>
                     <p>
                      <label>
                        <span>确认密码</span>
                        <input v-model="submitPwd" type="password">
                      </label>
                    </p>
                </div>
            </transition>
            <p>
              <label>
              <span>注册日期</span>
              <input  type="text" class="cursor_disabled" disabled v-model="mineInfo.cu_regdate">
            </label>
            </p>
          </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</el-container>
</template>
<script>
export default {
  data() {
    return {
      dialogUserInfo: false,
      firstMenu: [],
      secondMenu: [],
      curSecondMenu: [],
      pwdPan: false,
      oldPwd: "",
      newPwd: "",
      submitPwd: "",
      mineInfo: {
        cu_usercode: "",
        cu_realname: "",
        cu_contact: "",
        cu_sex: "",
        cu_regdate: "",
        cu_password: "",
        cu_state: "",
        cu_photo: ""
      }
    };
  },
  mounted() {
    let uid = this.$store.getters.me("_id");
    this.showInfo();
    this.$run4xml("get_login_menu", "uid=" + uid, (err, res) => {
      if (!err) {
        let topMenuIndex = res.findIndex(x => x.sm_pid === "0");
        let topMenuId = res[topMenuIndex]["_id"];
        res.splice(topMenuIndex, 1);
        this.firstMenu.push(...res.filter(x => x.sm_pid === topMenuId));
        this.secondMenu.push(...res.filter(x => x.sm_pid !== topMenuId));
      } else {
        this.$message.error("服务器忙，请重新登录");
      }
    });
  },
  methods: {
    handleSelect(key, keyPath) {
      this.curSecondMenu = this.secondMenu.filter(x => x.sm_pid === key);
    },
    showInfo() {
      let meinfo = this.$store.getters.me();
      for (let key in this.mineInfo) {
        if (key === "cu_regdate") {
          this.mineInfo[key] = this.$fmtdate(meinfo[key], "yy-mm-dd hh:nn");
        } else if (key === "cu_password") {
          this.mineInfo[key] = meinfo[key].substr(0, 10);
        } else {
          this.mineInfo[key] = meinfo[key];
        }
      }
    },
    edtPwd() {
      this.pwdPan = true;
    },
    logout() {
      let _self = this;
      const loading = this.$loading({
        lock: true,
        text: "安全退出中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http.post("/logout").then(res => {
        let r = res.bodyText;
        if (r == "bye") {
          loading.close();
          _self.$router.replace({ name: "login" });
        }
      });
    },
    gotoPage(ev) {
      let route = ev.name;
      this.$router.replace(route);
    },
    cancel() {
      this.dialogUserInfo = false;
      this.pwdPan = false;
    },
    submit() {
      try {
        let gender = this.$store.getters.me("cu_sex"),
          uid = this.$store.getters.me("_id"),
          params = { _id: uid };
        if (gender !== this.mineInfo.cu_sex) {
          params["cu_sex"] = this.mineInfo.cu_sex;
          this.$run4xml("edt_user_info", params, (err, res) => {
            if (!err) {
              this.dialogUserInfo = false;
            } else {
              throw new Error(err);
            }
          });
        } else {
          this.dialogUserInfo = false;
        }
        if (this.oldPwd && this.newPwd && this.submitPwd) {
          if (this.newPwd === this.submitPwd) {
            //修改密码
            params["oldpwd"] = this.$tohex(this.oldPwd);
            params["newpwd"] = this.$tohex(this.newPwd);
            this.$http
              .post("/edtpwd", params, { emulateJSON: true })
              .then(res => {
                let r = res.bodyText;
                if (r == "ok") {
                  this.dialogUserInfo = false;
                  this.oldPwd = "";
                  this.newPwd = "";
                  this.submitPwd = "";
                  this.pwdPan = false;
                } else if (r === "no") {
                  this.$message.error("原始密码错误");
                } else {
                  throw new Error(res);
                }
              });
          } else {
            this.$message({
              message: "密码确认与新密码不一致",
              type: "warning"
            });
          }
        } else {
          this.dialogUserInfo = false;
        }
      } catch (error) {
        console.log(error);
        this.$message.error("服务器忙，请重试");
      }
    },
    sltImg() {
      document.getElementById("f").click();
    },
    uploadImg() {
      let fileObj = document.getElementById("f").files[0],
        type = fileObj.type,
        size = fileObj.size,
        istype = type.startsWith("image"),
        issize = size < 1 * 1024 * 1000,
        s = this;
      if (istype) {
        if (issize) {
          let xhr = new XMLHttpRequest(),
            fd = new FormData(),
            url = "/upload/file";
          fd.append("target", "user_avator");
          fd.append("files", fileObj);
          xhr.open("POST", url, true);
          xhr.send(fd);
          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
              let photoUrl = xhr.responseText,
                params = {
                  _id: s.$store.getters.me("_id"),
                  cu_photo: photoUrl
                };
              s.$run4xml("edt_user_info", params, (err, res) => {
                if (!err) {
                  s.mineInfo.cu_photo = photoUrl;
                } else {
                  s.$message.error("服务器忙，头像上传失败");
                }
              });
            }
          };
        } else {
          this.$message.error("文件过大，请上传小于 1M 的图片");
        }
      } else {
        this.$message.error("不支持该文件");
      }
    }
  }
};
</script>
<style scoped>
.avator {
  border-radius: 50%;
  margin: 0px auto;
  display: block;
  margin-top: -90px;
  border: 3px solid #ffffff;
}
.t {
  border: none;
}
.user_info p {
  border-bottom: 1px solid #ececec;
  line-height: 40px;
}
.user_info span {
  display: inline-block;
  width: 60px;
}
.user_info label {
  color: #444444;
}
.user_info input {
  border: none;
  outline: none;
  width: 250px;
  margin-right: 0;
  text-align: right;
  color: #444444;
  font-size: 14px;
  background: transparent;
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
    Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
    sans-serif;
}
</style>
