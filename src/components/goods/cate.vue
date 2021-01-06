<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-button type="primary" id="addcate">添加分类</el-button>
      <!-- 表格区 -->
      <tree-table :data="goodsCateList" :columns="columns" :selection-type="false" :expand-type="false"
      :show-index="true" index-text="#">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <template slot="catlevel" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="catbtn">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="param.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="param.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 定义商品分类列表
      goodsCateList: [],
      // 定义tree-table的columns
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'catlevel'
        },
        {
          label: '操作',
          type: 'template',
          template: 'catbtn',
          width: '200px'
        }
      ],
      // 获取商品数据的参数列表
      param: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 数据总页数
      total: 0
    }
  },
  methods: {
    // 获取商品分类列表
    async getGoodsCateList() {
      const { data: res } = await this.$axios_.get('categories', { params: this.param })
      if (res.meta.status !== 200) {
        return this.$message.error('请求失败')
      }
      console.log('商品分类', res)
      this.goodsCateList = res.data.result
      this.total = res.data.total
    },
    // 分页区
    handleSizeChange(val) {
      this.param.pagesize = val
      this.getGoodsCateList()
    },
    handleCurrentChange(val) {
      this.param.pagenum = val
      this.getGoodsCateList()
    }
  },
  created() {
    this.getGoodsCateList()
  }
}
</script>

<style>
#addcate{
  margin-bottom: 20px !important;
}
</style>
