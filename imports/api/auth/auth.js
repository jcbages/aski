import { Meteor } from 'meteor/meteor';


if(Meteor.isServer){
	Meteor.publish("Meteor.users.country", function({userId}){
		const selector = {
			_id:userId
		}

		const options = {
			fields: {
				country: 1
			}
		}

		return Meteor.users.find(selector options)
	});
};