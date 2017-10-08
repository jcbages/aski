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