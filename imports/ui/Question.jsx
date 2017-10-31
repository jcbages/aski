import React, { Component } from "react";
import { Questions } from "../api/questions.js";
import DataMapContainer from "./graphs/DataMapContainer";
import PieChart from "./graphs/PieChart";
import BarChart from "./graphs/BarChart";
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Snackbar from 'material-ui/Snackbar';

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
      commentsWithVotes: [],
      value: 0,
      submited:false,
      error:"",
      display:false,
      open:false,
      showAlert:false,
    }
    this.renderTabs = this.renderTabs.bind(this);
  }
  componentDidMount(){
    let order = [];
    let newComments = [];
    this.props.question.comments.map((comment, index)=>{
    if(this.props.currentUser != null)
      if(comment.authorId == this.props.currentUser._id){
        this.setState({submited:true}); 
      }
      comment.key = index;
      newComments.push(comment);
    })
    this.setState({commentsWithVotes:this.props.question.comments});
    newComments.sort(this.compare).map((comment)=>{
      order.push(comment.key);
    })
    $( ".individualComment" ).each(function( index ) {
      var current = index;
      var indexOf = order.findIndex(i => i == current);
      $(this).css("top", indexOf * 200 + "px");
    })
  }
  componentWillUpdate(){
    let order = [];
    let newComments = [];
    this.props.question.comments.map((comment, index)=>{
      comment.key = index;
      newComments.push(comment);
    })
     newComments.sort(this.compare).map((comment)=>{
      order.push(comment.key);
    })
    $( ".individualComment" ).each(function( index ) {
      var current = index;
      var indexOf = order.findIndex(i => i == current);
      $(this).css("top", indexOf * 200 + "px");
    })
  }
  updateVotes(comments){
    let commentsWithVotes = [];
    comments.map((comment)=>{
      comment.votes.votersUp.map((voterUp)=>{
        if(this.props.currentUser != null)
        if(voterUp == this.props.currentUser._id){
          comment.voto = "up";
        }
      })
      comment.votes.votersDown.map((voterDown)=>{
        if(this.props.currentUser != null)
        if(voterDown == this.props.currentUser._id){
          comment.voto = "down";
        }
      })
      commentsWithVotes.push(comment);
    })
    return commentsWithVotes;

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
  let comments = null;
  if(text.trim() != ""){
    comments = {
      authorId: this.props.currentUser._id,
      authorName: this.props.currentUser.username,
      text: text,
      createdAt: new Date(),
      rating: {rating:0,count:0},
      votes:{result:0, votersUp:[],votersDown:[]},
    }
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
    Meteor.call("questions.answer", id, rating, options, comments, found, indexOption, indexCountry,()=>{
      this.setState({commentsWithVotes:question.comments});
    });
}
  handleOptionChange(changeEvent) {
  this.setState({
    selectedOption: changeEvent.target.value
  });
}

handleThumbsUp(commentsWithVotes, comment,index, ev){
  const id = this.props.question._id;
  let commentWithVotes= commentsWithVotes[index];
  let voto = "";
  let call = "";
  if(comment.voto == "" || comment.voto == undefined){
    call = "comments.voteUp";
    voto = "up";
}
  else if (comment.voto == "up"){
    call = "comments.removeVoteUp";
    voto = "";
  }
  else if (comment.voto == "down"){
    Meteor.call("comments.removeVoteDown",id,comment);
    call = "comments.voteUp";
    voto = "up";
  }
  Meteor.call(call, id, comment, ()=>{
    this.props.question.comments.map((com, i)=>{
      commentsWithVotes[i].votes = comment.votes;
      if(com.authorId == comment.authorId ){
        commentsWithVotes[i].voto = voto; 
      }
    })
    
    this.setState({commentsWithVotes:commentsWithVotes});
  })
}
handleThumbsDown(commentsWithVotes, comment,index, ev){
  const id = this.props.question._id;
  let voto = "";
  let call = "";
  if(comment.voto == "" || comment.voto == undefined){
    call = "comments.voteDown";
    voto = "down";
  }
  else if (comment.voto == "down"){
    call = "comments.removeVoteDown";
    voto = "";
  }
  else if (comment.voto == "up"){
    Meteor.call("comments.removeVoteUp",id,comment);
    call = "comments.voteDown";
    voto = "down";
  }
  Meteor.call(call, id, comment, ()=>{
    this.props.question.comments.map((com, i)=>{
      commentsWithVotes[i].votes = com.votes;
      if(com.authorId == comment.authorId ){
        commentsWithVotes[i].voto = voto; 
      }
    })
    this.setState({commentsWithVotes:commentsWithVotes});
  })
  
}
compare(a,b) {
  if (a.votes.result < b.votes.result)
    return 1;
  if (a.thumbsUp > b.thumbsUp) 
    return -1;
  return 0;
}
timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
renderComments(){
  const self = this; 
  let propsComments = this.props.question.comments;
  let comments = this.updateVotes(propsComments);
  let stateComments = this.state.commentsWithVotes;
  comments.map((comment,index)=>{
    comment.voto = stateComments[index] != undefined ? stateComments[index].voto : "" ;
  })
  return ( 
    <div className="row listComments">
    {comments.map(function(comment, index){
      let classUp = "btn btn-default stat-item ";
      let classDown = "btn btn-default stat-item ";
      let commentStyle = {top: index*200 + "px"};
      if(comment.voto == "up"){
        classUp += "buttonActive up"; 
        classDown += "buttonInactive";
      }
      else if (comment.voto == "down"){
        classUp += "buttonInactive";
        classDown += "buttonActive down";
      }
      else{
        classUp += "buttonInactive";
        classDown +="buttonInactive"
      }
      if(comment.text != ""){
        return(
          <div className="col individualComment" style={commentStyle}>
            <div className="panel panel-white post panel-shadow">
             <div className="post-heading">
                <div className="pull-left image">
                  <img src="http://plugins.krajee.com/uploads/default_avatar_male.jpg" alt="default img" className="img-circle avatar" alt="user profile image"/>
                </div>
                <div className="pull-left meta">
                  <div className="title h5">
                    <b>{comment.authorName + " "}</b>
                    made a comment.
                  </div>
                  <h6 className="text-muted time">{self.timeSince(comment.createdAt) + " ago"}</h6>
                </div>
              </div>
              <div className="post-description"> 
              <p>{comment.text}</p>
                <div className="stats">
                  <a href="" className={classUp} onClick={(ev) =>self.handleThumbsUp(comments, comment, index, ev)}>
                      <i className="fa fa-thumbs-up icon"></i> | {comment.votes.result}
                  </a>
                  <a href="" className={classDown} onClick={(ev) =>self.handleThumbsDown(comments, comment, index, ev)}>
                      <i className="fa fa-thumbs-down icon"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          )
        }
    })}
    </div>
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
handleOptionAdd(e) {
    if (e.key === 'Enter') {
      const name = ReactDOM.findDOMNode(this.refs.option).value.trim();
      const question = this.props.question;
      var found = false;
      this.props.question.options.map((option)=>{
        if(option.name == name){
          found = true;
        }
      })
      if(!found){
        this.setState({display:false})
        let newOption = {name:name, count:0,countries:[]};
        Meteor.call("questions.addOption", question._id,newOption);
    }
    else{
      this.setState({display:true,error:"La opción ya está registrada"})
    }
      ReactDOM.findDOMNode(this.refs.option).value = "";
    }
  }
handleChange = (value) => {
    this.setState({
      value: value,
    });
  };
   handleRequestClose() {
    this.setState({
      open: false,
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
    const route = "/user/"+question.ownerId
    return(
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="container">
          <div>
            <form id="answerQuestion"></form>
              <section className="question-list">
                <article className="row">
                  <div className="col-md-2 col-sm-2 hidden-xs">
                    <figure className="thumbnail">
                      <img className="img-responsive" alt="default-img" src="http://www.keita-gaming.com/assets/profile/default-avatar-c5d8ec086224cb6fc4e395f4ba3018c2.jpg" />
                      <figcaption className="text-center"><a href={route}>{question.ownerName}</a></figcaption>
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
              {user != null && userId != question.ownerId && !this.state.submited &&
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
                  {question.canAdd && 
                  <div className="form-group">
                    <h4 className = "silver">Add new possible answer</h4>
                    <input required
                      type="text"
                      onKeyPress={this.handleOptionAdd.bind(this)}
                      ref="option"
                      placeholder="Press enter to submit the new option"
                      className="form-control"
                    />
                  </div>
                }
                { this.state.display &&
                  <div className="error">
                    {this.state.error}
                </div>
                }
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
            {user == null || (this.state.submited && userId != question.ownerId) &&
              <h2 className = "silver"> Analytics: </h2>
            }
            {(this.state.submited || userId == question.ownerId || user == null) &&
            <div>
              <hr/>
              {this.renderTabs()}
              <h2 className = "silver"> Comments</h2><br/>
              <div className={classes}>
                <div className="comments">
                  {this.renderComments()}
                </div> 
              </div>
            </div>
          }
          </div>

          
          </MuiThemeProvider>
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