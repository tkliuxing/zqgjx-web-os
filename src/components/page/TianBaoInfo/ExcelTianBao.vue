<template>
  <div class="excel-tianbao">
    <div class="title">{{ tianbao.name }}</div>
    <div class="desc">{{ tianbao.desc }}</div>
    <div class="file" v-if="tianbao.file">
      <div class="file-bg" @click="download">下载Excel模版</div>
    </div>
    <div v-if="file" style="margin-bottom: 50px">
      文件: <span @click="downLoadFile(file)">{{ file ? '查看/预览' : '' }}</span>
    </div>
    <div class="upload">
      <SingleFileUpload
        v-if="!file"
        @change="afterRead"
        :on-error="onError"
        :on-progress="onProgress"
      />
      <SingleFileUpload
        v-else
        @change="afterRead"
        accept=".xls,.xlsx"
        :on-error="onError"
        :on-progress="onProgress"
      >
        重新上传
      </SingleFileUpload>
    </div>
  </div>
</template>

<script>
import resource from "@/resource";
import { mapState } from "vuex";
import SingleFileUpload from "@/components/common/SingleFileUpload";
import "vant/lib/index.css";

export default {
  components: {
    SingleFileUpload,
  },
  data() {
    return {
      tianbao: {
        pk: null,
        name: "",
        desc: "",
        is_kaiqi: "是",
        start_time: "",
        end_time: "",
        file: "",
      },
      file: null,
      uid: null,
    };
  },
  async created() {
    if (!this.token) {
      this.$router.push({
        path: "/log",
      });
      return;
    }
  },
  methods: {
    //查看附件
    downLoadFile(file) {
      window.open(file)
    },
    async loadTianBao() {
      if (!this.$route.query.id) {
        this.$toast("参数错误");
        return;
      }
      try {
        let id = this.$route.query.id;
        let data = {
          biz_id: this.$bizCode.tianbao_biz,
          src_id: this.$sourceCode.source_id,
          template_id: "FT140710482218266624",
        };
        this.tianbao = await resource.getObj("data", id, data);
        console.log(this.tianbao);
        document.title = this.tianbao.name;
      } catch (e) {
        console.err(e);
      }
    },

    download() {
      let save_link = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      save_link.href = this.tianbao.file;
      save_link.download =
        this.tianbao.name + this.tianbao.file.split(".").slice(-1)[0];
      let event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      save_link.dispatchEvent(event);
    },
    // 上传文件
    async afterRead(file, fileList) {
      this.$toast.loading({
        message: "上传中...",
        forbidClick: true,
        duration: 0,
      });
      let url = file.response.file;
      let data = {
        biz_id: this.$bizCode.tianbao_biz,
        src_id: this.$sourceCode.source_id,
        user_id: this.userinfo.pk,
        user_name: this.userinfo.full_name,
        tianbao_id: this.tianbao.pk,
        file: url,
        template_id:'FT140720949716258816'
      };
      try {
        await resource.createObj("data", data);
        this.file = url;
        this.$toast.clear();
        this.$toast("提交成功");
      } catch (e) {
        console.err(e);
      } finally {
        this.uploading = false;
      }
    },
    onError() {
      this.uploading = false;
    },
    onProgress() {
      this.uploading = true;
    },
  },
  mounted() {
    this.loadTianBao();
  },
  computed: {
    ...mapState(["token","userinfo"]),
  },
};
</script>

<style>
.excel-tianbao {
  padding: 20px;
}
.excel-tianbao .title {
  text-align: center;
  padding: 10px 0;
}
.excel-tianbao .desc {
  font-size: 14px;
  color: #666;
  text-align: center;
  line-height: 1.5;
}
.file-bg {
  height: 200px;
  width: 100%;
  background: #fafafa;
  margin-top: 20px;
  text-align: center;
  line-height: 200px;
  color: #1989fa;
  border: 1px dashed #ddd;
  border-radius: 6px;
}
</style>
