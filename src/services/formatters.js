import Vue from 'vue';
import moment from 'moment';
import numeral from 'numeral';
import JsonUtils from './../@common/utils/JsonUtils';

var CONTACT_LABELS_DICT = {};
var CONTACT_TAGS_DICT = {};

  const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  function formatTime(timestamp,gap){
    if(!timestamp){
      return "";
    }
    const NOW = new Date();
    const DATE = new Date(timestamp);
    const DIFF = moment(NOW).diff(DATE, 'day');
    
    if(DIFF < 1 && isToday(DATE)){
      return moment(DATE).format('h:mm a');
    } else if(DIFF < 3 ){
      return moment(DATE).format('hh:mm a ddd');
    } else if(DIFF < 7 ){
      return moment(DATE).format('h:mm a ddd');
    } else {
      return moment(DATE).format('h:mm a DD MMM YY');
    }
  }
  function formatStamp(timestamp,gap) {
    const DATE = new Date(timestamp);
    return moment(DATE).format('h:mm a DD MMM YY');
  }

  var HOUR = 3600;
  var DAY = HOUR*24;
  var WEEK = DAY*7;
  function timespan (value) {
        if(value<60){
          return numeral(value).format("0.0") + ' sec';
        } else if(value<HOUR){
          return numeral(value/60).format("0.0") + ' min';
        } else if(value<DAY){
          return numeral(value/3600).format("0.0") + ' hrs';
        } else if(value<WEEK){
          return numeral(value/DAY).format("0.0") + ' days';
        } else if(value>=WEEK){
          return numeral(value/WEEK).format("0.0a") + ' wks';
        } 
        return moment(value).format("0.0").toLowerCase();//.replace(/(?:\r\n|\r|\n)/g, '<br/>').trim();
    }

  function hashCode(str) { // java String#hashCode
      str = str || '';
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
         hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
  } 
  function intToRGB(i){
      var c = (i & 0x00FFFFFF)
          .toString(16)
          .toUpperCase();
      return "00000".substring(0, 6 - c.length) + c;
  }


  function phoneFormatted (value) {
    if(/^\d{10}$/.test(value))
      return true;

    if(/^[1-9]{1}[0-9]{3,14}$/.test(value))
      return true;

    //XXX-XXX-XXXX ,   XXX.XXX.XXXX,   XXX XXX XXXX
    if(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value))
      return true;
    //+XX-XXXX-XXXX,   +XX.XXXX.XXXX,   +XX XXXX XXXX
    if(/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(value))
      return true;

    // +111 (202) 555-0125
    if(/^(\+\d{1,3}( )?)?((\(\d{3}\))|\d{3})[- .]?\d{3}[- .]?\d{4}$/.test(value))
      return true;
    // 202 555 0125
    if(/^(\d{3}[- .]?){2}\d{4}$/.test(value))
      return true;
    //(202) 555-0125
    if(/^((\(\d{3}\))|\d{3})[- .]?\d{3}[- .]?\d{4}$/.test(value))
      return true;
    return false;
  }

var formatter = {
	instance : function (argument) {
	},
  addContactLabels : function (labels) {
    for(var i in labels){
      CONTACT_LABELS_DICT[labels[i].id] = labels[i];
    }
  },
  addContactTags : function (tags) {
    for(var i in tags){
      CONTACT_TAGS_DICT[tags[i].id] = tags[i];
    }
  },
  timespan : timespan,formatStamp : formatStamp,
  hexacode : function (str) {
    return intToRGB(hashCode(str));
  },
  contactLabels : function (id) {
    return (CONTACT_LABELS_DICT[id] || { id : id, title : id});
  },
  contactTags : function (id) {
    return (CONTACT_TAGS_DICT[id] || { id : id, title : id});
  },
  isEmpty : function (argument) {
    return argument === null ||argument === undefined || argument === "" || argument === "null";
  },
  nullify : function (argument) {
    if(argument === null ||argument === undefined || argument === "" || argument === "null"){
      return null;
    } return argument;
  },
  undify : function (argument) {
    if(argument === null ||argument === undefined || argument === "" || argument === "null"){
      return undefined;
    } return argument;
  },
  any : function(){
    for(var i in arguments){
      if(arguments[i] !== undefined && arguments[i] !== null ){
        return arguments[i];
      }
    }
    return arguments[arguments.length-1];
  },
  toNum : function(num,def){
    let _def = def || 0;
    return ((isNaN(num) || !num) ? _def :  num)-0;
  },
  guid : function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4()
        + s4() + s4();
  },
  https : function (mediaUrl) {
    if(!mediaUrl) return mediaUrl;
    return mediaUrl.replace("http://","https://");
  },
  thumburl : function (mediaUrl) {
      if(!mediaUrl) return mediaUrl;
      if(mediaUrl.indexOf('data:') == 0) return;
      var m = mediaUrl.match(/(.+)\/(res.cloudinary.com)\/([a-zA-Z0-9-_]+)\/([a-zA-Z0-9]+)\/(upload)\/([a-zA-Z0-9,_-]+)\/(.*)/);
      if(m && m.length){
        m[6] = "w_100,h_100";
        return m.slice(1).join("/");
      } 
      var aws = mediaUrl.match(/(.+)\/(.+).(s3.amazonaws.com)\/(.+)/);
      if(aws && aws.length){
        return `https://ik.imagekit.io/meherysoccom/${aws[2]}/${aws[4]}?tr=w-100,h-100`
      } 
      return mediaUrl;
  },
  https_thumburl : function (mediaUrl) {
    return this.thumburl(this.https(mediaUrl));
  },
  stripslash : function (url) {
    return (url||"").replace(/\/+$/g,'').replace(/^\/+/,'');
  },
  clean_url : function(url){
    return url.replace(/(\/)\/+/g, "$1").replace(/^https?:/,'https:/');
  },

  keys : function keys(map,prefix){
      prefix = prefix || "" ;
      var list = [];
      for(var key in map){
         if(typeof map[key] != 'object'){
          list.push(prefix + key);
         } else {
          list = list.concat(keys(map[key],prefix + key + "."));
         }
      }
      return list;
  },
  map_from_string : function (string) {
    var splitter_char = ";",  key_value_separator_char = ":";
    var map = {};
    return (string || "").split(splitter_char).reduce(function(total,currentValue) {
      var stub = (currentValue || "").split(key_value_separator_char);
      var key = (stub[0]||"").trim();
      if(key) total[key] = stub[1];
      return total;
    },{});
  },
  message_form_options : function (options) {
    var inputs = [];
    var buttons = [];

    Object.keys(options).map(function(key) {
        if (key.indexOf("form-input-") == 0) {
          var params = (options[key] || "").split("\\|");
          inputs.push({ 
              name : key.replace("form-input-", ""),
              label : params[0] || "",
              type : params[1] || ""
          });
        } else if (key.indexOf("actions-button-") == 0) {
          var params = (options[key] || "").split("\\|");
          buttons.push({ 
              name : key.replace("actions-button-", ""),
              label : params[0] || "",
              type : params[1] || ""
          });
        }
    });

    options["inputs"] = inputs;
    options["buttons"] = buttons;

    return options;
  },

  //Validators
  validators : ["phone","phoneML","emailz","alphanum","HBNumVar","HBPrefixedVar","URL"],
  alphanum : function alphanumValidator (value) {
    if(/^[a-zA-Z0-9]*$/.test(value))
      return true
    return 'errors.ValidAlphaNum';
    //return true;
  },
  emailz : function emailValidator (value) {
    if(/^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}/.test(value))
      return true
    return 'errors.ValidEmail';
    //return true;
  },
  phone : function phoneValidator (value) {
    if(phoneFormatted(value)){
      return true;
    } 
    if(phoneFormatted(value.replace(/[\ \+]/g,""))){
      return true;
    } 
    return "errors.ValidPhone";
    //'Enter valid mobile number eg +91 XXXXX XXXXX';
  },
  phoneML : function phoneValidator (lineString) {
    var lines = lineString.match(/[^\r\n\,]+/g);
    for(var i in lines){
      if(lines[i] && !phoneFormatted(lines[i]) && !phoneFormatted(lines[i].replace(/[\ \+]/g,"")))
          return 'errors.ValidPhonesPerLine';
    }
    return true;
  },
  HBPrefixedVar :  function(contents,values){
    values = values || [];
    let position = values[0];
    let min = values[1];
    let max = values[2];
    let prefixes = values.slice(3);
    var re = /({{([\w\d\.\_]+)}})/g;
    var vars = contents.match(re) || [];
    for(var v in vars){
      if(!prefixes.some(function(pref){
        return vars[v].indexOf("{{"+pref) == 0;
      })){
        return 'errors.InvalidVariable'; 
      }
    }
    return this.HBVar({contents,position,min,max,vars})
  },
  HBNumVar :  function(contents,[position,min,max]){
    var re = /({{([\w\d\.\_]+)}})/g;
    var vars = contents.match(re) || [];
    return  this.HBVar({contents,position,min,max,vars,ordered: true})
  },
  HBVar :  function({ contents,position,min,max,vars,ordered}){
    console.log("HBVar",vars);
    var myArray = vars
    if(min){
      min = parseInt(min);
      if(myArray.length<min)
        return 'errors.LessVariable';
    }
    if(max){
      max = parseInt(max);
      if(myArray.length>max){
        return 'errors.ExtraVariable';
      }
    }
    if(position == "end" && myArray.length){
      let totalLen = contents.length;
      let varStr = myArray[myArray.length-1];
      if(contents.indexOf(varStr) != (totalLen-varStr.length)){
        return 'errors.PositionVariable';
      }
    }
    if(ordered){
      for(let i=0;i<myArray.length; i++){
        console.log("HBVar","{{"+(i+1)+"}}" !== myArray[i])
        if("{{"+(i+1)+"}}" !== myArray[i]){
          return 'errors.InvalidVariableSeq';
        }
      }
    }
    return true;
  },
  URL : function(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return (url.protocol === "http:" || url.protocol === "https:") && (url.href == string || url.origin == string);
  },

  init : function () {
    var THAT = this;

    Vue.filter('formatDate', formatTime);
    Vue.filter('formatStamp', formatStamp);
    Vue.filter('newlines', function (html_str) {
        return html_str.trim() ;//.replace(/(?:\r\n|\r|\n)/g, '<br/>').trim();
    });
    Vue.filter('lowercase', function (html_str) {
        return (html_str || '').toLowerCase()
    });
    Vue.filter('uppercase', function (html_str) {
      return (html_str || '').toUpperCase();
  });
    Vue.filter('number', function (value,format) {
        var _format = format || "0,0a"
        return numeral(value).format(_format).toUpperCase();//.replace(/(?:\r\n|\r|\n)/g, '<br/>').trim();
    });
    Vue.filter('timespan', timespan);
    Vue.filter('striphtml', function (value) {
      var div = document.createElement("div");
      div.innerHTML = value;
      var text = div.textContent || div.innerText || "";
      return text;
    });
    Vue.filter('blank3dash', function (value) {
      return value || '---'
    });
    Vue.filter('stripslash', function (value) {
      return THAT.stripslash(value);
    });
    Vue.filter('https', function (mediaUrl) {
        return THAT.https(mediaUrl);
    });

    Vue.filter('thumburl', function (mediaUrl) {
        return THAT.thumburl(mediaUrl);
    });

    Vue.filter('contact_label', function (id) {
        return THAT.contactLabels(id).title;
    });

    Vue.filter('contact_tag', function (id) {
        return THAT.contactTags(id).title;
    });

    Vue.filter('display', function (value,options,key) {
      if(typeof options == "string"){
        var map = formatter.map_from_string(options);
        return map[value];
      }
      var option = ((options||[]).filter((option) => (option.value == value))[0])||{};
      if(option && option.label !== undefined && option.label !== null){
        return option.label;
      }
      return value;
    });

    Vue.filter('log_option', function (id,event_type) {
        switch(event_type){
          case 'LABEL_ADDED':
          case 'LABEL_REMOVED':
            return THAT.contactLabels(id).title;
          case 'TAG_ADDED':
          case 'TAG_REMOVED':
            return THAT.contactTags(id).title;
          default:
            return id;
        }
    });

    Vue.filter('hexacode', function (str) {
        return THAT.hexacode(str);
    });
    Vue.filter('json', function (str) {
      return JSON.stringify(JsonUtils.deepParse(str), null, 2);
    });

  }
}

formatter.init();
Vue.prototype.$formatters = formatter;
export default formatter;