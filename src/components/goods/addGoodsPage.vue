<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="消息提示的文案" type="info" center show-icon> </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        label-position="top"
        :rules="formRule"
        ref="addFormRef"
      >
        <el-tabs
          v-model="activeName"
          tabPosition="left"
          :before-leave="beforeLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item>
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id'
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(item1, i) in item.attr_vals"
                  :key="i"
                  :label="item1"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :key="item.attr_id"
              v-for="item in onlyList"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="imgUploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload></el-tab-pane
          >
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button id="confirmAddBtn" type="primary" @click="confirmAdd"
              >确认添加</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @close="dialogClosed"
    >
      <img :src="previewImgUrl" class="preImg" />
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeName: '',
      // 激活的tag页和step页面的索引
      activeIndex: '0',
      // 表单
      addForm: {
        goods_name: '1',
        goods_cat: [],
        goods_price: '1',
        goods_number: '1',
        goods_weight: '1',
        goods_introduce: '',
        pics: [],
        attrs: []
        // cascader选中的商品分类数组 ×
      },
      // ruels
      formRule: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ]
      },
      // cateList商品分类的列表
      cateList: [],
      // 动态参数列表
      manyList: [],
      // 静态属性列表
      onlyList: [],
      // 图片上传路径
      imgUploadUrl: 'http://49.235.75.29:8888/api/private/v1/upload',
      // 为图片上传组件设置请求头
      headerObj: { Authorization: window.sessionStorage.getItem('token') },
      // 图片预览对话框的可见性
      dialogVisible: false,
      // 图片预览路径
      previewImgUrl: 'http://49.235.75.29:8888/'
    }
  },
  // 方法属性
  // 方法属性
  // 方法属性
  // 方法属性
  // 方法属性'
  methods: {
    // 获取cateList
    async getCateList() {
      const { data: res } = await this.$axios_.get('categories', { type: 3 })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      // console.log(res)
      this.cateList = res.data
    },
    // 当级联选择器选中项发生变化时调用这个函数
    handleChange() {
      // console.log(this.cascaderSelectKeys)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      console.log(this.addForm.goods_cat)
    },
    // 当tags标签页要切换时
    beforeLeave(activeIndex, oldIndex) {
      // console.log(`将从${oldIndex}切换到${newIndex}`)
      // console.log(oldIndex, '->', activeIndex)
      // 若是没有选择商品分类则阻止向下翻页
      if (oldIndex === '0' && this.addForm.goods_cat.length !== 3) {
        console.log('false')
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // tab栏被点击
    async tabClicked() {
      if (this.activeName == '1') {
        const { data: res } = await this.$axios_.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        // console.log(res)
        res.data.forEach((element) => {
          element.attr_vals =
            element.attr_vals.length === 0 ? [] : element.attr_vals.split(' ')
        })
        this.manyList = res.data
      } else if (this.activeName == '2') {
        const { data: res } = await this.$axios_.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        // console.log(res)
        this.onlyList = res.data
      }
    },
    // 图片预览触发的函数
    handlePreview(file) {
      console.log(file)
      this.previewImgUrl = this.previewImgUrl + file.response.data.tmp_path
      console.log(this.previewImgUrl)
      this.dialogVisible = true
    },
    // 图片删除触发的函数
    handleRemove(file) {
      // console.log(file)
      // file.response.data.tmp_path
      const x = this.addForm.pics.findIndex((x) => {
        x.pic === file.response.data.url
      })
      this.addForm.pics.splice(x, 1)
      console.log(this.addForm)
    },
    // 图片上传成功触发的函数
    handleSuccess(res) {
      if (res.meta.status !== 200) {
        return this.message.error(res.meta.msg)
      }
      const info = { pic: res.data.tmp_path }
      // console.log(res)
      this.addForm.pics.push(info)
      console.log(this.addForm)
    },
    // 图片预览对话框关闭时
    dialogClosed() {
      this.previewImgUrl = 'http://49.235.75.29:8888/'
    },
    // 确认添加按钮
    confirmAdd() {
      this.$refs.addFormRef.validate(async (flag) => {
        if (!flag) {
          return this.$message.error('请填写商品信息')
        }
        // console.log(this.addForm)
        // console.log(from, this.manyList, this.onlyList)
        // 处理动态参数
        this.manyList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        const { data: res } = await this.$axios_.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  },
  // 创建页面成功时的钩子
  // 创建页面成功时的钩子
  // 创建页面成功时的钩子
  // 创建页面成功时的钩子
  // 创建页面成功时的钩子
  created() {
    this.getCateList()
  },
  // 计算属性
  // 计算属性
  // 计算属性
  // 计算属性
  // 计算属性
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style>
.el-tabs {
  margin-top: 15px;
}
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
.preImg {
  width: 100%;
}
.ql-editor {
  min-height: 300px !important;
}
#confirmAddBtn {
  margin-top: 15px;
}
</style>