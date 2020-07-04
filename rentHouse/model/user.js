import {Request} from '../utils/request';

class UserModel extends Request{

    getUserById(id){
        return this.getData({
            url:`/getUserById?id=${id}`
        })
    }

    getUserByNickName(u_name){
        return this.getData({
            url:`/getUserByNickName?u_name=${u_name}`
        })
    }
    getSearchByUid(id){
        return this.getData({
            url:`/getSearchByUid?id=${id}`
        })
    }
    //获取普通管理员
    getGeneralAdmin(){
        return this.getData({
            url:`/getGA`
        })
    }
}
export {UserModel}