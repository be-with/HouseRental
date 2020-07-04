import {Request} from '../utils/request';

class ApplicationModel extends Request{


    getAppliByUid(uid){
        return this.getData({
            url:`/getAppliByUid?uid=${uid}`
        })
    }

    

}
export {ApplicationModel}