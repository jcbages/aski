import React, { Component } from "react";
import { Questions } from "../api/questions.js";
import DataMapContainer from "./graphs/DataMapContainer";
import PieChart from "./graphs/PieChart";
import BarChart from "./graphs/BarChart";
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

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
      rating:"",
      isUp:[],
      pasos:[],
      value: 0,
    }
    this.renderTabs = this.renderTabs.bind(this);

  }
  roundNumber(num, scale) {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}
    //Meteor.call("questions.insert", rating, options, comments)
  handleSubmit(e){
    console.log(this.props.currentUser)
    const question = this.props.question;
    const id = question._id;
    const text = ReactDOM.findDOMNode(this.refs.comment).value.trim();
    let rating = "";
    if(this.state.rating != ""){
    const count = question.rating.count + 1;
    let calc = ((question.rating.rating*question.rating.count)+this.state.rating)/count;
    calc = this.roundNumber(calc,3);
    rating = {rating:calc, count:count};
  }
  else{
    rating = question.rating;
  }
    const comments = {
      authorId: this.props.currentUser._id,
      authorName: this.props.currentUser.username,
      text: text,
      createdAt: new Date(),
      rating: {rating:0,count:0}
    }
    const country = this.props.currentUser.country;
    let indexOption = 0;
    const countries = {countryCode:country.value, countryName:country.label};
    this.props.question.options.map((option,index)=>{
      if(option.name == this.state.selectedOption){
        indexOption = index;
      }
    })
    const options ={
      name: this.state.selectedOption,
      countries:countries
    }
    let found = false;
    let indexCountry =0;
    question.options.map((option)=>{
      if(option.name == options.name){
        option.countries.map((cnt,index)=>{
          if(cnt.countryCode == country.value){
            found = true;
            indexCountry = index;
          }
        })
      }
    })
    ReactDOM.findDOMNode(this.refs.comment).value = "";
    Meteor.call("questions.answer", id, rating, options, comments, found, indexOption, indexCountry)
}
  handleOptionChange(changeEvent) {
  this.setState({
    selectedOption: changeEvent.target.value
  });
}

handleThumbsUp(comment,index, ev){
  const id = this.props.question._id;
  Meteor.call("comments.voteUp", id, comment);
  let pasos = this.state.pasos;
  pasos[index] = pasos[index] != undefined ? pasos[index] + 1 : 1;
  this.setState({pasos:pasos});
  if(pasos[index] == 0){
    let isUp = this.state.isUp;
    isUp[index] = undefined;
    this.setState({isUp:isUp});
  }
  if(pasos[index] >= 1){
    let isUp = this.state.isUp;
    isUp[index] = true;
    this.setState({isUp:isUp});
  }
}
handleThumbsDown(comment,index, ev){
  const id = this.props.question._id;
  Meteor.call("comments.voteDown", id, comment);
  let pasos = this.state.pasos;
  pasos[index] = pasos[index] != undefined ? pasos[index] - 1 : -1;
  this.setState({pasos:pasos});
  if(pasos[index] == 0){
    let isUp = this.state.isUp;
    isUp[index] = undefined;
    this.setState({isUp:isUp});
  }
  if(pasos[index] <=-1){
    let isUp = this.state.isUp;
    isUp[index] = false;
    this.setState({isUp:isUp});
  }
}
compare(a,b) {
  if (a.rating.rating < b.rating.rating)
    return 1;
  if (a.rating.rating > b.rating.rating)
    return -1;
  return 0;
}
renderComments(){
  const self = this;
  return (
    <ul>
    {this.props.question.comments.sort(this.compare).map(function(comment, index){
      const isUp = self.state.isUp[index]; 
      if(comment.text != ""){
        return(
          <li style={{width:"100%"}}>
            <div className="msj-rta macro">
              <div className="text text-r">
                <p>{comment.text}</p>
                <p>
                  <small>{comment.createdAt.toLocaleString().split(',')[0]}</small>
                </p>
              </div>
              <div className="avatar">
              <p>
                <small>{comment.authorName}</small>
              </p>
              </div>
              <button type="button"
            id="testBtn"
            className="btn btn-success glyphicon glyphicon-thumbs-up"
            data-loading-text=" ... " onClick={(ev) =>self.handleThumbsUp(comment, index, ev)} disabled={isUp!=undefined ? isUp : false}>
              </button>
            <button type="button" id="testBtnDown" className="btn btn-success glyphicon glyphicon-thumbs-down" data-loading-text=" ... " onClick={(ev) =>self.handleThumbsDown(comment, index, ev)} disabled={isUp!=undefined ? !isUp : false}>
            </button>
            <div>
              Puntos: {comment.rating.rating}
            </div>
            </div>
    
          </li>
          )
        }
    })}
    </ul>
  )
}
handleRating(ev) {
  this.setState({
    rating: parseInt(ev.target.value)
  });
}
renderTabs(){
  return (
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
  <Tabs
  value={this.state.value}
  onChange={this.handleChange}
  >
    <Tab label="Pie Chart" value={0} key={0}>
      <PieChart options = {this.props.question.options}/>
    </Tab>
    <Tab label = "Bar Chart" value={1} key={1}>
      <BarChart options = {this.props.question.options}/>
    </Tab>
    <Tab label="Map" value={2} key={2}>
      <DataMapContainer options={this.props.question.options} />
    </Tab>
  </Tabs>
  </MuiThemeProvider>
  )
}
handleChange = (value) => {
    this.setState({
      value: value,
    });
  };
  render() {
    const question = this.props.question;
    const classes = `comments row`;
    const classComment = "comment row";
    const classesAnswer = "btn-primary answer gradient";
    let user = this.props.currentUser;
    let userId = "";
    if(user != null){
      userId = user._id;
    }
    const self = this;
    console.log(question);
    return(
        <div className="container">
          <div>
            <form id="answerQuestion"></form>
              <section className="question-list">
                <article className="row">
                  <div className="col-md-2 col-sm-2 hidden-xs">
                    <figure className="thumbnail">
                      <img className="img-responsive" src="http://www.keita-gaming.com/assets/profile/default-avatar-c5d8ec086224cb6fc4e395f4ba3018c2.jpg" />
                      <figcaption className="text-center">{question.ownerName}</figcaption>
                    </figure>
                  </div>
                  <div className="col-md-10 col-sm-10">
                    <div className="panel panel-default arrow left">
                      <div className="panel-heading right">{question.rating.rating}/5</div>
                      <div className="panel-body">
                        <header className="text-left">
                          <div className="comment-user"><i className="fa fa-question-circle"></i> {question.question}</div>
                          <time className="comment-date" dateTime="16-12-2014 01:05"><i className="fa fa-clock-o"></i> {question.publishedAt.toString()}</time>
                        </header>
                        <div className="comment-post">
                          <p>
                            {question.description}
                          </p>
                        </div>
                        {question.categories.map((category)=>{
                          return (<span className="label label-default">{category}</span>)
                        })}
                      </div>
                    </div>
                  </div>
                </article>
              </section>
              {user != null && userId != question.ownerId &&
              <div>
                <div className="modal-body">
                  <h2 className = "silver"> Possible Answers (Choose one): </h2>
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
                  <div className="rating">
                    <h5 className = "silver"> How would you rate this question? </h5>
                    <input onChange={self.handleRating.bind(self)} type="radio" id="star5" name="rating" value="5" /><label htmlFor="star5" title="Rocks!">5 stars</label>
                    <input onChange={self.handleRating.bind(self)} type="radio" id="star4" name="rating" value="4" /><label htmlFor="star4" title="Pretty good">4 stars</label>
                    <input onChange={self.handleRating.bind(self)} type="radio" id="star3" name="rating" value="3" /><label htmlFor="star3" title="Meh">3 stars</label>
                    <input onChange={self.handleRating.bind(self)} type="radio" id="star2" name="rating" value="2" /><label htmlFor="star2" title="Kinda bad">2 stars</label>
                    <input onChange={self.handleRating.bind(self)} type="radio" id="star1" name="rating" value="1" /><label htmlFor="star1" title="Sucks big time">1 star</label>
                  </div>
                </div>
                <div>
                <h5 className = "silver"> Optional comment: </h5>
                  <div className={classComment}>
                    <div>
                        <div className="msj-rta macro" style={{margin:"auto"}}>
                          <div className="text text-r">
                            <input className="mytext" ref="comment" placeholder="Optional comment about the question"/>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <input className={classesAnswer} type="button" value="Answer" form="answerQuestion" onClick={this.handleSubmit.bind(this)} />
                </div>
              </div>
            }
            </div>
            {this.props.currentUser != null && this.props.currentUser._id == question.ownerId &&
              <h2 className = "silver"> Analytics of your question </h2>
            }
            {user == null &&
              <h5> Sign up or Login to answer this question </h5>
            }
            {(user == null || userId != question.ownerId) &&
              <h2 className = "silver"> Analytics: </h2>
            }
            <hr/>
            {this.renderTabs()}
            <h2 className = "silver"> Comments</h2><br/>
            <div className={classes}>
              {this.renderComments()}
            </div>
          </div>
        );
      }
    }

export default createContainer(({id}) => {
  Meteor.subscribe('questions.id',id);
  console.log(id);
  return {
    question: Questions.findOne({}),
    currentUser: Meteor.user()
  };
}, Question);
