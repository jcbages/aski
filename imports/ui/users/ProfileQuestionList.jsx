import { Meteor } from 'meteor/meteor';
import React, {Component} from "react";
import QuestionSummary from "../questions/QuestionSummary";
import {createContainer} from "meteor/react-meteor-data";


class ProfileQuestionLists extends Component {

	constructor(props){
		super(props);
	}

	renderQuestions(){
		if(this.props.questions.length != 0)
			return (
				this.props.questions.map((question, index) => {
					return <QuestionSummary question={question} user = {this.props.user} currentUser = {this.props.currentUser} key={index}/>
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
			<div className="list-group">
				{this.renderQuestions()}
			</div>
		);
	}
}

export default ProfileQuestionLists;