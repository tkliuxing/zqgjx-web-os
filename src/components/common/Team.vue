<template>
  <div class="team">
    <div class="team-title">选择部门</div>
    <el-tree :data="teamList" node-key="id" :props="{ children: 'items', label: 'name' }">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
        <span style="text-align: center">
          <button class="team-btn" @click="xzTeam(data, node)">选择</button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import resource from "@/resource.js";
export default {
  created() {
    this.getList();
  },
  props:{
    orgid:{
      type:Number,
      default:null 
    }
  },
  data() {
    return {
      teamList: [],
    };
  },
  methods: {
    async getList() {
      let resp = await resource.getList("flatdepartment", {org_id:this.orgid});
      this.teamList = resp;
      // console.log(resp)
    },
    xzTeam(dep, node) {
      let name_list = [];
      let bianli_parent = (node) => {
        if (node.data.name) {
          name_list.push(node.data.name);
          bianli_parent(node.parent);
        }
        if (!node.parent) {
          return;
        }
      };
      bianli_parent(node);
      let path_name = name_list.reverse().join(">");
      dep.path_name = path_name;
        this.$emit('activeTeam',dep)
    },
  },
};
</script>

<style>
.team-title {
  margin-bottom: 20px;
  color: #666;
}
.team {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 20px;
  overflow: hidden;
  overflow-y: scroll;
  z-index:9;
}
.team-btn {
  border: none;
  background: #e41e1e;
  color: #fff;
  font-size: 12px;
  padding: 4px 6px;
  border-radius: 3px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  padding: 10px 0;
}
.el-tree-node__content {
  height: 40px;
}
</style>
