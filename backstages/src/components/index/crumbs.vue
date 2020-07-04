<template>
  <el-breadcrumb separator="/">
    <!-- <transition-group name="breadcrumb"> -->
      <!-- 防止面包屑导航出现 首页/首页， v-if="route.name!='home'" -->

      <el-breadcrumb-item>{{$route.meta.name}}</el-breadcrumb-item>
    <!-- </transition-group> -->
  </el-breadcrumb>
</template>