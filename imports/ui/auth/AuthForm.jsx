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
	console.log(this.props.parent);
    const label = this.state.signUp ? "Log In" : "Sign Up";
		return(
      <div>
        {this.state.signUp ?
          <SignUpForm parent = {this.props.parent} /> :
          <LogInForm parent = {this.props.parent} />
        }
        <Toggle label={label} onToggle={this.onToggle} toggled={this.state.signUp} />
      </div>
		);
	}
}

export default AuthForm;