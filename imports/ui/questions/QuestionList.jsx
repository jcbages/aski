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
		return (
			this.props.questions.map((question, index) => {
				return <QuestionSummary question={question} key={index}/>
			})
		);
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

  if(query){
    Meteor.subscribe('questions.query', query)
  }
  else{
    Meteor.subscribe('questions')
  }

  return {
	questions: Questions.find({}, {sort:{createdAt:-1}}).fetch(),
	currentUser: Meteor.user(),
  };
}, QuestionList);
