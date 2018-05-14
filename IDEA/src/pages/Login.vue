<template>
  <div class="login">
      <div class="SignFlowHomepage" :style='{backgroundImage:"url(" + bgimg + ")"}'>
        <div style="height:100%">
          <div id="sc" class="clec"></div>
          <div style="position:absolute;width:100%" class="SignFlowHomepage-content">
            <div class="Card SignContainer-content">
              <div class="SignFlowHeader" style="padding-bottom:5px;">
                <img width="140" :src="require('@/assets/img/logo.png')" alt="">
                <div class="SignFlowHeader-slogen" data-reactid="48">登录IDEA，发现更大的世界</div>
              </div>
              <div class="SignContainer-inner" style="position: relative;margin-top:30px">
                <div style="padding:0 40px 36px">
                    <el-form status-icon :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                        <el-form-item label="" prop="uid">
                          <el-input v-model="ruleForm.uid"  type="text"  placeholder="通行证号"  auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="pwd">
                          <el-input v-model="ruleForm.pwd" type="password" placeholder="密码" auto-complete="off"></el-input>
                      </el-form-item>
                      
                       <div class="Login-options">
                        <button class="Button Login-switchType" type="button">注册为用户</button>
                        <button class="Button Login-cannotLogin" type="button">忘记密码？</button>
                    </div>
                    </el-form>
                  
                     <el-button @click="login" type="primary" style="width:100%;margin-top:40px">登录</el-button>
                      
                </div>
              </div>
            </div>
        </div>
        </div>
      </div>
  </div>
</template>
<script>
import cleCanvas from "@/modules/cleCanvas";
export default {
  data() {
    return {
      ruleForm: {
        uid: "",
        pwd: ""
      },
      bgimg: require("@/assets/img/logbg.png"),
      rules: {
        uid: [{ required: true, message: "请输入通行证号", trigger: "blur" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    new cleCanvas({
      canvasContainerID: "sc",
      circleColor: "rgba(49,210,142,0.8)",
      lineColor: "rgba(49,210,142,1)",
      canvasOpacity: 0.25
    });
  },
  methods: {
    login() {
      let s = this,
        params = {
          uid: s.$tohex(s.ruleForm.uid),
          pwd: s.$tohex(s.ruleForm.pwd)
        };
      if (params.uid && params.pwd) {
        this.$http
          .post(`/login`, params, { emulateJSON: true })
          .then(res => {
            let r = JSON.parse(res.bodyText);
            if (r.cu_state == 0) {
              this.$store.commit('setUserInfo',r)
              s.$router.replace("/home");
            } else {
              s.$message.error("通行证或密码错误");
            }
          })
          .catch(res => {
            //callback(res);
          });
      } else {
        s.$message({
          message: "通行证号和密码不能为空",
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  overflow: hidden;
  .SignFlowHomepage {
    background-repeat: no-repeat;
    background-color: #b8e5f8;
    background-size: cover;
    width: 100%;
    height: 100vh;
    overflow: auto;
    padding-right: 15px;
    .SignFlowHomepage-content {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      border-radius: 2px;
      min-height: 100%;
      height: calc(100% - 42px);
      box-sizing: border-box;
      .SignContainer-content {
        width: 432px;
        margin: 0 auto;
        text-align: center;
      }
      .Card {
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
        box-sizing: border-box;
        .SignFlowHeader {
          padding-top: 30px;
          .SignFlowHeader-slogen {
            margin-top: 15px;
            color: #0084ff;
            font-size: 22px;
          }
        }
      }
    }
  }
}
.Login-options {
  margin-top: -7px;
  height: 20px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  background: #fff;
}
.Button {
  height: auto;
  padding: 0;
  line-height: inherit;
  background-color: transparent;
  border: none;
  border-radius: 0;
  color: #8590a6;
  text-align: center;
  cursor: pointer;
  background: none;
  font-size: 14px;
  display: inline-block;
}
.Login-switchType {
  color: #175199;
}
.Login-cannotLogin {
  float: right;
}
.Login-switchType:hover {
  box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
}
.Login-cannotLogin:hover,
html[data-theme="dark"] .Login-cannotLogin:hover {
  color: gray;
}
.clec {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 0;
}
</style>
