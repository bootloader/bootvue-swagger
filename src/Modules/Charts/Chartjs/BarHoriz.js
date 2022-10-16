import {HorizontalBar} from 'vue-chartjs'

function convert(config){
  return {
    labels : config.fields.map(function(field){
      return field.label;
    }).filter(function(value, index, self){
      return self.indexOf(value) === index;
    }),
    grouped : config.grouped,
    datasets: config.items.map(function(item){
      return {
            label : item._label, 
            grouped : config.grouped,
            data: config.fields.map(function(field){
              return item[field.key] || 0;
            }),
            backgroundColor: config.fields.map(function(field){
              return item._color || field.color;
            }),
            hoverBackgroundColor: config.fields.map(function(field){
              return item._color || field.color;
            }),
            borderWidth: 1
          }
    })
  }
}


let options  = {
  responsive: true, 
  maintainAspectRatio: false,
  scales : {
    x: {
        stacked: true,
        barPercentage : .5
    },
    y: {
        stacked: true,
        barPercentage : .5
    },
    xAxes: [{
        stacked: true,
        barPercentage : .5, 
        barThickness : 'flex',
        maxBarThickness: 30, categoryPercentage : .5
    }],
    yAxes: [{
        stacked: true,
        barPercentage : .5,  
        barThickness : 'flex',
        maxBarThickness: 30, categoryPercentage : .5
    }]
  }
}

// function convert(config){
//   let _config = convert2(config);
//   return _config
// }

export default {
  extends: HorizontalBar,
  props : {
    config : {
      default : null
    }
  },
  watch : {
    "config" : function(){
      this.renderChart(convert(this.config), options)
    }
  },
  mounted() {
    this.renderChart(this.config ? convert(this.config) : {
      labels: ['...', '...'],
      datasets: [
        {
          label: '...',
          backgroundColor: 'rgba(255,99,132,0.0)',
          borderColor: 'rgba(255,99,132,0)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.0)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          borderCapStyle: 'round',
          data: [65, 59, 80]
        }
      ]
    }, options)

  }
}
