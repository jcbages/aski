import React, { Component } from "react";
import { Questions } from "../api/questions.js";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Question from "./Question.jsx";
import { createContainer } from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor"
import Select from 'react-select';
import "react-select/dist/react-select.css";


const options = [
  { label: 'Ciencia', value: 'ciencia' },
  { label: 'Vanilla', value: 'vanilla' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Caramel', value: 'caramel' },
  { label: 'Cookies and Cream', value: 'cookiescream' },
  { label: 'Peppermint', value: 'peppermint' },
];
// Task component - represents a single todo item
class Add extends Component {

constructor(props) {
    super(props);
    this.state = {value:""}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const question = ReactDOM.findDOMNode(this.refs.question).value.trim();
    const description = ReactDOM.findDOMNode(this.refs.desc).value.trim();

    const categories = this.state.value.split(",");
    const options = ReactDOM.findDOMNode(this.refs.desc).value.trim();

    Meteor.call("questions.insert", question, description, categories, [])

    ReactDOM.findDOMNode(this.refs.question).value = "";
  }
  handleChange(value) {
    console.log("Selected: " + JSON.stringify(value.split(",")));
    this.setState({ value });
  }

  renderQuestions() {
    return this.props.questions.map((question) => (
      <Question key={question._id} question={question} />
    ));
  }

  render() {
    console.log(this.props)
    const { value } = this.state;
    return(
        <div className="container">
          <header>
            <h1>Ask Away!</h1>
            <form className="new-question" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="question"
                placeholder="What do you wanna ask?"
              />
              <input
                type="text"
                ref="desc"
                placeholder="Description"
              />
              <label>
                Pick the categories that matches your question:
                <Select
                  multi
                  closeOnSelect={false}
                  onChange={this.handleChange}
                  options={options}
                  placeholder="Select your categories"
                  simpleValue
                  value={value}
                />
              </label>
              <input
                type="text"
                ref="options"
                placeholder="Options"
              />
              <input type="submit" value="Submit" />
            </form>
          </header>
          <ul>
            {this.renderQuestions()}
          </ul>
        </div>
    );
  }
}

Add.propTypes = {
  questions: PropTypes.array.isRequired,
};
export default createContainer(() => {
  return {
    questions: Questions.find({}, { sort: { publishedAt: -1 }}).fetch(),
    currentUser:Meteor.user(),
  };
}, Add);