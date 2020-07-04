Date.prototype.toLocaleString = function(){
    var month,day
    if(this.getMonth() + 1 < 10){   
        month = '0' + (this.getMonth() + 1)
    }else{
        month = this.getMonth() + 1;
    }
    if(this.getDate() < 10){   
        day = '0' + (this.getDate())
    }else{
        day = this.getDate();
    }
    return this.getFullYear() + "-" + month + "-" + day;
}