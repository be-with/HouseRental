<template>
  <div class="log-box">
    <div v-if="uauthority < 0">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 新增房源 -->
      <el-tab-pane label="新增房源" name="first">
        <el-table :data="newlyHouse" style="width: 100%" height="750">
          <el-table-column fixed prop="date" label="日期" width="150"></el-table-column>
          <el-table-column prop="personName" label="姓名" width="120"></el-table-column>
          <el-table-column prop="city" label="市区" width="120"></el-table-column>
          <el-table-column prop="hname" label="房源名称" width="120"></el-table-column>
          <el-table-column prop="htype" label="房源类型" width="120"></el-table-column>
          <el-table-column prop="rtype" label="出租类型" width="120"></el-table-column>
          <el-table-column prop="address" label="地址" width="300"></el-table-column>
          <el-table-column prop="detail" label="描述" width="500"></el-table-column>
          <el-table-column prop="disopose" label="配置" width="500"></el-table-column>
          <el-table-column prop="generalAdmin" label="管理员" width="120"></el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 已出租房源 -->
      <el-tab-pane label="已出租房源" name="second">
        <el-table :data="orderList" style="width: 100%">
          <el-table-column fixed prop="checkin_date" label="入住日期" width="150"></el-table-column>
          <el-table-column prop="person_name" label="姓名" width="150"></el-table-column>
          <el-table-column prop="tel_number" label="手机号" width="150"></el-table-column>
          <el-table-column prop="house_name" label="房源名称" width="120"></el-table-column>
          <el-table-column prop="IDNum" label="身份证号" width="200"></el-table-column>
          <el-table-column prop="quit_date" label="离开日期" width="150"></el-table-column>
        </el-table>

        <el-pagination
          background
          layout="prev, pager, next"
          @size-change="handleSizeChanged"
          @current-change="handleCurrentChanged"
          :total="total"
        ></el-pagination>
      </el-tab-pane>

      <!-- 续租房源 -->
      <el-tab-pane label="续租房源" name="third">
        <el-table :data="rerentOrderList" style="width: 100%">
          <el-table-column fixed prop="checkin_date" label="入住日期" width="150"></el-table-column>
          <el-table-column prop="person_name" label="姓名" width="150"></el-table-column>
          <el-table-column prop="tel_number" label="手机号" width="150"></el-table-column>
          <el-table-column prop="house_name" label="房源名称" width="120"></el-table-column>
          <el-table-column prop="IDNum" label="身份证号" width="200"></el-table-column>
          <el-table-column prop="rerent_date" label="离开日期" width="150"></el-table-column>
        </el-table>

        <el-pagination
          background
          layout="prev, pager, next"
          @size-change="handleSizeChangeRe"
          @current-change="handleCurrentChangeRe"
          :total="total"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
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
import date from "@/api/date.js";
export default {
  data() {
    return {
      activeName: "first",
      newlyHouse: [],
      generalAdminArr: [],
      orderList: [],//全部订单
      rerentOrderList:[],//续租订单
      total: 0,
      page: 1,
      pageSize: 10,
      pageNum: 1,
      uauthority:""
    };
  },

  created() {
    this.getCookie();
    this.getGeneralAdmin();
  },
  mounted() {
    this.getNewlyHouse();
    this.getOrderCount();
  },
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
        }
      }
    },
    getNewlyHouse() {
      api.getNewlyHouse().then(
        res => {
          let generalAdminArr = this.generalAdminArr;
          //   console.log(generalAdminArr);
          let length = this.generalAdminArr.length;
          let data = res.data.data;
          //   console.log(data);
          data.forEach((item, index) => {
            // let generalAdmin = generalAdminArr[this.getRandom(0, length - 1)];
            let temp = data[index];
            let date = res.data.data[index].ctime;
            let newDate = this.handleCtime(date);
            let obj = {
              date: newDate,
              personName: temp.crealname,
              city: temp.city,
              hname: temp.title,
              htype: temp.type,
              rtype: temp.rtype,
              address: temp.address,
              detail: temp.des,
              disopose: temp.disopose,
              generalAdmin: temp.general_admin
            };
            if (temp.general_admin == null || temp.general_admin == "") {
              api
                .updatetHouseOfAdmin({
                  general_admin: generalAdminArr[this.getRandom(0, length - 1)],
                  id: temp.id
                })
                .then(resp => {
                  //   console.log(resp);
                });
            }
            this.newlyHouse.push(obj);
          });
        },
        err => {
          console.log(err);
        }
      );
    },
    // 获取普通管理员
    getGeneralAdmin() {
      api.getUnameByAuthority().then(res => {
        // console.log(res);
        let data = res.data.data;
        data.forEach(item => {
          // console.log(item);
          this.generalAdminArr.push(item.u_name);
        });
      });
    },
    getRandom(min, max) {
      //
      return Math.ceil(Math.random() * (max - min) + min);
    },
    handleClick(tab, event) {
      // console.log(tab.index);
      let page = this.page;
      //当tab.index是1时 请求已出租房源
      if (tab.index == 1) {
        this.getOrderCount();
        this.getAllOrderbyPage(page);
      } else if (tab.index == 2) {
        this.getOrderByRerentCount();
        //请求续租房源  
        this.getReOderByPage(page);
      }
    },
    //已出租 改变时
    handleSizeChanged(val) {
      this.pageSize = val;
    },
    //已出租 条目改变时
    handleCurrentChanged(val) {
      this.pageNum = val;
      this.getAllOrderbyPage(val);
    },
    // 续租 
    handleSizeChangeRe(val) {
      this.pageSize = val;
    },
    // 续租 条目改变时
    handleCurrentChangeRe(val) {
      this.pageNum = val;
      this.getReOderByPage(val);
    },
    handleCtime(date) {
      let newDate = new Date(date * 1000).toLocaleString();
      // console.log(newDate);
      return newDate;
    },
    // 获取总条数
    getOrderCount() {
      api.getOrderCount().then(res => {
        // console.log(res,271);
        let count = res.data.data[0].total;
        this.total = Math.ceil(count);
        // console.log(this.total, 267);
      });
    },
    // 获取续租订单的条数
    getOrderByRerentCount(){
      api.getOrderByRerentCount().then(res => {
        // console.log(res,271);
        let count = res.data.data[0].reTotal;
        this.total = Math.ceil(count);
        // console.log(count, 267);
      });
    },
    // 获取全部订单
    getAllOrderbyPage(page) {
      let pageSize = this.pageSize;
      this.orderList = [];
      api.getOrderbyPage(page, pageSize).then(
        res => {
          // console.log(res, 250);
          let data = res.data.data;
          this.orderList = data;
        },
        err => {
          console.log(err);
        }
      );
    },
    // 获取续租的全部订单
    getReOderByPage(page){
      let pageSize = this.pageSize;
      api.getOrderbyPage(page,pageSize).then(res=>{
        // console.log(res,209);
        let data = res.data.data;
        this.rerentOrderList = [];
        var rerentOrder = data.filter((item,index)=>{
          // rerent == 1 ->申请通过
          return item.rerent == 1
        })
        this.rerentOrderList = rerentOrder;
        this.total = rerentOrder.length;
      })
    }
  }
};
</script>


<style lang="scss" scoped>
.log-box {

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