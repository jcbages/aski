import { Meteor } from 'meteor/meteor';
import '../imports/api/collections.js';
import '../imports/api/options.js';
import '../imports/api/questions.js';
import { Accounts } from "meteor/accounts-base";
import { Inject } from "meteor/meteorhacks:inject-initial";

Meteor.startup(() => {
  // code to run on server at startup
  Inject.rawModHtml("addLanguage", function(html) {
    return html.replace(/<html>/, '<!-- HTML 5 -->\n<html lang="en">');
  });
  
  Accounts.onCreateUser((options, user) => {
  	newUser = Object.assign({
      country:options.profile.country
    }, user);

  	return newUser;
  })

  Meteor.publish('users', function () {
    return Meteor.users.find();
  });

  Meteor.publish("Meteor.users.country", function(){
		return Meteor.users.find({_id: this.userId},
        {fields: {'country': 1}});
	});
  Meteor.methods({
    'user.insert'(newUserData){
      return Accounts.createUser(newUserData);
    },
    'user.update'(newUserData){
      Meteor.users.update(this.userId, {
        $set: {
          img_url:newUserData.img_url,
          bio:newUserData.bio
        }
      });
    }
  });
});
