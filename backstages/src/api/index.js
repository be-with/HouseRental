import axios from '@/axios.js'

var api = {
  // 登录
  login(params) {
    return axios.post('/login', params)
  },


  // 新增房源
  getNewlyHouse() {
    return axios.get('/getRecommendByCount')
  },

  // 获取普通管理员
  getUnameByAuthority() {
    return axios.get('/getUnameByAuthority')
  },

  // 分配管理员
  updatetHouseOfAdmin(params) {
    return axios.post('/updatetHouseOfAdmin', params)
  },

  // 已出租房源
  getOrderbyPage(page, pageSize) {
    return axios.get(`/getOrderbyPage?page=${page - 1}&pageSize=${pageSize}`)
  },


  getOrderCount() {
    return axios.get("/getOrderCount");
  },

  getOrderByRerentCount() {
    return axios.get("/getOrderByRerentCount");
  },

  // 通过房子名称查找租客信息
  getOrderByhouseName(houseName) {
    return axios.get(`/getOrderByhouseName?houseName=${houseName}`)
  },


  // 房源管理 登录角色是普通管理员
  getHouseInfoByGAdmin(general_admin) {
    return axios.get(`/getHouseInfoByGAdmin?general_admin=${general_admin}`)
  },


  //管理员 房源 搜索城市接口
  getHouseByCityGA(city, general_admin) {
    return axios.get(`/getHouseByCityGA?city=${city}&general_admin=${general_admin}`);
  },

  //管理员 房源 搜索房子类型接口
  getHouseByTypeGA(type, general_admin) {
    return axios.get(`/getHouseByTypeGA?type=${type}&general_admin=${general_admin}`)
  },

  //管理员 房源 搜索房子出租类型接口
  getHouseByRTypeGA(rtype, general_admin) {
    return axios.get(`/getHouseByRTypeGA?rtype=${rtype}&general_admin=${general_admin}`)
  },

  //管理员 房源 业主名称接口
  getHouseByCrealnameGA(crealname, general_admin) {
    return axios.get(`/getHouseByCrealnameGA?crealname=${crealname}&general_admin=${general_admin}`)
  },

  //管理员 房源 业主联系方式接口
  getHouseByTelGA(tel, general_admin) {
    return axios.get(`/getHouseByTelGA?tel=${tel}&general_admin=${general_admin}`)
  },

  // 管理员 获取看房行程接口
  getAppliByGA(general_admin) {
    return axios.get(`/getAppliByGA?general_admin=${general_admin}`)
  },

  //超级管理员 房源 搜索城市接口
  getHouseByCity(city) {
    return axios.get(`/getHouseByCity?city=${city}`);
  },

  //超级管理员 房源 搜索房子类型接口
  getHouseByType(type) {
    return axios.get(`/getHouseByType?type=${type}`)
  },

  //超级管理员 房源 搜索房子出租类型接口
  getHouseByRType(rtype) {
    return axios.get(`/getHouseByRType?rtype=${rtype}`)
  },

  //超级管理员 房源 业主名称接口
  getHouseByCrealname(crealname) {
    return axios.get(`/getHouseByCrealname?crealname=${crealname}`)
  },

  //超级管理员 房源 业主联系方式接口
  getHouseByCTel(tel) {
    return axios.get(`/getHouseByCTel?tel=${tel}`)
  },

  //超级管理员 房源 管理员接口
  getHouseByGAdmin(generalAdmin) {
    return axios.get(`/getHouseByGAdmin?general_admin=${generalAdmin}`)
  },





  //业主 房源 搜索城市接口
  getHouseByCityCid(city, cid) {
    return axios.get(`/getHouseByCityCid?city=${city}&cid=${cid}`);
  },

  //业主 房源 搜索房子类型接口
  getHouseByTypeCid(type, cid) {
    return axios.get(`/getHouseByTypeCid?type=${type}&cid=${cid}`)
  },

  //业主 房源 搜索房子出租类型接口
  getHouseByRTypeCid(rtype, cid) {
    return axios.get(`/getHouseByRTypeCid?rtype=${rtype}&cid=${cid}`)
  },

  //业主 房源 业主名称接口
  getHouseByCrealnameCid(crealname, cid) {
    return axios.get(`/getHouseByCrealnameCid?crealname=${crealname}&cid=${cid}`)
  },

  //业主 房源 业主联系方式接口
  getHouseByCTelCid(tel, cid) {
    return axios.get(`/getHouseByCTelCid?tel=${tel}&cid=${cid}`)
  },

  //业主 房源 管理员接口
  getHouseByGAdminCid(generalAdmin, cid) {
    return axios.get(`/getHouseByGAdminCid?general_admin=${generalAdmin}&cid=${cid}`)
  },




  // 管理员 房源 获取所有房源
  getHouse() {
    return axios.get("/getRecommend");
  },

  // 业主 房源 获取其下房源
  getHouseByCid(cid) {
    return axios.get(`/getRecommendByCid?cid=${cid}`)
  },

  // 业主 获取其下房源订单
  getOrderByUname(crealname) {
    return axios.get(`/getOrderByUname?crealname=${crealname}`)
  },

  // 管理员删除房源 id + houseName
  delHouseByIdAndName(id, params) {
    return axios.post(`/delHouseByIdAndName?id=${id}`, params)
  },

  // 编辑房子信息 并更新 
  updatetHouseSomeField(id, params) {
    return axios.post(`/updatetHouseSomeField?id=${id}`, params)
  },

  // 通过管理员获取管理的房子的订单
  getOrderByAdmin(general_admin) {
    return axios.get(`/getOrderByAdmin?general_admin=${general_admin}`)
  },


  // 超级管理员 获取所有订单
  getAllOrderByAdmin() {
    return axios.get("/getAllOrderByAdmin")
  },


  // 超级管理员 获取管理员信息
  getGeneralAdminByauth() {
    return axios.get("/getGeneralAdminByauth")
  },

  // 超级管理员 添加普通管理员
  insertAdmin(params) {
    return axios.post("/insertAdmin", params);
  },

  // 超级管理员 业务调整 搜索普通管理员
  getHouseGAlikeGA(general_admin) {
    return axios.get(`/getHouseGAlikeGA?general_admin=${general_admin}`)
  },

  // 超级管理员 获取房名 业主名 业主联系方式 管理员 管理员联系方式
  getHouseAndUtel() {
    return axios.get("/getHouseAndUtel");
  },

  // 超级管理员 管理员设置 搜索普通管理员
  getGAlikeGAname(u_name) {
    return axios.get(`/getGAlikeGAname?u_name=${u_name}`);
  },

  // 超级管理员 查询普通管理员名下有没有房源
  getHousenameByUname(u_name) {
    return axios.get(`/getHousenameByUname?general_admin=${u_name}`);
  },

  // 超级管理员删除普通管理员
  delGAdmin(params) {
    return axios.post(`/delGAdmin`, params)
  },

  // 超级管理员 获取管理员
  getNameByGA() {
    return axios.get("/getNameByGA")
  },

  // 超级管理员 业务调整
  updateHouseOfGA(params) {
    return axios.post("/updateHouseOfGA", params);
  },

  // 超级管理员 查看看房申请
  getAllAppliByAdmin() {
    return axios.get("/getAllAppliByAdmin");
  },



  // 更新看房申请的完成状态
  updateAppliOfStatus(params) {
    return axios.post(`/updateAppliOfStatus`,params)
  }
}





export default api