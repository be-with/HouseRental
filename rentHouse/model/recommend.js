import {Request} from '../utils/request';

class HouseModel extends Request{
    getRecommend(){
        return this.getData({
            url:'/getRecommend'
        })
    }

    getRecommendById(id){
        return this.getData({
            url:`/getRecommendById?id=${+id+1}`
        })
    }

    getRecommendByCity(city){
        return this.getData({
            url:`/getRecommendByCity?city=${city}`
        })
    }

    getRecommendBytype(type){
        return this.getData({
            url:`/getRecommendByType?type=${type}`
        })
    }

    getRecommendByTypeAndCity(type,city){
        return this.getData({
            url:`/getRecommendByTypeAndCity?type=${type}&city=${city}`
        })
    }

    getRecommendByRType(rtype){
        return this.getData({
            url:`/getRecommendByRType?rtype=${rtype}`
        })
    }
    getRecommendByRtAndC(city,rtype){
        return this.getData({
            url:`/getRecommendByRtAndC?city=${city}&rtype=${rtype}`
        })
    }
    getRecommendByRtAndT(type,rtype){
        return this.getData({
            url:`/getRecommendByRtAndT?type=${type}&rtype=${rtype}`
        })
    }
    getRecommendByRTC(city,type,rtype){
        return this.getData({
            url:`/getRecommendByRTC?city=${city}&type=${type}&rtype=${rtype}`
        })
    }

    getRecommendByCid(cid){
        return this.getData({
            url:`/getRecommendByCid?cid=${cid}`
        })
    }

    getRecommendByCidRT(cid,rtype){
        return this.getData({
            url:`/getRecommendByCidRT?cid=${cid}&rtype=${rtype}`
        })
    }

    getOrderByCidHousename(cid,house_name){
        return this.getData({
            url:`/getOrderByCidHousename?cid=${cid}&house_name=${house_name}`
        })
    }


    // 修改后的接口
    getRecommendByCity1(city){
        return this.getData({
            url:`/getRecommendByCityA?city=${city}`
        })
    }
    // 修改后的接口
    getRecommendBytype1(type){
        return this.getData({
            url:`/getRecommendByType1?type=${type}`
        })
    }
    // 修改后的接口
    getRecommendByTypeAndCity1(type,city){
        return this.getData({
            url:`/getRecommendByTypeAndCityA?type=${type}&city=${city}`
        })
    }
    // 修改后的接口
    getRecommendByRType1(rtype){
        return this.getData({
            url:`/getRecommendByRType1?rtype=${rtype}`
        })
    }
    // 修改后的接口
    getRecommendByRtAndC1(city,rtype){
        return this.getData({
            url:`/getRecommendByRtAndC1?city=${city}&rtype=${rtype}`
        })
    }
    // 修改后的接口
    getRecommendByRtAndT1(type,rtype){
        return this.getData({
            url:`/getRecommendByRtAndT1?type=${type}&rtype=${rtype}`
        })
    }
    // 修改后的接口
    getRecommendByRTC1(city,type,rtype){
        return this.getData({
            url:`/getRecommendByRTC1?city=${city}&type=${type}&rtype=${rtype}`
        })
    }
}
export {HouseModel}