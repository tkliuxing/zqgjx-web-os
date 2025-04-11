<template>
  <div class="example">
    <gridedit v-if="loadDone" :is-data="tableData" :tid="tid" @loadData="loadData"></gridedit>
  </div>
</template>

<script>
import GridEdit from "./common/GridEdit";
import resource from '@/resource';
import axios from "axios";
import {BASE_HOST} from "@/constvars";
import {mapState} from "vuex";

export default {
  name: "PageTest",
  components: {'gridedit': GridEdit},
  computed: {
    ...mapState(["userinfo"]),
  },
  data() {
    return {
      tid: this.$route.params.id,
      data: [],
      templateData: {},
      tableData: {header:[], data: [], title: "", boxplotData:false},
      loadDone: false,
    }
  },
  methods: {
    //权限判断的方法
    hasPerm(name) {
      return this.userinfo.func_names.indexOf(name) > -1;
    },
    async loadTemplate(){
      const resp = await axios.get(`${BASE_HOST}/api/v1/formtemplate/${this.tid}/`);
      this.templateData = resp.data;
      this.tableData.title = resp.data.title;
      this.tableData.header = resp.data.field.map((val)=>{
        val.title = val.col_title;
        val.key = val.alias ||val.col_name;
        return val
      })
    },
    async loadData(){
      let params = {
        template_id: this.tid,
        o:'-create_time'
      }
      if(this.hasPerm("查看填报汇总")){
        params.user_id=this.userinfo.pk;
      }
      this.tableData.data = await resource.getList(`data`, params);
      // this.tableData.data = await resource.getList(`data`, {template_id: this.tid, o:'create_time'});
    }
  },
  async mounted() {
    this.tid = this.$route.params.id;
    await this.loadTemplate();
    await this.loadData();
    this.loadDone = true;
  }
}
</script>

<style>
.example{
  height: 600px;
  background-color: #ffffff;
}

</style>

