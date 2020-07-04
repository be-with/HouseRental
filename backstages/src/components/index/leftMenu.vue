<template>
  <el-menu
    :collapse="isSidebarNavCollapse"
    :default-active="this.$router.history.current.meta.id"
    @open="handleOpen"
    @close="handleClose"
    background-color="#304156"
    text-color="#eee"
    active-text-color="#4dbcff"
  >
    <router-link tag="div" to="/home">
      <el-menu-item index="1">
        <i class="el-icon-house"></i>
        <span slot="title">首页</span>
      </el-menu-item>
    </router-link>

    <router-link tag="div" to="/log">
      <el-menu-item index="2">
        <i class="el-icon-folder"></i>
        <span slot="title">日志管理</span>
      </el-menu-item>
    </router-link>

    <router-link tag="div" to="/account_manage">
      <el-menu-item index="3">
        <i class="el-icon-money"></i>
        <span slot="title">账户管理</span>
      </el-menu-item>
    </router-link>

    <router-link tag="div" to="/house_resource">
      <el-menu-item index="4">
        <i class="el-icon-office-building"></i>
        <span slot="title">房源管理</span>
      </el-menu-item>
    </router-link>

    <router-link tag="div" to="/application">
      <el-menu-item index="5">
        <i class="el-icon-tickets"></i>
        <span slot="title">看房预约</span>
      </el-menu-item>
    </router-link>

    <el-submenu index="6">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>权限设置</span>
      </template>

      <el-menu-item-group>
        <router-link tag="div" to="/permission">
          <el-menu-item index="6-1">管理员设置</el-menu-item>
        </router-link>

        <router-link tag="div" to="/adjust">
        <el-menu-item index="6-2">业务调整</el-menu-item>
        </router-link>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import { mapState } from "vuex";
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  computed: {
    ...mapState(["isSidebarNavCollapse"])
  }
};
</script>

