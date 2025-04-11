<template>
    <el-cascader
        :value="form"
      :options="options"
       v-bind="$attrs"
      :props="{ expandTrigger: 'click' , checkStrictly: checkStrictly,label: label,children: children,value:value,emitPath:emitPath}"
      clearable
      @change="handleChange"></el-cascader>
</template>

<script>
export default {
  name: "mps-cascader",
  data() {
    return {
      options: null,
    }
  },
  model: {
    prop: "form"
  },
  props: {
    form: String,
    treeData:{
      type:Array,
      default(){
        return []
      }
    },
    checkStrictly:{
      type:Boolean,
      default:false
    },
    emitPath:{
      type:Boolean,
      default:false
    },
    label:{
      type:String,
      default:'label'
    },
    value:{
      type:String,
      default:'value'
    },
    children:{
      type:String,
      default:'items'
    },

  },
  watch:{
    treeData:{
      handler(val){
        this.options = this.getTreeData(JSON.parse(JSON.stringify(val)));
      },
      deep:true
    }
  },
  methods: {
    handleChange(value) {
      // let name = this.getName(value)
      this.$emit('change', value);
    },
    //处理项目分类
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].items.length < 1) {
          // items若为空数组，则将items设为undefined
          data[i].items = undefined;
        } else {
          // items若不为空数组，则继续 递归调用本方法
          this.getTreeData(data[i].items);
        }
      }
      return data;
    },
    // 根据选中的value,去获取name
    getName(value) {
      let options = this.options;
      let name = '';
      let getName = (value, options) => {
        for (let i = 0; i < options.length; i++) {
          if (options[i].pk == value) {
            name = options[i].name;
            return;
          } else {
            if (options[i].items) {
              getName(value, options[i].items)
            }
          }
        }
      }
      getName(value, options)
      return name;
    }
  }
}
</script>

<style scoped>

</style>