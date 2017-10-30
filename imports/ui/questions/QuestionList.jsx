import { Meteor } from 'meteor/meteor';
import React, {Component} from "react";
import {Questions} from '../../api/questions.js';
import QuestionSummary from "./QuestionSummary";
import {createContainer} from "meteor/react-meteor-data";

class QuestionList extends Component {

	constructor(props){
		super(props);
	}

	renderQuestions(){
		if(this.props.questions.length != 0)
		return (
			this.props.questions.map((question, index) => {
				return <QuestionSummary question={question} key={index}/>
			})
		);
		else
			return(
				<div><h2> There are no questions that meet your query </h2><br/>
				{this.props.currentUser && <div><p> Go to 'Add Question' to add a new question </p></div>}
				{(this.props.currentUser == undefined || this.props.currentUser == null) && <p> Sign up or login to add a new question!</p> }


				</div> 
				)
	}

	render(){
		return (
			<div className="container">
				<div className="list-group">
					{this.renderQuestions()}
				</div>
			</div>
		);
	}
}

export default createContainer(({query}) => {
	var handle;
  if(query){
    handle = Meteor.subscribe('questions.query', query)
  }
  else{
    handle = Meteor.subscribe('questions')
  }

  return {
  ready:handle.ready(),
	questions: Questions.find({}, {sort:{"rating.rating":-1}}).fetch(),
	currentUser: Meteor.user(),
  };
}, QuestionList);
