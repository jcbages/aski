import { Meteor } from 'meteor/meteor';
import '../imports/api/questions.js';
import { Accounts } from "meteor/accounts-base";

Meteor.startup(() => {
  // code to run on server at startup
  Accounts.onCreateUser((options, user) => {
  	user.country = options.profile.country;
  	user.profile = {};
  	return user;
  })
});
