import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";


const countryOptSchema = new SimpleSchema({
  countryCode: String,
  countryName: String,
  count: SimpleSchema.Integer
});

const optionSchema = new SimpleSchema({
  name: String,
  count: SimpleSchema.Integer,
  countries: [countryOptSchema]
});

export const Options = new Mongo.Collection("options");

if (Meteor.isServer) {
 
  Meteor.publish('options', function() {
    return Options.find();
  });
}

Meteor.methods({
  'options.insert'(name) {

    // Make sure the user is logged in before inserting a task
    if (! Meteor.user()._id) {
      throw new Meteor.Error('not-authorized');
    }
    Options.insert({
      name: name,
      count:0,
      countries:[]
    })
  },
  "options.remove"(id){
    // Make sure the user is logged in before inserting a task
    if (! Meteor.user()._id) {
      throw new Meteor.Error('not-authorized');
    }
    Options.remove({_id:id});
  }

});