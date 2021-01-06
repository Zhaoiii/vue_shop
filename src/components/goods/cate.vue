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
      <el-button type="primary" id="addcate" @click="shouAddCateDialog">添加分类</el-button>
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
    <!-- 添加分类弹出框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed">
      <el-form ref="addCateFormRef" label-width="100px" :rules="addCateFormRules" :model="addCateForm">
        <!-- 分类名称部分 -->
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 类别部分 -->
        <el-form-item label="选择父类">
          <el-cascader
            v-model="selectedParentKeys"
            :options="parentList"
            :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id'}"
            @change="selectedParentKeysChange" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogConfirmBtn">确 定</el-button>
      </span>
    </el-dialog>
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
      total: 0,
      // 添加商品分类表单
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 添加商品分类弹出框可见性
      addCateDialogVisible: false,
      // 添加商品分类表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 父类列表
      parentList: [],
      // 被选中的父类
      selectedParentKeys: []
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
    },
    // 添加分类按钮，点击显示dialog
    shouAddCateDialog() {
      // 打开添加分类弹出框先获取父分类
      this.getParentList()
      this.addCateDialogVisible = true
    },
    async getParentList() {
      const { data: res } = await this.$axios_.get('categories', { params: { type: 2 } })
      // console.log('父类', res)
      this.parentList = res.data
    },
    selectedParentKeysChange() {
      // console.log(this.selectedParentKeys)
      if (this.selectedParentKeys.length === 1) {
        this.addCateForm.cat_level = 1
        this.addCateForm.cat_pid = this.selectedParentKeys[0]
      } else if (this.selectedParentKeys.length === 2) {
        this.addCateForm.cat_level = 2
        this.addCateForm.cat_pid = this.selectedParentKeys[1]
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    // 添加分类弹出框关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedParentKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 添加分类弹出框确定按钮
    async addCateDialogConfirmBtn() {
      console.log(this.addCateForm)
      const { data: res } = await this.$axios_.post('categories', this.addCateForm)
      if (res.meta.status !== 201) {
        console.log(res)
        return this.$message.error('添加失败')
      }
      this.$message.success(res.meta.msg)
      this.getGoodsCateList()
      this.addCateDialogVisible = false
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
.el-cascader-panel{
  height: 200px;
}
</style>
