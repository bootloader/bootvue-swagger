import {PolarArea} from 'vue-chartjs'

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
  extends: PolarArea,
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
      datasets: [{
        data: [
          11,
          16,
          7,
          3,
          14
        ],
        backgroundColor: [
          '#8dace7',
          '#4BC0C0',
          '#ef869e',
          '#E7E9ED',
          '#71deb9'
        ],
        label: 'My dataset' // for legend
      }],
      labels: [
        'Red',
        'Green',
        'Yellow',
        'Grey',
        'Blue'
      ]
    }, {responsive: true, maintainAspectRatio: false})

  }
}
