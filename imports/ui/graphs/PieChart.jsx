import PropTypes from "prop-types";
import {Pie} from 'react-chartjs-2';
import React from 'react';
import ReactDOM from 'react-dom';

export default class PieChart extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:{}
    }
  }
  componentWillMount(){
    let labels = [];
    let data = [];
    let colors = [];
    this.props.options.map((option, index)=> {
      labels.push(option.name);
      data.push(option.count);
      colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
    })
    this.setState({data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        hoverBackgroundColor:colors
      }]
    }
  });
  }

  render() {
    var width = 700,
    height = 300,
    title = "Options";   
    return (
      <Pie data={this.state.data} />
      );
  }

}
PieChart.propTypes = {
  options: PropTypes.array.isRequired,
};