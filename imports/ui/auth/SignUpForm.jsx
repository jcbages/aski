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
    const username = this.user.username;
    const password = this.user.password;
    const country  = this.user.country;
    Accounts.createUser({
      username: username,
      password: password,
      profile: {
        country: country
      }
    }, (err)=>{
      if(err){
        console.log(err);
      }
      else{
        this.props.parent.setState({showPopup:false});
      }
    });
  }

	render(){
      console.log(this.props.parent);

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
        <div>Country</div>
        <CountrySelect flagImagePath="/flags/" onSelect={this.onSelectCountry}/>
        <RaisedButton label="Sign In" secondary={true} onClick={this.handleSignUp.bind(this)}/>
  		</form>
    );
	}
}

export default SignUpForm;
