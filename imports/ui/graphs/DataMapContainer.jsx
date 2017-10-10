import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import DataMap from "./DataMap"

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

export default class DataMapContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
    this.renderTabs = this.renderTabs.bind(this);
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

  renderTabs(){
    const options = this.props.options;
  	return options.map((d,i)=>{
  		return (
  			<Tab label={d.name} value={i} key={i}>
          <DataMap regionData={d.countries} index={i}/>
  			</Tab>
  		);
  	})
  }

  render() {
    return (
    	<MuiThemeProvider>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
        >
          {this.renderTabs()}
        </Tabs>
      </MuiThemeProvider>
    );
  }
}