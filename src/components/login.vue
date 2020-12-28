<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像部分 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单部分 -->
            <el-form ref="loginFormRef" label-width="0px" :rules="loginFormRules" class="login_form" :model="loginForm">
                <!-- 用户名部分 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码部分 -->
                <el-form-item prop="password">
                    <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
                </el-form-item>
                <!-- 按钮部分 -->
                <el-form-item class="form_btn">
                    <el-button @click="preLonginForm" type="primary">登录</el-button>
                    <el-button @click="resetLoginForm" type="info">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data: function () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    preLonginForm () {
      this.$refs.loginFormRef.validate(async flag => {
        if (!flag) return
        const { data: res } = await this.$axios_.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 登录成功后存储token
        window.sessionStorage.setItem('token', res.data.token)
        // 并跳转到home页面
        this.$router.push('home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    border-radius: 3px;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    .avatar_box{
        height: 130px;
        width: 130px;
        padding: 10px;
        position:absolute;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        border: 1px solid #eee;
        background-color: #fff;
        border-radius: 50%;
        overflow: hidden;
        box-shadow:0 0 10px #ddd;
        img{
            height: 100%;
            width: 100%;
            background-color: #EEE;
            border-radius: 50%;
        }
    }
    .login_form{
        position: absolute;
        bottom: 0px;
        width: 100%;
        padding: 0px 20px;
        box-sizing: border-box;
        .form_btn{
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
