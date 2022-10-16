import {Doughnut} from 'vue-chartjs'

function convert(config){
  return {
    labels : config.fields.map(function(field){
      return field.label;
    }),
    datasets: config.items.map(function(item){
      return {
            data: [... config.fields.map(function(field){
              return item[field.key] || 0;
            }), item._remaing],
            backgroundColor: config.fields.map(function(field){
              return field.color;
            }),
            hoverBackgroundColor: config.fields.map(function(field){
              return field.color;
            })
          }
    }).reverse()
  }
}


export default {
  extends: Doughnut,
  props : {
    config : {
      default : null
    }
  },
  watch : {
    "props.config" : function(){
      this.renderChart(convert(this.config), {responsive: true, maintainAspectRatio: false})
    }
  },
  mounted() {
    this.renderChart(this.config ? convert(this.config) : {
      labels: [
        'Cars',
        'Trains',
        'Airplanes'
      ],
      datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
          '#8dace7',
          '#71deb9',
          '#ef869e'
        ],
        hoverBackgroundColor: [
          '#7097e1',
          '#4dd6a7',
          '#eb6886'
        ]
      },{
        data: [300, 50, 100],
        backgroundColor: [
          '#8dace7',
          '#71deb9',
          '#ef869e'
        ],
        hoverBackgroundColor: [
          '#7097e1',
          '#4dd6a7',
          '#eb6886'
        ]
      }]
    }, {responsive: true, maintainAspectRatio: false})
  }
}
