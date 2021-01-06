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
      <el-button type="primary" @click="addRoleBtnClick">添加角色</el-button>
      <el-table :data="roleList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['vCenter', 'bdbottom', i === 0 ? 'bdtop' : '']" v-for="(item, i) in scope.row.children" :key="item.id">
              <el-col :span="6">
                <el-tag closable @close="removeTagById(scope.row, item.id)">
                  {{item.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row :class="['vCenter', i1 === 0 ? '' : 'bdtop']" v-for="(item1, i1) in item.children" :key="item1.id">
                  <el-col :span="8">
                    <el-tag type="success" closable @close="removeTagById(scope.row, item1.id)">
                      {{item1.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-row v-for="(item2) in item1.children" :key="item2.id">
                        <el-col :span="8">
                          <el-tag type="warning" closable @close="removeTagById(scope.row, item2.id)">
                            {{item2.authName}}
                          </el-tag>
                        </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button @click="editBtn(scope.row)" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button @click="deleteBtn(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="setRightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 所有权限弹出框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="allrightsDialogVisible"
      width="30%"
      @close="allRightsDialogClosed">
      <el-tree :data="allRightsList" :props="rightsProps" show-checkbox node-key="id"
       default-expand-all :default-checked-keys="defaultleafKeys" ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allrightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色弹出框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible">
      <el-form ref="addRoleForm" :model="addRoleForm" label-width="80px" :rules="addRoleRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleDialogComfirmBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色编辑弹出框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible">
      <el-form ref="editRoleForm" :model="addRoleForm" label-width="80px" :rules="addRoleRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleDialogComfirmBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      allrightsDialogVisible: false,
      allRightsList: [],
      rightsProps: {
        children: 'children',
        label: 'authName'
      },
      defaultleafKeys: [],
      preSetRole: {},
      // 添加角色弹出框可见性
      addRoleDialogVisible: false,
      // 添加角色表单
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加觉得表单验证
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 编辑弹出框可见性
      editRoleDialogVisible: false,
      // 要编辑的角色
      roleInfo: {}
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$axios_.get('roles')
      if (res.meta.status === 200) {
        this.roleList = res.data
        console.log(this.roleList)
      }
    },
    async removeTagById(role, rightId) {
      // var r = confirm('确认删除')
      // if (r === true) {
      //   // console.log(roleId)
      //   const { data: res } = await this.$axios_.delete(`roles/${role.id}/rights/${rightId}`)
      //   // console.log(res)
      //   if (res.meta.status === 200) {
      //     this.$message.success(res.meta.msg)
      //     role.children = res.data
      //   }
      // } else {
      //   this.$message.error('删除失败')
      // }
      // 使用elementui提供的confirm组件
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // console.log(result)
      if (result === 'confirm') {
        const { data: res } = await this.$axios_.delete(`roles/${role.id}/rights/${rightId}`)
        // console.log(res)
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
          role.children = res.data
        }
      } else {
        this.$message.error('删除失败')
      }
    },
    // 点击分配权限按钮弹出对话框
    async setRightsDialog(node) {
      console.log(this.defaultleafKeys)
      console.log(this.preSetRole)
      console.log(this.allRightsList)
      this.preSetRole = node
      this.allrightsDialogVisible = true
      const { data: res } = await this.$axios_.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.allRightsList = res.data
      this.getLeafKeys(node, this.defaultleafKeys)
      // console.log(this.defaultleafKeys)
      console.log(this.defaultleafKeys)
      console.log(this.preSetRole)
      console.log(this.allRightsList)
    },
    // 通过递归的形式获取三级节点的id放入数组
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(element => this.getLeafKeys(element, arr))
    },
    async setRoleRights() {
      const checkedNodes = [...this.$refs.treeRef.getCheckedNodes(), ...this.$refs.treeRef.getHalfCheckedNodes()]
      // 上面的checkedNodes是个伪数组，用循环把他转换成一个数组
      var arr = []
      for (let i = 0; i < checkedNodes.length; i++) {
        arr.push(checkedNodes[i].id)
      }
      // console.log(arr)
      const { data: res } = await this.$axios_.post(`roles/${this.preSetRole.id}/rights`, { rids: arr.join() })
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success(res.meta.msg)
      // this.getLeafKeys(this.preSetRole, this.defaultleafKeys)
      // 为什么一定要用getRoleList，而不是在allRightsDialogClosed中清零也行
      this.getRoleList()
      this.allrightsDialogVisible = false
    },
    // 分配权限弹出框关闭
    allRightsDialogClosed() {
      this.defaultleafKeys = []
    },
    // 点击添加角色按钮
    addRoleBtnClick() {
      this.addRoleDialogVisible = true
    },
    // 添加角色弹出框的确定按钮
    addRoleDialogComfirmBtn() {
      this.$refs.addRoleForm.validate(async flag => {
        // console.log(flag)
        if (!flag) {
          return
        }
        // console.log(this.addRoleForm)
        const { data: res } = await this.$axios_.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          // console.log(res)
          return this.$message.error('添加失败')
        }
        this.$message.success(res.meta.msg)
        this.getRoleList()
      })
      this.addRoleForm = {
        roleName: '',
        roleDesc: ''
      }
      this.addRoleDialogVisible = false
    },
    // 编辑按钮
    async editBtn(row) {
      this.roleInfo = row
      const { data: res } = await this.$axios_.get('roles/' + row.id)
      this.addRoleForm.roleName = res.data.roleName
      this.addRoleForm.roleDesc = res.data.roleDesc
      this.editRoleDialogVisible = true
    },
    // 编辑角色演出框的确定按钮
    editRoleDialogComfirmBtn() {
      this.$refs.editRoleForm.validate(async flag => {
        // console.log(flag)
        if (!flag) {
          return
        }
        // console.log(this.addRoleForm)
        const { data: res } = await this.$axios_.put('roles/' + this.roleInfo.id, this.addRoleForm)
        if (res.meta.status !== 200) {
          // console.log(res)
          return this.$message.error('修改失败')
        }
        this.$message.success(res.meta.msg)
        this.getRoleList()
      })
      this.addRoleForm = {
        roleName: '',
        roleDesc: ''
      }
      this.roleInfo = {}
      this.editRoleDialogVisible = false
    },
    // 删除按钮
    async deleteBtn(row) {
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // console.log(result)
      if (result === 'confirm') {
        const { data: res } = await this.$axios_.delete(`roles/${row.id}`)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success(res.meta.msg)
      }
      this.getRoleList()
    }
  }
}
</script>

<style>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid rgb(200, 200, 200);
}
.bdbottom{
  border-bottom: 1px solid rgb(200, 200, 200);
}
.vCenter{
  display: flex;
  align-items: center;
}
</style>
