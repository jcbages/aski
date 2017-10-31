import { Meteor } from 'meteor/meteor';
import React, {Component} from "react";
import {createContainer} from "meteor/react-meteor-data";
import "./ProfileSidebar.css"
import ProfileSidebar from "./ProfileSidebar.jsx";
import ProfileQuestionList from "./ProfileQuestionList.jsx"
import {Questions} from '../../api/questions.js';


class ProfilePage extends Component{
	constructor(props){
		super(props)
		console.log(props)
	}
	render(){
		return(
			<div className="profile-container">
				<div className="container-fluid">
					<div className="row">
						<div className="col-sm-4">
							<ProfileSidebar user={this.props.user} questions = {this.props.questions}/>
						</div>
						<div className="col-sm-8">
							<ProfileQuestionList user={this.props.user} currentUser = {this.props.currentUser}
												 questions = {this.props.questions}/> 
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default createContainer(({id}) => { 
  const handle = Meteor.subscribe('questions.myself', id)
  return {
  	ready:handle.ready(),
	questions: Questions.find({}, {sort:{"rating.rating":-1}}).fetch(),
	user: Meteor.users.findOne(id),
	currentUser: Meteor.user()
  };
}, ProfilePage);