import React, { Component } from "react";
import { Questions } from "../api/questions.js";
import { createContainer } from "meteor/react-meteor-data";
import { Mongo } from "meteor/mongo";
import ReactDOM from "react-dom";

import PropTypes from "prop-types";

// Task component - represents a single todo item
class Question extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedOption:"",
      rating:""
    }
  }
    //Meteor.call("questions.insert", rating, options, comments)
  handleSubmit(e){
    const question = this.props.question;
    const id = question._id;
    const text = ReactDOM.findDOMNode(this.refs.comment).value.trim();
    const count = question.rating.count + 1;
    let calc = ((question.rating.rating*question.rating.count)+this.state.rating)/count
    const rating = {rating:calc, count:count};
    const comments = {
      authorId: this.props.currentUser._id,
      authorName: this.props.currentUser.username,
      text: text,
      createdAt: new Date(),
      rating: {rating:0,count:0}
    }
    const country = this.props.currentUser.profile.country;
    const countries = {countryCode:country.value, countryName:country.label};
    const options ={
      name: this.state.selectedOption,
      countries:countries,
    }
    console.log(rating,options,comments);
    ReactDOM.findDOMNode(this.refs.comment).value = "";
    Meteor.call("questions.answer", id, rating, options, comments)
}
  handleOptionChange(changeEvent) {
  this.setState({
    selectedOption: changeEvent.target.value
  });
}
handleRating(changeEvent) {
  this.setState({
    rating: parseInt(changeEvent.target.value)
  });
}
  render() {
    const question = this.props.question;
    const self = this;
    console.log(question);
    return(
      <div className="container">
        <form id="answerQuestion"></form>
        <div className="d-flex w-100 justify-content-between">
          <h2 className="mb-1">{question.question}</h2>
          <small>{question.publishedAt.toString()}</small>
        </div>
        <p className="mb-1">{question.description}</p>
        <small>By {question.ownerName}</small>
        <div className="modal-body">
          <ul className="list-group">
            {question.options.map(function(option){
            return(
              <li className="list-group-item">
                <div className="radio">
                  <label>
                    <input value={option.name} type="radio" name="optionsRadios" checked={self.state.selectedOption === option.name} onChange={self.handleOptionChange.bind(self)} />
                      {option.name}
                  </label>
                </div>
              </li>
              );
            }
          )}
          </ul>
        </div>
        <div className="row">
        <fieldset className="rating">
          <input onChange={self.handleRating.bind(self)} type="radio" id="star5" name="rating" value="5" /><label htmlFor="star5" title="Rocks!">5 stars</label>
          <input onChange={self.handleRating.bind(self)} type="radio" id="star4" name="rating" value="4" /><label htmlFor="star4" title="Pretty good">4 stars</label>
          <input onChange={self.handleRating.bind(self)} type="radio" id="star3" name="rating" value="3" /><label htmlFor="star3" title="Meh">3 stars</label>
          <input onChange={self.handleRating.bind(self)} type="radio" id="star2" name="rating" value="2" /><label htmlFor="star2" title="Kinda bad">2 stars</label>
          <input onChange={self.handleRating.bind(self)} type="radio" id="star1" name="rating" value="1" /><label htmlFor="star1" title="Sucks big time">1 star</label>
        </fieldset>
        </div>
        <div className="comment">
            <div>
                <div className="msj-rta macro" style={{margin:"auto"}}>                        
                    <div className="text text-r">
                        <input className="mytext" ref="comment" placeholder="Optional comment about the question"/>
                    </div> 
                </div>
            </div>
        </div>
        <div className="row">
          <input className="answer" type="button" value="Answer" form="answerQuestion" onClick={this.handleSubmit.bind(this)} />  
        </div>      
      </div>

    );
  }
}

export default createContainer(({id}) => {

  Meteor.subscribe('questions')

  return {
    question: Questions.findOne({_id:id}),
    currentUser: Meteor.user(),
  };
}, Question);
