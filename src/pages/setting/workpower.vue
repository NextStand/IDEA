<template>
  <div>
    <el-upload
      action="/upload/file"
      name="files"
      list-type="picture-card"
      :multiple="true"
      :data="p"
      :before-remove="handleRemove"
      :on-success="handleSuccess"
      >
      <i class="el-icon-plus"></i>
    </el-upload>
    <button @click="test">测试</button>
  </div>

</template>
<script>
export default {
  data() {
    return {
      p: {
        target: "mps_test",
        da_billid: "20180130001"
      }
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file.response);
      this.$run4xml(
        "del_files_list",
        "da_path=" + file.response + "&del=true",
        (err, res) => {
          console.log(res);
        }
      );
    },
    handleSuccess(response, file, fileList) {
      console.log(response);
    },
    test() {
      let uid = this.$prop("self")["_id"];
      this.$run4xml("get_login_menu","uid="+uid,(err,res)=>{
        console.log(res);
      })
    }
  }
};
</script>
