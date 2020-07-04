<template>
  <div>
    <div id="chart_my"></div>
    <div class="table-box">
      <el-table :data="tableData" style="width: 100%" height="502">
        <el-table-column fixed prop="title" label="房子名称" align="center" width="150"></el-table-column>
        <el-table-column prop="general_admin" label="管理员" align="center" width="110"></el-table-column>
        <el-table-column prop="crealname" label="业主" align="center" width="120"></el-table-column>
        <el-table-column prop="checkin_date" label="入住日期" align="center" width="120"></el-table-column>
        <el-table-column prop="tel" label="联系方式" align="center" width="120"></el-table-column>
        <el-table-column prop="address" label="地址" align="center" width="280"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleWatch(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-drawer title="明细" :visible.sync="table" direction="btt" size="50%">
        <el-table :data="detailData">
          <el-table-column property="title" label="房子名称" width="150"></el-table-column>
          <el-table-column property="crealname" label="业主" width="120"></el-table-column>
          <el-table-column property="person_name" label="租客姓名" width="120"></el-table-column>
          <el-table-column property="checkin_date" label="入住日期" width="150"></el-table-column>
          <el-table-column property="quit_date" label="离店日期" width="200"></el-table-column>
          <el-table-column property="rerent_date" label="新离店日期"></el-table-column>
          <el-table-column property="total_price" label="已付租金" width="200"></el-table-column>
          <el-table-column property="rerent_price" label="续租租金"></el-table-column>
        </el-table>
      </el-drawer>
    </div>
  </div>
</template>
 
<script>
import echarts from "echarts";
import api from "@/api/index.js";
export default {
  data() {
    return {
      uname: "",
      uauthority: "",
      urealname:"",
      priceObj: {},
      tableData: [],
      table: false,
      detailData: []
    };
  },
  mounted() {
    setTimeout(() => {
      let this_ = this;
      let myChart = echarts.init(document.getElementById("chart_my"));
      let option = {
        color: ["#f44"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: [
          {
            type: "category",
            data: this.getHouseName(),
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: 40
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "总收入",
            type: "bar",
            barWidth: "40%",
            data: this.getPrice()
          }
        ]
      };
      myChart.setOption(option);
      //不加的话当浏览器窗口缩小的时候，超过了div的界限（红色边框）
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    }, 100);
  },
  created() {
    this.getCookie();
    // 通过管理员获取管理的房子的订单
    let uname = this.uname;
    let uauthority = this.uauthority;
    let urealname = this.urealname;
    if (uname && uauthority === "-1") {
      // 普通管理员
      api.getOrderByAdmin(uname).then(res => {
        console.log(res);
        var data = res.data.data;
        this.handleOrder(data,0.15);
      });
    } else if (uname && uauthority === "-2") {
      api.getAllOrderByAdmin().then(res => {
        // console.log(res);
        var data = res.data.data;
        this.handleOrder(data,1);
      });
    }else if (uname && uauthority === "2"){
      api.getOrderByUname(urealname).then(res=>{
        console.log(res)
        var data = res.data.data;
        this.handleOrder(data,1);
      })
    }
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
        //  console.log(prop.indexOf('uname'));
        if (prop.indexOf("uname") !== -1) {
          //    console.log(obj[prop]);
          this.uname = obj[prop];
          //   console.log(this.uname);
        } else if (prop.indexOf("uauthority") !== -1) {
          this.uauthority = obj[prop];
          //    console.log(this.uauthority);
        }else if (prop.indexOf("urealname") !== -1) {
          this.urealname = obj[prop];
          //    console.log(this.uauthority);
        }
      }
    },
    // times 倍数 
    handleOrder(data,times){
      let tempObj = {};
      this.tableData = data;
        data.forEach((item, index) => {
          if (item.rerent_price === null || item.rerent_price === "") {
            if (!tempObj[item.title]) {
              tempObj[item.title] = parseInt(item.total_price * times);
            } else {
              tempObj[item.title] += parseInt(item.total_price * times);
            }
          } else {
            let allPrice = item.total_price + item.rerent_price;
            if (!tempObj[item.title]) {
              tempObj[item.title] = parseInt(allPrice * times);
            } else {
              tempObj[item.title] += parseInt(allPrice * times);
            }
          }
        });
        this.priceObj = tempObj;
    },
    getHouseName() {
      var priceObj = this.priceObj;
      console.log(this.priceObj);
      var nameArr = [];
      for (var prop in priceObj) {
        nameArr.push(prop);
      }
      return nameArr;
    },
    getPrice() {
      var priceObj = this.priceObj;
      var pricesArr = [];
      for (var prop in priceObj) {
        pricesArr.push(priceObj[prop]);
      }
      return pricesArr;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 监听点击查看事件
    handleWatch(row) {
      this.detailData = [];
      this.table = true;
      console.log(row);
      this.detailData.push(row);
    }
  }
};
</script>

<style scoped>
#chart_my {
  width: 47%;
  height: 500px;
  border: 1px solid red;
  display: inline-block;
}
.table-box {
  width: 50%;
  display: inline-block;
  vertical-align: top;
  margin-left: 5px;
}
</style>