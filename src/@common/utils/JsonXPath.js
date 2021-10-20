import { JSONPath } from "jsonpath-plus";

function setValue(obj,path,value){
	if(path.length == 1){
		obj[path[0]] = value;
	} else {
		obj[path[0]] = obj[path[0]] || {};
		setValue(obj[path[0]],path.splice(1),value)
	}
}

export default function(options){
	if(options.value !== undefined){
		let _callback = options.callback;
		options.callback = (payload, type, obj) => {
			obj.parent[obj.parentProperty] = options.value;
			if(_callback) return _callback(payload, type, obj);
			else return payload;
		};
	}
	let rs = JSONPath(options);
	if(options.value !== undefined && rs.length==0){
		let paths = options.path.split(".");
		setValue(options.json,paths.splice(1),options.value)
	}
	return rs;
}