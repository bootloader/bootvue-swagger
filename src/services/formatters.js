import Vue from 'vue';
import moment from 'moment';
import numeral from 'numeral';

var CONTACT_LABELS_DICT = {};

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

  function hashCode(str) { // java String#hashCode
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

var formatter = {
	instance : function (argument) {
	},
  addContactLabels : function (labels) {
    for(var i in labels){
      CONTACT_LABELS_DICT[labels[i].id] = labels[i];
    }
  },
  hexacode : function (str) {
    return intToRGB(hashCode(str));
  },
  contactLabels : function (id) {
    return (CONTACT_LABELS_DICT[id] || { id : id, title : id});
  },
  isEmpty : function (argument) {
    return argument === null ||argument === undefined || argument === "" || argument === "null";
  },
  nullify : function (argument) {
    if(argument === null ||argument === undefined || argument === "" || argument === "null"){
      return null;
    } return argument;
  },
  guid : function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4()
        + s4() + s4();
  },
  init : function () {
    var THAT = this;

    Vue.filter('formatDate', formatTime);
    Vue.filter('newlines', function (html_str) {
        return html_str.trim() ;//.replace(/(?:\r\n|\r|\n)/g, '<br/>').trim();
    });
    Vue.filter('number', function (value,format) {
        var _format = format || "0,0a"
        return numeral(value).format(_format).toUpperCase();//.replace(/(?:\r\n|\r|\n)/g, '<br/>').trim();
    });
    var HOUR = 3600;
    var DAY = HOUR*24;
    var WEEK = DAY*7;
    Vue.filter('timespan', function (value) {
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
    });
    Vue.filter('striphtml', function (value) {
      var div = document.createElement("div");
      div.innerHTML = value;
      var text = div.textContent || div.innerText || "";
      return text;
    });
    Vue.filter('https', function (mediaUrl) {
      return mediaUrl.replace("http://","https://");
    });

    Vue.filter('thumburl', function (mediaUrl) {
      var m = mediaUrl.match(/(.+)\/(res.cloudinary.com)\/([a-zA-Z0-9-_]+)\/([a-zA-Z0-9]+)\/(upload)\/([a-zA-Z0-9,_-]+)\/(.*)/);
      if(m && m.length){
        m[6] = "w_100,h_100";
        return m.slice(1).join("/");
      } return mediaUrl;
    });

    Vue.filter('contact_label', function (id) {
        return THAT.contactLabels(id).title;
    });

    Vue.filter('log_option', function (id,event_type) {
        switch(event_type){
          case 'LABEL_ADDED':
          case 'LABEL_REMOVED':
            return THAT.contactLabels(id).title;
          default:
            return id;
        }
    });

    Vue.filter('hexacode', function (str) {
        return THAT.hexacode(str);
    });

  }
}

formatter.init();

export default formatter;