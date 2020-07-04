<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :header-cell-style="headerClass"
      :cell-style="cellClass"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="u_name" label="用户姓名" width="220"></el-table-column>
      <el-table-column prop="tel" label="联系方式" width="220"></el-table-column>
      <el-table-column prop="house_name" label="看房房名" width="220"></el-table-column>
      <el-table-column prop="visit_time" label="看房时间" show-overflow-tooltip></el-table-column>

      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button v-if="(scope.row.status == 0)" type="danger" @click="isComplete(scope.row)">未完成</el-button>
          <el-button v-else type="success">已完成</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="exportExcel">导出Excel表格</el-button>
    </div>
  </div>
</template>

<script>
import api from "@/api/index.js";
export default {
  inject: ["reload"],
  data() {
    return {
      uname: "",
      uauthority: "",
      urealname: "",
      tableData: [],
      multipleSelection: [],
      alreadyComplete: false //未完成
    };
  },
  created() {
    this.getCookie();
    // 通过管理员获取管理的房子的看房申请
    let uname = this.uname;
    let uauthority = this.uauthority;
    let urealname = this.urealname;
    if (uname && uauthority === "-1") {
      // 普通管理员
      api.getAppliByGA(uname).then(res => {
        // console.log(res);
        this.tableData = res.data.data;
      });
    } else if (uname && uauthority === "-2") {
      api.getAllAppliByAdmin().then(res => {
        console.log(res);
        this.tableData = res.data.data;
      });
    } else if (uname && uauthority === "2") {
      //   api.getOrderByUname(urealname).then(res=>{
      //     console.log(res)
      //     var data = res.data.data;
      //     this.handleOrder(data);
      //   })
    }
  },
  methods: {
    headerClass() {
      return "text-align:center";
    },
    cellClass() {
      return "text-align:center";
    },
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
        } else if (prop.indexOf("urealname") !== -1) {
          this.urealname = obj[prop];
          //    console.log(this.uauthority);
        }
      }
    },
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel.js");
        const tHeader = ["姓名", "联系方式", "房名", "看房时间"];
        const filterVal = ["u_name", "tel", "house_name", "visit_time"];
        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "看房申请表");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    isComplete(row) {
      console.log(row);
      console.log(this.tableData);
      let appliData = this.tableData;
      if (row.status == 0) {
        // 未完成
        console.log(row.id);
        api
          .updateAppliOfStatus({
            id: row.id
          })
          .then(res => {
            console.log(res, this);
            this.reload();
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>