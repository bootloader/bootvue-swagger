import {Line} from 'vue-chartjs'

export function newChartData(name) {
        return {
            name : name,
            labels : [],
            series : {

            },
            update : function (newChartDate) {
                console.log("update",this.name,newChartDate);
                this.labels = newChartDate.labels;
                this.series = newChartDate.series;
            }
        }
};

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

export default {
  extends: Line,
  props: ['options','cdata'],
  mounted() {
    console.log("MyLine",this.cdata);
    var cdata = this.cdata || {};
    if(!cdata.series && !this.options){
      return;
    }
    this.renderChart({
      labels: cdata.labels,
      datasets: Object.keys(cdata.series).map(function (key) {
          var color = "#"+intToRGB(hashCode(key))
          return {
            label: key,
            fill: false,
            lineTension: 0.1,
            backgroundColor: color,
            borderColor: color,
            borderCapStyle: 'round',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: color,
            pointBackgroundColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverRadius: 10,
            pointHoverBackgroundColor: color,
            pointHoverBorderColor: color,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: cdata.series[key]
          }
      })
    }, {
      ...this.options ? this.options : {},
      responsive: true, 
      maintainAspectRatio: false,
    })

  }
}
