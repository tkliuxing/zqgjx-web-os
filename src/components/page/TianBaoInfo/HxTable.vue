<template>
  <div class="table" >
    <table>
      <thead>
        <tr>
          <th>选项</th>
          <th v-for="(item, index) in tableth" :key="index">{{ item.col_title }}</th>
        </tr>
        <tr v-for="(item, index) in tabletr" :key="index">
          <td>{{ item }}</td>
          <td v-for="(tditem, tdindex) in tableth" :key="tdindex">
            <div v-for="(info, infoindex) in tableitem" :key="infoindex">
              <div v-if="index === infoindex">
                {{ info.result[tditem.col_name] }}
              </div>
            </div>
          </td>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
export default {
  props: ["tableth", "tabletr", "tableitem"],
  watch: {
    tableitem: {
      handler(newName, oldName) {
        this.tableitem = newName;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {},
};
</script>

<style scoped>
.table{
  overflow-x:auto;
}
table {
  border-collapse: collapse;
  margin: 0 auto;
  text-align: center;
  width: auto;
}
table td,
table th {
  border: 1px solid #ebeef5;
  color: #666;
  height: 40px;
  font-weight: normal;
  font-size: 14px;
  white-space: nowrap;
  padding:0 10px;
}
table thead th {
  background-color: #f5f7fb;
}
table tr:nth-child(odd) {
  background: #f5f7fb;
}
table tr:nth-child(even) {
  background: #fff;
}
</style>
