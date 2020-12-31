<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-table :data="rightsList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$axios_.get('rights/list')
      if (res.meta.status === 200) {
        this.rightsList = res.data
      }
      console.log(this.rightsList)
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>

<style>
</style>
