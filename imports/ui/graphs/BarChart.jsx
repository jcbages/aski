import PropTypes from "prop-types";
import {Bar} from 'react-chartjs-2';
import React from 'react';
import ReactDOM from 'react-dom';

export default class BarChart extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:{}
    }
  }
  ColorLuminance(hex, lum) {

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i*2,2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00"+c).substr(c.length);
  }

  return rgb;
}
  componentWillMount(){
    let labels = [];
    let data = [];
    let color = "#ff6384";
    this.props.options.map((option, index)=> {
      console.log(option);
      labels.push(option.name);
      data.push(option.count);
    })
    this.setState({data: {
      labels: labels,
      datasets: [{
        data: data,
        label: 'Respuestas',
        backgroundColor: this.ColorLuminance(color,0.2),
        borderColor: this.ColorLuminance(color,1),
        borderWidth: 1,
        hoverBackgroundColor: this.ColorLuminance(color,0.4),
        hoverBorderColor: this.ColorLuminance(color,1),
      }]
    }
  });
  }

  render() {
    var width = 700,
    height = 300,
    title = "Options";  
    let data = [];
    let datos = this.state.data;
    let labels = [];
    this.props.options.map((option, index)=> {
      data.push(option.count);
      labels.push(option.name);
    })
    datos.labels = labels;
    datos.datasets[0].data = data;
    return (
      <Bar data={datos} />
      );
  }

}
BarChart.propTypes = {
  options: PropTypes.array.isRequired,
};