<template>
<!-- 面包屑导航区 -->
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" v-model="param.query" clearable @clear="clearAndSearch">
            <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <!-- 添加按钮 -->
          <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" stripe border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          prop="username"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态">
          <template slot-scope="scope">
            <el-switch @change="stateChange(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="editUser(scope.row.id)" size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button @click="deleteUser(scope.row.id)" size="mini" type="danger" icon="el-icon-delete"></el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="param.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="addUserDialogClosed">
      <!-- 弹出框主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹出框按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户弹出框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialogVisible"
      width="50%"
      @close="editUserDialogClosed">
      <!-- 弹出框主体 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹出框按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserDialogSubmit(editForm.id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
      if (regEmail.test(value)) {
        return callback()
      } else {
        return callback(new Error('请输入合法的邮箱'))
      }
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        return callback(new Error('请输入合法的手机号'))
      }
    }
    return {
      userList: [],
      param: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios_.get('users', { params: this.param })
      this.userList = res.data.users
      this.total = res.data.total
      console.log(this.userList)
    },
    handleSizeChange(newSize) {
      this.param.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.param.pagenum = newPage
      this.getUserList()
    },
    async stateChange(stateInfo) {
      console.log(stateInfo)
      const { data: res } = await this.$axios_.put(`users/${stateInfo.id}/state/${stateInfo.mg_state}`)
      if (res.meta.status !== 200) {
        stateInfo.mg_state = !stateInfo.mg_state
        return this.$message.error('修改状态失败')
      }
      return this.$message.success('修改成功')
    },
    searchUser() {
      this.getUserList()
    },
    clearAndSearch() {
      this.getUserList()
    },
    addUserDialogClosed() {
      this.$refs.addForm.resetFields()
    },
    addUser() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return false
        } else {
          console.log(this.$refs.addForm)
          const { data: res } = await this.$axios_.post('users', this.addForm)
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg)
            this.addUserDialogVisible = false
            this.getUserList()
          } else {
            console.log(res)
            this.$message.error(res.meta.msg)
          }
        }
      })
    },
    async editUser(id) {
      this.editUserDialogVisible = true
      const { data: res } = await this.$axios_.get('users/' + id)
      if (res.meta.status === 200) {
        this.editForm = res.data
        console.log(this.editForm)
        this.$message.success(res.meta.msg)
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    editUserDialogClosed() {
      this.$refs.editForm.resetFields()
    },
    async editUserDialogSubmit(id) {
      const { data: res } = await this.$axios_.put(`users/${id}`, { id: this.editForm.id, email: this.editForm.email, mobile: this.editForm.mobile })
      console.log(res)
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg)
        this.editUserDialogVisible = false
        this.getUserList()
      }
    },
    async deleteUser(id) {
      const { data: res } = await this.$axios_.delete('users/' + id)
      if (res.meta.status === 200) {
        this.getUserList()
        this.$message.success(res.meta.msg)
      }
    }
    // }).then(() => {
    //   this.$message({
    //     type: 'success',
    //     message: '删除成功!'
    //   })
    // }).catch(() => {
    //   this.$message({
    //     type: 'info',
    //     message: '已取消删除'
    //   })
    // })
    // console.log(id)
  }
}
</script>

<style>
.el-table{
  margin-top: 10px;
  font-size: 10px;
  margin-bottom: 10px;
}
</style>
