import React, {Component} from "react";

class QuestionSummary extends Component {

	constructor(props){
		super(props);
	}
	goToQuestion(e) {

    FlowRouter.go("question/" + this.props.question._id);

  }
	render(){

    const question = this.props.question;
    let route = "question/" + this.props.question._id;
		return (
			<a href={route} className="list-group-item list-group-item-action flex-column align-items-start">
				<div className="d-flex w-100 justify-content-between">
			      <h5 className="mb-1">{question.question}</h5>
			      <div className="panel-heading right">{question.rating.rating}/5</div>
			      <small>{question.publishedAt.toLocaleString().split(',')[0]}</small>

			    </div>
		    	<p className="mb-1">{question.description}</p>
		    	<div className = "row">
        		<small className="owner col-md-4">By {question.ownerName}</small>
        		<div className= "pull-right col-md-4">
        		{question.categories.map((category,index)=>{
        			if(index % 3 == 0 && index != 0){
        				 return (<div><span className="label label-default right">{category}</span></div>)
        			}
        			else{
                          return (<span className="label label-default right">{category}</span>) 
                      }
                })}
        		</div>
        		</div>
			</a>
		);
	}
}

export default QuestionSummary;