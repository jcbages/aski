import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { createContainer } from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AuthForm from "./auth/AuthForm.jsx"
import Popup from "react-popup";
import SweetAlert from "react-bootstrap-sweetalert";
///////////
// Header //
////////////

class Nav extends React.Component{

  render() {
    return (
      <header className="Header">
        <Logo/>
        <Navigation currentUser={this.props.currentUser}/>
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
class Navigation extends Component{
  constructor() {
    super();
    this.state = {
      showPopup: false
    };
    this.handlePopup = this.handlePopup.bind(this);
  }
   handlePopup(ev){
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
   myQuestions(e){
    FlowRouter.go("/myQuestions","", {idUser:this.props.currentUser._id});
  }
  handleLogout(){
    Meteor.logout();
    FlowRouter.go("/");   
  }

  render() {
    let self = this;
    return (
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
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
          <div className="details">
          <p className="headline">Logged in as:</p>
          <p className="username text-primary">{this.props.currentUser.username}</p> 
          </div>
          <div className="logout" onClick={this.handleLogout.bind(this)}>Log Out</div>
          </div>
          :
          <div className="account pull-right">
            <div className="details">
            <RaisedButton  onClick={self.handlePopup}>Sign In / Login</RaisedButton> 
            </div>
          </div>
        }
        </ul>
        </nav>
      </div>
      {this.state.showPopup ?
          <SweetAlert
          title={<AuthForm popup={self.handlePopup}/>}
          showConfirmButton= {false} // There won't be any confirm button
          onConfirm={this.handlePopup.bind(this)}
        />
        : null
      }
    </MuiThemeProvider>
    );
  }
}

export default createContainer(() => {
  return {
    currentUser:Meteor.user(),
  };
}, Nav);