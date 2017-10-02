import React, { Component } from "react";
import { Questions } from "../api/questions.js";

import PropTypes from "prop-types";

// Task component - represents a single todo item
export default class Question extends Component {	
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Questions.update(this.props.question._id, {
      $set: { checked: !this.props.question.checked },
    });
  }

  deleteThisQuestion() {
    Questions.remove(this.props.question._id);
  }
  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const questionClassName = this.props.question.checked ? "checked" : "";

    return(
      <li className={questionClassName}>
      <button className="delete" onClick={this.deleteThisQuestion.bind(this)}>
      &times;
      </button>

      <input
      type="checkbox"
      readOnly
      checked={this.props.question.checked}
      onClick={this.toggleChecked.bind(this)}
      />
      <span className="text">{this.props.question.question}</span>
      </li>
      );
  }
}

Question.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  question: PropTypes.object.isRequired,
};