import React, {Component} from "react";
import SignUpForm from "./SignUpForm.jsx";
import LogInForm from "./LogInForm.jsx";

import Toggle from 'material-ui/Toggle';

class AuthForm extends Component{
	constructor(props){
		super(props);
		this.state= {
			signUp:false,
			text:"Not signed up? Click here."
		};
		this.onClick = this.onClick.bind(this);
	}

	onClick(event, toggleVal){
		event.preventDefault();
		this.setState({
			signUp:!this.state.signUp,
		});
		if(this.state.signup){
			this.setState({text:"Not signed up? Click here."})
		}
		else{
			this.setState({text:"Already signed up? Login here."})
		}
	}

	render(){
    const label = this.state.signUp ? "Log In" : "Sign Up";
		return(
      <div>
        {this.state.signUp ?
          <SignUpForm popup = {this.props.popup} /> :
          <LogInForm popup = {this.props.popup} />
        }
        <a href="" onClick={this.onClick} ><h5> {this.state.text} </h5></a>
      </div>
		);
	}
}

export default AuthForm;