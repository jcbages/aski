import * as d3 from "d3";
import topojson from 'topojson';
import Datamap from 'datamaps/dist/datamaps.world.min'
import React from 'react';
import ReactDOM from 'react-dom';
import countryDefaults from '../../extras/countryDefaults';
import countryCodeDict from "../../extras/countryCodeConversion";
import objectAssign from 'object-assign';

export default class DataMap extends React.Component {
  constructor(props){
    super(props);
    this.datamap = null;
    this.linearPalleteScale = this.linearPalleteScale.bind(this);
  }
  linearPalleteScale(value){
    const dataValues = this.props.regionData.map(function(data) { return data.count });
    const minVal = 0;
    const maxVal = Math.max(...dataValues);

    return d3.scaleLinear().domain([minVal, maxVal]).range(["#FFFFFF","#0000FF"])(value);
  }
  reducedData(){
    const newData = this.props.regionData.reduce((object, data) => {
      const code = countryCodeDict[data.countryCode]
      object[code] = { value: data.count, fillColor: this.linearPalleteScale(data.count) };
      return object;
    }, {});

    return newData;
  }
  renderMap(){
    return new Datamap({
      element: ReactDOM.findDOMNode(this),
      scope: 'world',
      fills:{
        defaultFill:"white"
      },
      data: this.reducedData(),
      geographyConfig: {
        borderWidth: 0.5,
        highlightFillColor: '#FFCC80',
        popupTemplate: function(geography, data) {
          if (data && data.value) {
            return '<div class="hoverinfo"><strong>' + geography.properties.name + ', ' + data.value + '</strong></div>';
          } else {
            return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
          }
        }
      }
    });
  }
  currentScreenWidth(){
    return window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  }
  componentDidMount(){
    const mapContainer = d3.select('#datamap-container-' + this.props.index);
    const initialScreenWidth = this.currentScreenWidth();
    const containerWidth = { width: '600px', height: '350px' }

    mapContainer.style(containerWidth);
    this.datamap = this.renderMap();
    window.addEventListener('resize', () => {
      const currentScreenWidth = this.currentScreenWidth();
      const mapContainerWidth = mapContainer.style('width');
      if (this.currentScreenWidth() > 600 && mapContainerWidth !== '600px') {
        d3.select('svg').remove();
        mapContainer.style({
          width: '600px',
          height: '350px'
        });
        this.datamap = this.renderMap();
      }
      else if (this.currentScreenWidth() <= 600) {
        d3.select('svg').remove();
        mapContainer.style({
          width: currentScreenWidth + 'px',
          height: (currentScreenWidth * 0.5625) + 'px'
        });
        this.datamap = this.renderMap();
      }
    });
  }
  componentDidUpdate(){
    this.datamap.updateChoropleth(this.reducedData());
  }
  componentWillUnmount(){
    d3.select('svg').remove();
  }
  render() {
    var style = {
      color:"black"
    }
    return (
      <div id={"datamap-container-" + this.props.index} style={style}></div>
      );
  }
}