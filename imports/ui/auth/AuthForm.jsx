import React, {Component} from "react";
import SignUpForm from "./SignUpForm.jsx";
import LogInForm from "./LogInForm.jsx";

import Toggle from 'material-ui/Toggle';

class AuthForm extends Component{
	constructor(props){
		super(props);
		this.state= {
			signUp:true
		};
		this.onToggle = this.onToggle.bind(this);
	}

	onToggle(event, toggleVal){
		event.preventDefault();
		this.setState({
			signUp:!this.state.signUp
		});
	}

	render(){
    const label = this.state.signUp ? "Log In" : "Sign Up";
		return(
      <div>
        {this.state.signUp ?
          <SignUpForm popup = {this.props.popup} /> :
          <LogInForm popup = {this.props.popup} />
        }
        <Toggle label={label} onToggle={this.onToggle} toggled={this.state.signUp} />
      </div>
		);
	}
}

export default AuthForm;