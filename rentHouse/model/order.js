import {Request} from '../utils/request';

class OrderModel extends Request{


    getOrderByUid(uid){
        return this.getData({
            url:`/getOrderByUid?uid=${uid}`
        })
    }

    getOrderByUidAndPay(uid,ispay){
        return this.getData({
            url:`/getOrderByUidAndPay?uid=${uid}&ispay=${ispay}`
        })
    }
    getOrderByUidAndHouse(uid,house_name){
        return this.getData({
            url:`/getOrderByUidAndHouse?uid=${uid}&house_name=${house_name}`
        })
    }
    getOrderofByCid(cid){
        return this.getData({
            url:`/getOrderofByCid?cid=${cid}`
        })
    }

}
export {OrderModel}