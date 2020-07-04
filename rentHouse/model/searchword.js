import {Request} from '../utils/request';

class SearchWord extends Request{

    getHouseByAddr(searchword){
        return this.getData({
            url:`/getHouseByAddr?searchword=${searchword}`
        })
    }

    getHouseByCity(city){
        return this.getData({
            url:`/getHouseByCity?city=${city}`
        })
    }

    getHouseByTitle(title){
        return this.getData({
            url:`/getHouseByTitle?title=${title}`
        })
    }
}

export {SearchWord}