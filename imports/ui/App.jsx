import React, { Component } from 'react';
import PropTypes from "prop-types";
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Questions } from '../api/questions.js';
import Question from './Question.jsx';
 
// App component - represents the whole app
class App extends Component {

  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Questions.insert({
      question: text,
      publishedAt: new Date(), // current time
    });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
 
  renderQuestions() {
    return this.props.questions.map((question) => (
      <Question key={question._id} question={question} />
    ));
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
 
          <form className="new-question" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new questions"
            />
          </form>
        </header>
 
        <ul>
          {this.renderQuestions()}
        </ul>
      </div>
    );
  }
}
App.propTypes = {
  questions: PropTypes.array.isRequired,
};
 
export default createContainer(() => {
  return {
    questions: Questions.find({}, { sort: { publishedAt: -1 }}).fetch(),
  };
}, App);