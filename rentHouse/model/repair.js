import {Request} from '../utils/request';

class RepairModel extends Request{


    getRepairByCidAndName(cid,housename){
        return this.getData({
            url:`/getRepairByCidAndName?cid=${cid}&housename=${housename}`
        })
    }

}
export {RepairModel}