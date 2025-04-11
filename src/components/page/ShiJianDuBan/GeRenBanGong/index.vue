<template>
  <el-card>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="我的发起" name="first">
        <div>
          <faqi v-if="activeName == 'first'"></faqi>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的待办" name="second">
        <div>
          <daiban v-if="activeName == 'second'"></daiban>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的已办" name="third">
        <div>
          <yiban v-if="activeName == 'third'"></yiban>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import daiban from "./daiban.vue";
import yiban from "./yiban.vue";
import faqi from "./faqi.vue";
export default {
  name: "gerenbangong",
  data() {
    return {
      activeName: "first",
    };
  },
  components: {
    daiban,
    yiban,
    faqi,
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>