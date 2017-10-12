import { Meteor } from 'meteor/meteor';
import React, {Component} from "react";
import PropTypes from "prop-types";

import { Accounts } from "meteor/accounts-base";

import TextField from "material-ui/TextField";
import RaisedButton from 'material-ui/RaisedButton';
import CountrySelect from "react-country-select";

class SignUpForm extends Component{

  constructor(props){
    super(props);
    this.onSelectCountry = this.onSelectCountry.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.user = {};
    this.error = "";
    this.state = {error:"",display:false}
  }

  onSelectCountry(val){
    this.user.country = val;

  }

  onUserChange(event, newValue){
    event.preventDefault()
    this.user.username = newValue;
  }

  onPasswordChange(event, newValue){
    event.preventDefault();
    this.user.password = newValue;
  }

  handleSignUp(event){
    event.preventDefault();
    this.setState({error:"",display:false})
    const username = this.user.username;
    const password = this.user.password;
    const country  = this.user.country;

    const newUser = {
      username: this.user.username,
      password: this.user.password,
      profile: {
        country:this.user.country
      }
    }
    Meteor.call("user.insert", newUser, (err, result) => {
      console.log(username)
      console.log(password)
      if(err){
        window.alert(err.reason);
        console.log(err);
        this.props.error = error.reason;
        this.setState({error:error.reason,display:true})
      }
      else{
        Meteor.loginWithPassword(username,password)
        this.props.popup();
    
      }
    });
  }
  render(){
    return (
      <form>
        <button className="cancel" onClick={() => this.props.popup()}>
          &times;
        </button>
        <div>Sign Up</div>
        <TextField
          hintText="Username"
          hintStyle={{color: "rgba(0,0,0,.26)",pointerEvents:"none",zIndex: "1",bottom: "10px",left: "5px"}}
          errorText={this.props.error}
          onChange={this.onUserChange}
        />
        <TextField
          hintText="Password"
          type="password"
          hintStyle={{color: "rgba(0,0,0,.26)",pointerEvents:"none",zIndex: "1",bottom: "10px",left: "5px"}}
          errorText={this.props.error}
          onChange={this.onPasswordChange}
        />
        { this.state.display &&
                  <div className="error">
                    {this.state.error}
                </div>
        }
        <CountrySelect flagImagePath="/flags/" onSelect={this.onSelectCountry}/>
        <RaisedButton style={{margin:"5px 0"}} label="Sign In" secondary={true} onClick={this.handleSignUp.bind(this)}/>
  		</form>
    );
	}
}

export default SignUpForm;
