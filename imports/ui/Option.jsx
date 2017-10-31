import React, { Component } from "react";
import { Options } from "../api/options.js";

import PropTypes from "prop-types";

// Task component - represents a single todo item
export default class Option extends Component {	

  deleteThisOption() {
    Meteor.call("options.remove",this.props.option._id)
  }
  render() {
    return(
      <div className="col-md-3">
        <li className="option">
          <button className="delete" onClick={this.deleteThisOption.bind(this)}>
          &times;
          </button>
          <span className="text">{this.props.option.name}</span>
        </li>
      </div>
    );
  }
}

Option.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  option: PropTypes.object.isRequired,
};