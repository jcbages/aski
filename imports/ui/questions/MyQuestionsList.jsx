import { Meteor } from 'meteor/meteor';
import React, {Component} from "react";
import {Questions} from '../../api/questions.js';
import QuestionSummary from "./QuestionSummary";
import {createContainer} from "meteor/react-meteor-data";

class MyQuestionsList extends Component {

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
				<div><h2> Apparently you have no questions yet :( </h2><br/>
				{this.props.currentUser && <div><p> Go to 'Add Question' to add a new question </p></div>}


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

export default createContainer(({idUser}) => { 
  Meteor.subscribe('questions.myself', idUser)
  return {
	questions: Questions.find({}, {sort:{"rating.rating":-1}}).fetch(),
	currentUser: Meteor.user(),
  };
}, MyQuestionsList);
