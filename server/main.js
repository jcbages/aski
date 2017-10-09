import { Meteor } from 'meteor/meteor';
import '../imports/api/questions.js';
import '../imports/api/options.js';
import { Accounts } from "meteor/accounts-base";

Meteor.startup(() => {
  // code to run on server at startup
  Accounts.onCreateUser((options, user) => {
  	newUser = Object.assign({
      country:options.profile.country
    }, user);

  	return newUser;
  })

  Meteor.publish('users', function () {
    console.log("Server Log: publishing all users");
    return Meteor.users.find();
  });

  Meteor.publish("Meteor.users.country", function(){
		return Meteor.users.find({_id: this.userId},
        {fields: {'country': 1}});
	});

  Meteor.methods({
  'user.insert'(newUserData){
    return Accounts.createUser(newUserData);
  }
})
});
