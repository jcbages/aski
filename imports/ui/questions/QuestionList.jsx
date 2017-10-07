import React, {Component} from "react";

import QuestionSummary from "./QuestionSummary";

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
			<div className="container-fluid">
				<div className="list-group">
					{this.renderQuestions()}
				</div>
			</div>
		);
	}
}

export default QuestionList;