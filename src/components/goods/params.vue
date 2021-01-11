<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 警告提示 -->
      <el-alert title="警告提示的文案" type="warning" show-icon> </el-alert>
      <!-- 级联选择器 -->
      <label for="">选择商品分类：</label>
      <el-cascader
        v-model="selectGoodsCatekey"
        :options="allGoodsCateList"
        :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id' }"
        @change="handleChange"
      >
      </el-cascader>
      <!-- 标签页 -->
      <el-tabs v-model="defaultTabPane" @tab-click="TabClick">
        <!-- 动态参数页面 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyList">
            <el-table-column type="expand" prop="attr_vals">
              <template slot-scope="scope">
                <!-- 扩展列的tag标签 -->
                <el-tag
                  closable
                  @close="tagClose(scope.row, i)"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.tagInputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editBtn(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteBtn(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性页面 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyList">
            <el-table-column type="expand" prop="attr_vals">
              <template slot-scope="scope">
                <!-- 扩展列的tag标签 -->
                <el-tag
                  closable
                  @close="tagClose(scope.row, i)"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.tagInputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editBtn(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteBtn(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性/参数弹出框 -->
    <el-dialog
      :title="'添加' + addDialogTitle"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRule"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogConfirmBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑属性/参数弹出框 -->
    <!-- 编辑属性/参数弹出框 -->
    <!-- 编辑属性/参数弹出框 -->
    <el-dialog
      :title="'编辑' + addDialogTitle"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRule"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirmBtn"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑属性/参数弹出框 -->
    <!-- 编辑属性/参数弹出框 -->
    <!-- 编辑属性/参数弹出框 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有的商品分类列表
      allGoodsCateList: [],
      // 级联选择器选择的商品分类
      selectGoodsCatekey: [],
      // 指定标签页的默认展示页
      defaultTabPane: 'many',
      // 储存当前激活的tag页面
      activeName: 'many',
      // 动态参数列表
      manyList: [],
      // 静态属性列表
      onlyList: [],
      // 添加参数/属性弹出框
      addDialogVisible: false,
      // 添加属性/参数表单
      addForm: {
        attr_name: ''
      },
      addFormRule: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ]
      },
      // 编辑参数/属性弹出框可见性
      editDialogVisible: false,
      // 正在编辑的参数/属性
      attr: {}
      // 添加tag标签
      // dynamicTags: [],
    }
  },
  methods: {
    // 获取所有的商品分类
    async getallGoodsCateList() {
      const { data: res } = await this.$axios_.get('categories', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      // console.log(res)
      this.allGoodsCateList = res.data
    },
    // 级联选择器选中项发生变化时
    handleChange() {
      if (!this.isBtnDisabled) {
        console.log(this.selectGoodsCatekey)
        this.getParamsList()
      }
      this.manyList = []
      this.onlyList = []
    },
    // 切换tab页面时触发
    TabClick(tab) {
      if (!this.isBtnDisabled) {
        this.activeName = tab.name
        this.getParamsList()
      }
    },
    // 获取参数列表
    async getParamsList() {
      const {
        data: res
      } = await this.$axios_.get(`categories/${this.getCateId}/attributes`, {
        params: { sel: this.activeName }
      })
      console.log(res)
      res.data.forEach((element) => {
        element.attr_vals = element.attr_vals
          ? element.attr_vals.split(' ')
          : []
        element.tagInputValue = ''
        element.inputVisible = false
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      // this.$message.success(res.meta.msg)
      if (this.activeName === 'many') {
        this.manyList = res.data
      } else {
        this.onlyList = res.data
      }
    },
    // 添加属性/参数弹出框关闭事件
    addDialogClosed() {
      this.addForm.attr_name = ''
    },
    addDialogConfirmBtn() {
      this.$refs.addFormRef.validate(async (flag) => {
        if (!flag) {
          return
        }
        const {
          data: res
        } = await this.$axios_.post(`categories/${this.getCateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          console.log(res, this.addForm)
          return this.$message.error('获取失败')
        }
        this.$message.success(res.meta.msg)
        this.getParamsList()
        this.addDialogVisible = false
      })
    },
    // 编辑按钮
    async editBtn(row) {
      this.attr = row
      const { data: res } = await this.$axios_.get(
        `categories/${this.getCateId}/attributes/${row.attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.addForm.attr_name = res.data.attr_name
      this.editDialogVisible = true
    },
    // 编辑参数/属性弹出框的确定按钮
    editDialogConfirmBtn() {
      this.$refs.editFormRef.validate(async (flag) => {
        if (!flag) {
          return
        }
        const {
          data: res
        } = await this.$axios_.put(
          `categories/${this.getCateId}/attributes/${this.attr.attr_id}`,
          { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success(res.meta.msg)
        this.getParamsList()
        this.editDialogVisible = false
      })
    },
    // 编辑属性/参数弹出框关闭事件
    editDialogClosed() {
      this.addForm.attr_name = ''
      this.attr = {}
    },
    // 删除按钮
    async deleteBtn(row) {
      const result = await this.$confirm(
        '此操作将永久删除该数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      if (result === 'confirm') {
        const { data: res } = await this.$axios_.delete(
          `categories/${this.getCateId}/attributes/${row.attr_id}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success(res.meta.msg)
        this.getParamsList()
      }
    },
    // ↓扩展列的tag标签的添加
    showInput(row) {
      row.inputVisible = true
      console.log(row)
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(row) {
      if (row.tagInputValue.trim().length === 0) {
        row.inputVisible = false
        row.tagInputValue = ''
        return
      }
      this.saveTagInDb(row)
      row.attr_vals.push(row.tagInputValue)
      row.inputVisible = false
      row.tagInputValue = ''
    },
    // ↑扩展列的tag标签的添加
    // 点击关闭标签时
    tagClose(row, index) {
      this.saveTagInDb(row)
      row.attr_vals.splice(index, 1)
      // console.log(row, index)
    },
    // 将修改的tag数据落到数据库里去
    async saveTagInDb(row) {
      const { data: res } = await this.$axios_.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success(res.meta.msg)
    }
  },
  created() {
    // 创建时获取商品分类列表
    this.getallGoodsCateList()
  },
  // 计算属性
  computed: {
    // 判断按钮是否禁用，禁用返回true，反之返回false
    isBtnDisabled() {
      if (this.selectGoodsCatekey.length !== 3) {
        return true
      }
      return false
    },
    // 获取选中项的id
    getCateId() {
      if (this.selectGoodsCatekey.length === 3) {
        return this.selectGoodsCatekey[2]
      }
      return null
    },
    // 判断添加参数/属性弹出框的名字，是动态参数还是静态属性
    addDialogTitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style>
.el-alert {
  margin-bottom: 15px !important;
}
/* 添加tag标签的 */
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 100px !important;
  margin-left: 10px !important;
  vertical-align: bottom !important;
}
</style>
