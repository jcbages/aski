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

const ratingSchema = new SimpleSchema({
  rating:Number,
  count:SimpleSchema.Integer,
});

const commentSchema = new SimpleSchema({
  authorId: String,
  authorName: String,
  text: String,
  createdAt: Date,
  rating: ratingSchema,
});

const questionSchema = new SimpleSchema({
  question: String,
  description:String,
  publishedAt: Date,
  options: [optionSchema],
  ownerId: String,
  ownerName: String,
  comments: [commentSchema],
  categories: [String],
  rating:ratingSchema,

});

export const Questions = new Mongo.Collection("questions");

