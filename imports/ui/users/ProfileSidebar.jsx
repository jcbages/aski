import { Meteor } from 'meteor/meteor';
import React, {Component} from "react";
import {createContainer} from "meteor/react-meteor-data";
import "./ProfileSidebar.css"

class UserSidebar extends Component{
	constructor(props){
		super(props)
		this.changeEditing = this.changeEditing.bind(this)
		this.onChangeImage = this.onChangeImage.bind(this)
		this.onChangeBio = this.onChangeBio.bind(this)
		this.onSendChanges = this.onSendChanges.bind(this)
		this.onCancel = this.onCancel.bind(this)
		this.state ={
			image:this.props.user.img_url || "http://www.keita-gaming.com/assets/profile/default-avatar-c5d8ec086224cb6fc4e395f4ba3018c2.jpg",
			bio: this.props.user.bio || "",
			isEditing:false
		}
	}
	changeEditing(){
		this.setState({
			isEditing:!this.state.isEditing
		})
	}
	onChangeImage(evt){
		this.setState({
			image:evt.target.value
		})
	}
	onChangeBio(evt){
		this.setState({
			bio:evt.target.value
		})
	}
	onSendChanges(){
		const updatedInfo = {
			img_url:this.state.image,
			bio:this.state.bio
		}
		Meteor.call('user.update', updatedInfo)
		this.setState({
			isEditing:!this.state.isEditing
		})
	}
	onCancel(){
		this.setState({
			isEditing:!this.state.isEditing
		})
	}
	render(){
		const img_url = this.props.user.img_url || "http://www.keita-gaming.com/assets/profile/default-avatar-c5d8ec086224cb6fc4e395f4ba3018c2.jpg";
		const username = this.props.user.username;
		const userBio = this.props.user.bio || "This user doesn't has a bio yet.";
		const canEdit = Meteor.userId() === this.props.user._id;
		const isEditing = this.state.isEditing;
		const questions = this.props.questions;
		let rating = 0;
		let sum = 0;
		questions.map((question)=>{
			sum += question.rating.rating;
		})
		if(questions.length != 0)
			rating = sum/questions.length;
		else
			rating = 0;
		return(
			
			<div className="profile-sidebar">
				<div className="profile-userpic">
					<img src={img_url} className="img-responsive" alt={username+" profile image"}></img>
				</div>
				{!isEditing ?
					<div className="profile-usertitle">
					<div className="profile-usertitle-name">
					{username}
					</div>
					Avg rating: {rating}/5
					<div className="profile-usertitle-bio">
					{userBio}
					</div>
					{canEdit &&
						<div className="container-fluid">
							<button type="button" className="btn btn-primary btn-block" onClick={this.changeEditing}>
								Update profile
							</button>
						</div>
					}
					</div>
				:
				(<div className="profile-usertitle">
					<div className="form-group">
					    <label htmlFor="imageUrl">Image Url</label>
					    <input value={this.state.image} type="text" className="form-control" id="ImageUrl" 
					    placeholder="Enter url of your profile image" onChange={evt => this.onChangeImage(evt)}></input>
					 </div>
					<div className="form-group">
					    <label htmlFor="bio">Bio</label>
					    <input value={this.state.bio} type="text" className="form-control" id="bio" 
					    placeholder="Talk about you" onChange={evt => this.onChangeBio(evt)}></input>
					 </div>
					 <button onClick={this.onSendChanges} type="button" className="btn btn-primary btn-block">Save</button>
					 <button onClick={this.onCancel} type="button" className="btn btn-danger btn-block">Cancel</button>
				</div>
				)}
			</div>
		)
	}
}

export default UserSidebar;