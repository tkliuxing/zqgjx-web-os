<template>
    <el-table
        stripe
        border
        :data="data"
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }">
        <el-table-column label="填报名称">
            <template slot-scope="{ row }">
                <el-checkbox v-model="checked">
                    {{ row.title}}
                </el-checkbox>
            </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
    </el-table>
</template>

<script>
import resource from "@/resource";

export default {
    data(){
        return{
            data: [],
            page: 1,
            pageSize: 15,
            total: 0,
        }
    },
    methods: {
        async loadData() {
            let params = {
                form_type: 1,
                page: this.page,
                pageSize: this.pageSize,
                biz_id: this.$bizCode.tianbao_biz,
                src_id: this.$sourceCode.source_id,
                template_id: "FT181649085367160832",
            };
            let res = await resource.getList("data", params);
            this.data = res.data;
            this.total = res.count;
            console.log(this.data)
        },
    },
    async created() {
        await this.loadData();
    }
}
</script>

<style scoped>

</style>