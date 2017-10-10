import React, {Component} from "react";
import PropTypes from "prop-types";

import {Meteor} from "meteor/meteor";

import TextField from "material-ui/TextField";
import RaisedButton from 'material-ui/RaisedButton';

class LogInForm extends Component{

  constructor(props){
    super(props);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.user = {};
    this.error = "";
  }

  onUserChange(event, newValue){
    event.preventDefault()
    this.user.username = newValue;
  }

  onPasswordChange(event, newValue){
    event.preventDefault();
    this.user.password = newValue;
  }

  handleLogIn(event){
    event.preventDefault();
    const username = this.user.username;
    const password = this.user.password;

    Meteor.loginWithPassword(username, password, (error) =>{
      if(error){
        console.log(error);
        this.props.error = error.reason;
      }
      else{
        this.props.popup();
      }
    })
    
  }
	render(){
		return (
      <form>
        <button className="cancel" onClick={() => this.props.popup()}>
          &times;
        </button>
        <div>
          Login
        </div>
        <div>
        <TextField 
          hintText="Username"
          errorText={this.props.error}
          hintStyle={{color: "rgba(0,0,0,.26)",pointerEvents:"none",zIndex: "1",bottom: "10px",left: "5px"}} 
          onChange={this.onUserChange}
        />
        <TextField 
          hintText="Password"
          type="password"
          errorText={this.props.error}
          hintStyle={{color: "rgba(0,0,0,.26)",zIndex: "1",pointerEvents:"none",bottom: "10px",left: "5px"}} 
          onChange={this.onPasswordChange}
        />
        </div>
        <RaisedButton label="Log In" style={{margin:"5px 0"}} secondary={true} onClick={this.handleLogIn.bind(this)}/>
  		</form>
    );
	}
}

export default LogInForm;
