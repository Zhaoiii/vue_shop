<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="search"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="700"
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
        ></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      // 获取商品数据列表时传入的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 分页总数
      total: 0
    }
  },
  // 方法属性
  // 方法属性
  // 方法属性
  // 方法属性
  // 方法属性
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$axios_.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    // 翻页时
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 到添加商品页面
    goAddPage() {
      this.$router.push('goods/add')
    },
    // 搜索商品
    search() {
      this.getGoodsList()
    }
  },
  // 创建时的钩子函数
  // 创建时的钩子函数
  // 创建时的钩子函数
  // 创建时的钩子函数
  // 创建时的钩子函数
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
</style>
