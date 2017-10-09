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
  componentWillMount(){
    let labels = [];
    let data = [];
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
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',

      }]
    }
  });
  }

  render() {
    var width = 700,
    height = 300,
    title = "Options";   
    return (
      <Bar data={this.state.data} />
      );
  }

}
BarChart.propTypes = {
  options: PropTypes.array.isRequired,
};