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

    Meteor.loginWithPassword(username, password, function(error){
      if(error){
        console.log(error);
      }
    })
    
  }

	render(){
		return (
      <form>
        <div>Username</div>
        <TextField 
          hintText="Username"
          errorText=""
          onChange={this.onUserChange}
        />
        <div>Password</div>
        <TextField 
          hintText="Password"
          type="password"
          errorText=""
          onChange={this.onPasswordChange}
        />
        <RaisedButton label="Log In" secondary={true} onClick={this.handleLogIn}/>
  		</form>
    );
	}
}

export default LogInForm;
