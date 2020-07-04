<template>
  <div class="adjust-box">
    <div v-if="uauthority == -2">
      <div class="search-box">
        <el-input
          placeholder="请输入要查询的管理员姓名"
          v-model="searchword"
          class="input-with-select"
          @input="handleInput"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>

      <div class="adjust-box">
        <el-table
          ref="multipleTable"
          :data="adminData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="title" label="房子名称"></el-table-column>
          <el-table-column prop="crealname" label="业主"></el-table-column>
          <el-table-column prop="tel" label="业主联系方式"></el-table-column>
          <el-table-column prop="general_admin" label="管理员" show-overflow-tooltip></el-table-column>
          <el-table-column prop="u_tel" label="管理员联系方式" show-overflow-tooltip></el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="handleAdjust">调整管理员</el-button>
          <el-button @click="toggleSelection()">取消选择</el-button>
        </div>
      </div>

      <el-dialog title="调整管理员" :visible.sync="dialogTableVisible" width="30%">
        <el-select v-model="select" placeholder="请选择要调整的管理员">
          <el-option
            v-for="item in options"
            :key="item.u_name"
            :label="item.u_name"
            :value="item.u_name"
          ></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="error-page" v-else>
      <div class="error-desc">你没有权限访问该页面~</div>
      <div class="error-handle">
        <a href="/home" class="router-link-active">
          <button type="button" class="el-button el-button--primary el-button--large">
            <span>返回首页</span>
          </button>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/index.js";
import { mapState } from 'vuex'
export default {
  inject:['reload'],
  data() {
    return {
      uauthority: "",
      searchword: "",
      adminData: [],
      multipleSelection: [],
      isCheckAll: false, //是否是全选状态
      checkedData: [], //选中的数据
      dialogTableVisible: false,
      options: [],
      value: "",
      select:"",
      adminName:''
    };
  },
  created() {
    this.getCookie();
    console.log(this.adminName);
    if(this.adminName !== ''){
      this.searchword = this.adminName;
      let adminName = "adminName";
      api.getHouseGAlikeGA(this.adminName).then(res => {
          console.log(res);
          this.adminData = res.data.data;
          this.clearCookie(adminName);
        });
    }else{
      this.getHouseAndTel();
    }
  },
  // computed:{
  //   ...mapState(['adminName'])
  // },
  methods: {
    // 获取cookie
    getCookie: function() {
      let cookies = document.cookie.split(";");
      var obj = {};
      cookies.forEach((item, index) => {
        let temp = item.split("=");
        let prop = temp[0].trim();
        obj[prop] = temp[1];
      });
      for (let prop in obj) {
        //  console.log(prop.indexOf('uauthority'));
        if (prop.indexOf("uauthority") !== -1) {
          //  console.log(obj[prop]);
          this.uauthority = obj[prop];
          //  console.log(this.uauthority);
        }else if (prop.indexOf("adminName") !== -1) {
          this.adminName = obj[prop];
          //  console.log(this.uid);
        }
      }
    },
    handleSearch() {
      let searchword = this.searchword;
      if (searchword !== "") {
        api.getHouseGAlikeGA(searchword).then(res => {
          console.log(res);
          this.adminData = res.data.data;
        });
      } else {
        alert("搜索词不能为空");
      }
    },
    // 监听输入框input事件
    handleInput(value) {
      // console.log(value);
      let searchword = this.searchword;
      if (searchword == "") {
        // 输入框内容为空时 重新请求数据
        this.getHouseAndTel();
      }
    },
    getHouseAndTel() {
      api.getHouseAndUtel().then(res => {
        // console.log(res);
        this.adminData = res.data.data;
        // console.log(this.adminData);
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let tableLength = this.adminData.length;
      this.checkedData = val;
      let select = this.selectl;
      if (val.length === this.adminData.length) {
        // 全选
        this.isCheckAll = true;
      } else {
        // 单选
        this.isCheckAll = false;
      }
    },
    // 调整管理员
    handleAdjust() {
      this.dialogTableVisible = true;
      this.getNameByGA();
    },
    // 获取管理员
    getNameByGA(){
      api.getNameByGA().then(res=>{
      console.log(res);
      this.options = res.data.data;
    })
    },
    // 监听确定事件
    handleConfirm(){
      // 对话框隐藏
      this.dialogFormVisible = false;
      // 选中数组长度不为0->  更新房源表的管理员 
      let isCheckAll = this.isCheckAll;
      let checkedData = this.checkedData;
      let houseNameArr = [];
      let crealnameArr = [];
      if(checkedData.length !== 0){
        console.log(1)
          checkedData.forEach((item,index)=>{
            houseNameArr.push(item.title);
            crealnameArr.push(item.crealname);
          })
          // console.log(houseNameArr,crealnameArr);
          api.updateHouseOfGA({
            general_admin:this.select,
            title:houseNameArr,
            crealname:crealnameArr
          }).then(res=>{
            this.dialogTableVisible = false;
            this.reload();
          })
      }
      // console.log(this.select);
    },
    clearCookie(adminName) {
      console.log('clear',213)
      let exp = new Date()
      exp.setTime(exp.getTime() - 604800000);
      let nameval = this.getAdminName(adminName);
      console.log(nameval,217)
      if (nameval) {
        console.log('clear')
        document.cookie = adminName + '=' + nameval + ';expires=' + exp.toGMTString()
      }      
    },
    // 从cookie中获取adminName
     getAdminName(name) {
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
.adjust-box {
  .search-box {
    .input-with-select {
      width: 450px;
    }
    .el-select .el-input {
      width: 130px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }
  .error-page {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    margin-top: 30px;
    .error-desc {
      font-size: 30px;
      color: #777;
      text-align: center;
      margin-top: 10px;
    }
    .error-handle {
      margin: 15px auto;
      width: 6%;
    }
  }
}
</style>