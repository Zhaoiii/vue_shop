<template>
  <el-container>
    <el-header>
      <span>商城后台管理系统</span>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router>
          <el-submenu :index="item.id + ''" :key="item.id" v-for="item in menuList">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
              <el-menu-item :index="'/' + ch.path" :key="ch.id" v-for="ch in item.children">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{ch.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  created: function () {
    this.getMenuList()
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear()
      this.$router.push('login')
    },
    async getMenuList() {
      const { data: res } = await this.$axios_.get('menus')
      if (res.meta.status !== 200) return this.$message.console.error(res.meta.message)
      this.menuList = res.data
      console.log(this.menuList)
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      color: #fff;
      font-size: 20px;
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu{
      width: 100%;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
