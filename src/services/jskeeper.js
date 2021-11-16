
var jskeeper  = {
    nextCache : {},
    async first (func,key){
        if(!this.nextCache[key]){
            this.nextCache[key] = func();
            console.log("New Set",this.nextCache[key]);
            let resp = await this.nextCache[key];
            console.log("New Resp",resp);
            delete this.nextCache[key];
            return resp;
        }
        console.log("Exists",this.nextCache[key]);
        return await this.nextCache[key];
    }
};

export default jskeeper;