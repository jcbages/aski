import React, {Component} from "react";

class QuestionSummary extends Component {

	constructor(props){
		super(props);
	}
	goToQuestion(e) {
    // stop form from submitting
    e.preventDefault();
    var params = {id:this.props.question._id}
    FlowRouter.go("/question/" + this.props.question._id);
  }
	render(){

    const question = this.props.question;

		return (
			<a href="" className="list-group-item list-group-item-action flex-column align-items-start"	onClick={this.goToQuestion.bind(this)}>
				<div className="d-flex w-100 justify-content-between">
			      <h5 className="mb-1">{question.question}</h5>
			      <small>{question.publishedAt.toLocaleString().split(',')[0]}</small>
			    </div>
		    	<p className="mb-1">{question.description}</p>
        		<small>By {question.ownerName}</small>
			</a>
		);
	}
}

export default QuestionSummary;