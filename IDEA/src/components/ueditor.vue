<template>
  <div>
    <script id="ueditor" type="text/plain"></script>
  </div>
</template>
<script>
export default {
  name: "ueditor",
  data() {
    return {
      editor: null
    };
  },
  mounted() {
    this.editor = window.UE.getEditor("ueditor");
  },
  methods: {
    getAllHtml() {
      //获得整个html的内容
      return this.editor.getAllHtml();
    },
    getContent() {
      //获得内容
      return this.editor.getContent();
    },
    setContent(content) {
      //写入内容
      this.editor.setContent(content);
    },
    appendContent(content) {
      //追加内容
      this.editor.setContent(content, true);
    },
    getContentTxt() {
      //获得纯文本
      return this.editor.getContentTxt();
    },
    getPlainTxt() {
      //获取带格式的纯文本
      return this.editor.getPlainTxt();
    },
    getSltText() {
      //获得当前选中的文本
      let range = this.editor.selection.getRange();
      range.select();
      return this.editor.selection.getText();
    },
    insertHtml(content) {
      //插入给定的内容
      var value = prompt(content, "");
      this.editor.execCommand("insertHtml", value);
    },
    hasContents() {
      //判断编辑器中是否有内容
      return this.editor.hasContents();
    },
    setFocus() {
      //使编辑器获取焦点
      this.editor.focus();
    },
    setBlur() {
      //使编辑器失去焦点
      this.editor.blur();
    },
    isFocus() {
      //编辑器是否获得焦点
      this.editor.isFocus();
    },
    setEnabled() {
      //设置编辑器为可编辑
      this.editor.setEnabled();
    },
    setDisabled() {
      //设置编辑器为不可编辑
      this.editor.setDisabled("fullscreen");
    },
    setHide() {
      //隐藏编辑器
      this.editor.setHide();
    },
    setShow() {
      //显示编辑器
      this.editor.setShow();
    },
    destroy() {
      //销毁实例
      this.editor.destroy();
    }
  },
  destroyed() {
    this.editor.destroy();
  }
};
</script>