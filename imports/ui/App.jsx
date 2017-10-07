import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { createContainer } from "meteor/react-meteor-data";
import { Questions } from "../api/questions.js";
import Question from "./Question.jsx";
import { Session } from "meteor/session";
import {Meteor} from "meteor/meteor"

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AuthForm from "./auth/AuthForm.jsx"
import RaisedButton from 'material-ui/RaisedButton';
import Popup from "react-popup";
import SweetAlert from "react-bootstrap-sweetalert";


// App component - represents the main app component
class App extends Component {
  constructor() {
    super();
    this.state = {
      showPopup: false
    };
  }

  handlePopup(ev){
    this.setState({
      showPopup: !this.state.showPopup
    });
  }


  render() {
    console.log(this.props.currentUser);

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className = "container">
          <div id="hero" className="Hero" style={{backgroundImage: "url(/background.jpg)"}}>
            <div className="content">

              <h1> Pregunta lo que quieras, cuando quieras</h1>
              <p>Con Aski puedes preguntar y responder cientos de preguntas de todas partes del mundo. Solo create una cuenta y accede a la mejor red de preguntas.</p>

              {!this.props.currentUser ?
                <RaisedButton  onClick={this.handlePopup.bind(this)}>Sign In / Login</RaisedButton> : null
              }
            </div>
            <div className="overlay"></div>
          </div>
        </div>
        {this.state.showPopup ?
          <SweetAlert
          title={<AuthForm popup={this.handlePopup.bind(this)}/>}
          style={{color:"grey"}}
          onOutsideClick={()=>
            this.setState({ showPopup: false })
            }
          onConfirm={() => this.setState({ showPopup: false })} />
        : null
        }
      </MuiThemeProvider>
    );
  }
}
App.propTypes = {
  questions: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Session.setDefault("query","");
  return {
    questions: Questions.find({question: {"$regex": Session.get("query")}}, { sort: { publishedAt: -1 }}).fetch(),
    currentUser:Meteor.user(),
  };
}, App);