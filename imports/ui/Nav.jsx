import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { createContainer } from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor"
///////////
// Header //
////////////

class Nav extends React.Component{

  performSearch(e) {
    // stop form from submitting
    e.preventDefault();

    // get the value
    var query = $(".Search input").val();
    query = {query:query}
    FlowRouter.go("/questions", "" ,query);
  }
 

  render() {
    return (
      <header className="Header">
        <Logo/>
        <Navigation currentUser={this.props.currentUser}/>
        <Search onSubmit={this.performSearch.bind(this)} />
      </header>
    );
  }
}
class Logo extends React.Component{
  render() {
    return (
      <div id="logo" className="Logo">
        <a href="/">
          <svg width="300" height="81.38" xmlns="http://www.w3.org/2000/svg">
            <g>
              <title>Logo</title>
              <text stroke="#000" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" id="svg_12" y="250.7" x="457.5" fillOpacity="null" strokeOpacity="null" strokeWidth="0" fill="#000000"/>
              <path id="svg_13" d="m373.5,241.7" opacity="0.5" fillOpacity="null" strokeOpacity="null" strokeWidth="1.5" stroke="#000" fill="none"/>
              <text fontStyle="normal" fontWeight="bold" stroke="#000" transform="matrix(5.457497378637608,0,0,3.228946107668764,-685.360303996764,-391.9010894248071) " textAnchor="start" fontFamily="'Palatino Linotype', 'Book Antiqua', Palatino, serif" fontSize="24" id="svg_14" y="143.212316" x="126.374748" strokeOpacity="null" strokeWidth="0" fill="#ff3426">Aski</text>
            </g>
          </svg>
        </a>
      </div>
    );
  }
}

// Navigation
class Navigation extends React.Component{
   myQuestions(e){
    FlowRouter.go("/myQuestions","", {idUser:this.props.currentUser._id});
  }
  handleLogout(){
    Meteor.logout();
    FlowRouter.go("/");   
  }
  render() {
    return (
      <div id="navigation" className="Navigation">
        <nav>
          <ul>
            <li onClick={()=>{FlowRouter.go("/questions")}}>Browse</li>
            {this.props.currentUser &&
              <li onClick={()=>{FlowRouter.go("/add")}}>Add Question</li>
            }
            {this.props.currentUser &&
              <li onClick={this.myQuestions.bind(this)}>My Questions</li>
            }
            {this.props.currentUser ?
                <div className="account pull-right">
                <img src="/img/profile_placeholder.svg" className="profile-pic"/>
                <div className="details">
                <p className="headline">Logged in as:</p>
                <p className="username text-primary">{this.props.currentUser.username}</p>
                </div>
                <li className="logout" onClick={this.handleLogout.bind(this)}>Log Out</li>
                </div>
              : ""
            }
          </ul>
        </nav>
      </div>
    );
  }
}

// Search
class Search extends React.Component{
  render() {
    return (
      <form onSubmit={this.props.onSubmit} id="search" className="Search">
        <input type="search" placeholder="Search for a question..." />
      </form>
    );
  }
}

export default createContainer(() => {
  return {
    currentUser:Meteor.user(),
  };
}, Nav);