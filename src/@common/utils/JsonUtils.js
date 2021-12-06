
  function deepParse(contents){
    let json = null;
    if(typeof contents == 'string'){
      try {
        let trimdJson  = contents.trim();
        if(trimdJson[0] == "{" && trimdJson[trimdJson.length-1] == "}"){
          json = JSON.parse(contents);
        } else {
          let matchd = (trimdJson).match(/^([a-zA-Z0-9\ ]*)\((.*)\)$/);
          if(matchd && matchd.length>2){
            json = {}
            json[matchd[1]+"()"] = deepParse(matchd[2])
          } else {
            json = contents;
          }
        }
      } catch(e){
        console.log("NO for ",contents)
        json = contents;
      }
    } else {
      json = contents;
    }
  
    if(Object.prototype.toString.call(json) === '[object Object]'
      || Object.prototype.toString.call(json) === '[object Array]') {
      for(var key in json){
        json[key] = deepParse(json[key]);
      }
    }
    return  json;
  }

  function paths(map,prefix = ""){
    var list = [];
    for(var key in map){
       if(typeof map[key] != 'object'){
        list.push(prefix + key);
       } else {
        list = list.concat(paths(map[key],prefix + key + "."));
       }
    }
    return list;
  }



export default {
    copy : function(obj){
        if(!obj) return obj;
        return JSON.parse(JSON.stringify(obj))
    },
    deepParse,paths
};