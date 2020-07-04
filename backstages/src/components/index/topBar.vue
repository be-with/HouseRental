<template>
  <aside class="top_bar">
    <span
      class="iconfont icon-nav toggleNavCollapse"
      :class="{active:isSidebarNavCollapse}"
      @click="toggleNavCollapse"
    ></span>

    <!-- 面包屑 -->
    <crumbs />

    <div class="top_bar_right">
      <div class="user-msg">
        <span class="user-name">{{username}}</span>
        <el-dropdown trigger="click" placement="top">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="quit-system" @click="loginOut">
        <span class="iconfont icon-quit"></span>
      </div>
    </div>
  </aside>
</template>

<script>
import { mapState } from "vuex";
import crumbs from "@/components/index/crumbs.vue";

export default {
  data() {
    return {
      username: ""
    };
  },
  components: {
    crumbs
  },
  created() {
    this.getUsername('uname');
  },
  computed: {
    ...mapState(["isSidebarNavCollapse", "crumbList"])
  },
  methods: {
    toggleNavCollapse() {
      this.$store.commit("toggleNavCollapse");
    },
    // 从cookie获取username
    getUsername(name) {
      var cookies = document.cookie.split(";"); // ["login=true", " uname=admin"]
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        if (cookie.indexOf(name) != -1) {
          //  console.log(cookie);//uname=admin
           var str = cookie.split('=')[1];
          //  console.log(str);
           this.username = str;
        }
      }
      // console.log(cookie);
    },
    // 退出登录
    loginOut() {
      let uname = 'uname';
      let urealname = 'urealname';
      let uauthority = 'uauthority';
      let uid = 'uid';
      this.$confirm('确定退出登录？')
        .then(_ => {
          this.clearCookie(uname, urealname, uauthority,uid);
          this.$router.push('/login')
        })
        .catch(_ => {})
    },
    clearCookie(uname, urealname, uauthority,uid) {
      let exp = new Date()
      exp.setTime(exp.getTime() - 604800000);
      let nameval = this.getCookie(uname);
      let realval = this.getCookie(urealname);
      let authval = this.getCookie(uauthority);
      let idval = this.getCookie(uid);
      if (nameval) {
        document.cookie = uname + '=' + nameval + ';expires=' + exp.toGMTString()
      }
      if (realval) {
        document.cookie = urealname + '=' + realval + ';expires=' + exp.toGMTString()
      }
      if (authval) {
        document.cookie = uauthority + '=' + authval + ';expires=' + exp.toGMTString()
      }
      if (idval) {
        document.cookie = uid + '=' + idval + ';expires=' + exp.toGMTString()
      }
    },
    getCookie(name) {
      var arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
      if ((arr = document.cookie.match(reg))) {
        return arr[2]
      } else {
        return false
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.top_bar {
  border-bottom: 1px solid #e5e5e5;
  height: 50px;
  line-height: 50px;
  position: fixed;
  left: 200px;
  top: 0;
  right: 0;
  background: #fff;
  z-index: 1000;
  transition: left 0.25s;
  .toggleNavCollapse {
    display: inline-block;
    margin-left: 8px;
    padding: 0 10px;
    font-size: 26px;
    vertical-align: middle;
    color: #333;
    cursor: pointer;
    transition: all 0.5s;
    &.active {
      transform: rotate(90deg);
    }
  }

  .top_bar_right {
    position: absolute;
    right: 10px;
    top: -1px;
    bottom: 0px;
    > div {
      position: relative;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      margin-left: 10px;
      padding: 0 15px;
      cursor: pointer;
      &:hover::after {
        transform-origin: 0 0;
        transform: scaleX(1);
      }
      &:first-child:before {
        border: none;
      }
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background: #ef4747;
        transform: scaleX(0);
        transform-origin: right 0;
        transition: transform 0.5s;
      }
      &::before {
        content: "";
        position: absolute;
        height: 20px;
        top: 50%;
        left: -8px;
        margin-top: -10px;
        border-left: 1px solid #ccc;
      }
      &.email {
        i {
          position: absolute;
          left: 18px;
          top: -12px;
          border-radius: 20px;
          background: red;
          color: #fff;
          text-align: center;
          font-size: 12px;
          line-height: 1.5;
          min-width: 20px;
          min-height: 20px;
        }
      }
      &.user-msg {
        .user-img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          vertical-align: middle;
        }
        .user-name {
          color: #758eb5;
          padding: 0 4px;
        }
      }
      .iconfont {
        position: relative;
        font-size: 24px;
        color: #758eb5;
      }
    }
  }
}
.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.6s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>