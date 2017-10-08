import { Meteor } from 'meteor/meteor';
import '../imports/api/questions.js';
import '../imports/api/options.js';
import { Accounts } from "meteor/accounts-base";

Meteor.startup(() => {
  // code to run on server at startup
  Accounts.onCreateUser((options, user) => {
  	user.profile = {};
  	user.profile['country'] = options.profile.country;
  	return user;
  })
});
