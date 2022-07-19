import storage from 'local-storage-fallback';

var jscovery  = {
    getItem(key,defObject){
        let str = storage.getItem('jscovery.'+key);
        if(!str) {
            return defObject || {};
        } else {
            try {
                return JSON.parse(str);
            } catch(e){
                return defObject || {};
            }
        }
    },
    setItem(key,value){
        storage.setItem('jscovery.'+key,JSON.stringify(value));
    },
    bind (storeName,object,fun){
        let jscovery = this;
        let copy  = {}; 
        return {
            commit(obj){
                fun(copy,obj || object);
                jscovery.setItem(storeName,copy);
                return this;
            },
            reover(defObject){
                copy = jscovery.getItem(storeName,defObject || copy);
                fun(object, copy);
                return this;
            }
        };
    }
};

export default jscovery;