<template>
  <div>
    <el-select
        v-if="type === 'select'"
        :value="value"
        @input="$emit('input', $event)"
        clearable
        :multiple="type === 'multipleSelect'"
    >
      <el-option
          v-for="i in list"
          :key="i.pk"
          :label="i.name"
          :value="i.value"
      ></el-option>
    </el-select>
    <el-select
        v-if="type === 'multipleSelect'"
        :value="value"
        @input="getdisplayName"
        clearable
        :multiple="type === 'multipleSelect'"
    >
      <el-option
          v-for="i in list"
          :key="i.pk"
          :label="i.name"
          :value="i.value"
      ></el-option>
    </el-select>
    <el-checkbox-group
        v-else-if="type === 'checkbox'"
        :value="value"
        @input="getdisplayName"
    >
      <el-checkbox v-for="i in list" :label="i.value" :key="i.pk">
        {{ i.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-radio-group
        v-else-if="type === 'radio'"
        :value="value"
        @input="$emit('input', $event)"
    >
      <el-radio v-for="i in list" :key="i.pk" :label="i.value"></el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import resource from "@/resource";
export default {
  props: {
    type: String,
    value: [String, Array],
    source_info: Object,
    display: String,
  },
  data() {
    return {
      list: [],
    };
  },
  methods: {
    async initDataSource() {
      let info = this.source_info;
      if (info.source === 1) {
        let res = await resource.getList('baseconfigitem', {category__name: info.name});
        this.list = res.data;
      } else if (info.source === 2) {
        let url = JSON.parse(info.define)["url"];
        let name = JSON.parse(info.define)["name_field"];
        let value = JSON.parse(info.define)["value_field"];
        let res = await this.$http.get(`${url}`);
        this.list = res.data.map((i) => {
          return { name: i[name], value: i[value] };
        });
      } else {
        this.list = JSON.parse(info.define);
      }
    },
    getdisplayName($event) {
      let name = [];
      this.$emit("input", $event);
      this.list.forEach((i) => {
        $event.forEach((j) => {
          if (i.value === j) {
            name.push(i.name);
          }
        });
      });
      this.$emit("update:display", name.join(","));
    },
  },
  created() {
    this.initDataSource();
  },
};
</script>

<style>
</style>
