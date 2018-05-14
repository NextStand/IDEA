<template>
<div>
   <!--  <input type="file" id="f" />
    <br />   
    <input type="button" value="up" @click="up()" />
    <br /> -->
    <!--进度条标签-->
    <!-- <progress value="0" max="100" id="progress" style="height: 20px; width: 100%"></progress>
    <br /> -->
    <!--div模拟进度条-->
    <!-- <div id="progressNumber" style="width: 0%; height: 20px; background-color: Red"></div>
    <br />
    <div id="result"></div> -->
    <ul id="img-panel" class="el-upload-list1 el-upload-list--picture-card1">
      <li class="el-upload-list__item1 is-success1">
        <div class="r_out">
          <div class="r_in">
            <div id="c3" class="r_c c3"></div>
            <div id="r_num" class="r_num"></div>
          </div>
        </div>
      </li>
      <li tabindex="0" class="el-upload-list__item1 is-success1">
        <img src="http://img4.imgtn.bdimg.com/it/u=4017089485,3500578897&fm=27&gp=0.jpg" alt="" class="el-upload-list__item-thumbnail1">
        <a class="el-upload-list__item-name1">
          <i class="el-icon-document1"></i>IMG_7465-1517205421136.JPG
        </a>
        <label class="el-upload-list__item-status-label1">
          <i class="el-icon-upload-success1 el-icon-check1"></i>
        </label>
        <i class="el-icon-close"></i>
        <!---->
        <span class="el-upload-list__item-actions1">
          <!---->
          <span class="el-upload-list__item-delete1">
            <i class="el-icon-delete1"></i>
          </span>
        </span>
      </li>
    </ul>
    <div @click.stop="slt" tabindex="0" class="el-upload1 el-upload--picture-card1">
      <i class="el-icon-plus1"></i>
      <input @change="uploadImg" id="f" accept="image/*" type="file" name="logo" class="el-upload__input1">
    </div>
</div>
</template>
<script>
export default {
  methods: {
    slt() {
      document.getElementById("f").click();
    },
    up() {
      if (document.getElementById("f").value == "") {
        document.getElementById("result").innerHTML = "请选择文件";
      } else {
        var fileObj = document.getElementById("f").files[0];
        //创建xhr
        var xhr = new XMLHttpRequest();
        //进度条部分
        xhr.upload.onprogress = function(evt) {
          if (evt.lengthComputable) {
            var percentComplete = Math.floor(evt.loaded * 100 / evt.total);
            document.getElementById("c3").style.height = percentComplete + "%";

            document.getElementById("r_num").innerHTML = percentComplete + "%";
          }
        };
        var url = "/upload/photos";
        //FormData对象
        var fd = new FormData();
        fd.append("path", "D:\\");
        fd.append("logo", fileObj);
        fd.append("acttime", new Date().toString());
        xhr.open("POST", url, true);
        xhr.send(fd);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            /*  var result = xhr.responseText;
            document.getElementById("result").innerHTML = result; */
          }
        };
      }
    }
  }
};
</script>
<style scoped>
.el-upload-list1 {
  padding: 0;
  list-style: none;
}

.el-upload-list--picture-card1 {
  margin: 0;
  display: inline;
  vertical-align: top;
}

.el-upload-list--picture-card1 .el-upload-list__item1 {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  display: inline-block;
}

.el-upload-list__item1 {
  -webkit-transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin-top: 5px;
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 4px;
  width: 100%;
}

.el-upload-list--picture-card1 .el-upload-list__item-thumbnail1 {
  width: 100%;
  height: 100%;
}

.el-upload-list--picture-card1 .el-upload-list__item-status-label1 {
  position: absolute;
  right: -15px;
  top: -6px;
  width: 40px;
  height: 24px;
  background: #13ce66;
  text-align: center;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
}

.el-upload-list__item.is-success1 .el-upload-list__item-status-label1 {
  display: block;
}

.el-upload-list--picture-card1 .el-upload-list__item1 {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  display: inline-block;
}

.el-upload--picture-card1:hover,
.el-upload1:focus {
  border-color: #409eff;
  color: #409eff;
}

.el-upload--picture-card1 {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  line-height: 146px;
  vertical-align: top;
}

.el-upload1 {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  outline: 0;
}

.el-upload__input1 {
  display: none;
}

[class*=" el-icon-"],
[class^="el-icon-"] {
  font-family: element-icons !important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.el-upload--picture-card1 i {
  width: 28px;
  height: 28px;
  background-image: url("http://img1.imgtn.bdimg.com/it/u=1961843499,2490847484&fm=27&gp=0.jpg");
  background-size: 100%;
}
.r_out {
  border: 4px solid #d9d9d9;
  background: #fff;
  box-shadow: 3px 3px 5px #bfbfbf;
  -webkit-box-shadow: 3px 3px 5px #bfbfbf;
  -moz-box-shadow: 3px 3px 5px #bfbfbf;
  -ms-box-shadow: 3px 3px 5px #bfbfbf;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -ms_border-radius: 50%;
  display: inline-block;
  margin-right: 50px;
  position: relative;
}

.r_out p {
  position: absolute;
  bottom: -50px;
  color: #000;
  text-align: center;
  margin: 0 auto;
  width: 100%;
  font-size: 16px;
  line-height: 1.5;
  font-weight: bold;
}

.r_in {
  width: 120px;
  height: 120px;
  border: 5px solid #fff;
  margin: 0 auto;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -ms_border-radius: 50%;
  overflow: hidden;
  position: relative;
}

.r_c {
  width: 120px;
  height: 120px;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0;
}

.c3 {
  background: #00adc7;
  height: 0%;
}

.r_num {
  color: #404040;
  font-size: 40px;
  line-height: 1.5;
  font-weight: bold;
  position: absolute;
  top: 50%;
  margin-top: -25px;
  text-align: center;
  width: 100%;
}
</style>
