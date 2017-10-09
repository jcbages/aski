import { Meteor } from 'meteor/meteor';
import '../imports/api/questions.js';
import '../imports/api/options.js';
import { Accounts } from "meteor/accounts-base";

Meteor.startup(() => {
  // code to run on server at startup
  Accounts.onCreateUser((options, user) => {
  	user.country = user.profile.country;
  	user.profile = {};
  	return user;
  })

  Meteor.publish("Meteor.users.country", function(){
		return Meteor.users.find({_id: this.userId},
        {fields: {'country': 1}});
	});
});
