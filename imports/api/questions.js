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

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('questions.query', function(query) {
    return Questions.find({question:{$regex:".*" + query +".*"}});
  });
  Meteor.publish('questions.id', function(id) {
    return Questions.find({_id:id});
  });
  Meteor.publish('questions', function() {
    return Questions.find();
  });
}

Meteor.methods({
  'questions.insert'(question, description, categories, options) {

    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Questions.insert({
      question: question,
      publishedAt: new Date(),
      description:description,
      categories:categories,
      ownerId:Meteor.userId(),
      ownerName:Meteor.user().username,
      rating:{rating:0,count:0},
      options:options,
      comments:[]
    })
  },
  'questions.answer'(id,rating, options,comments, found, idOption, idCountry){
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Questions.update({_id:id},{
      $addToSet: {comments:comments },
      $set: { rating: rating}
    })
    Questions.findAndModify({
      query: { _id: id, options: { $elemMatch: { name: options.name} } },
      update: { $inc: { "options.$.count": 1 } }
    })
    var find = "options." + idOption + ".countries." + idCountry + ".count";
    var obj={};
    obj[find] = 1; 
    console.log(obj);
    if(found){
    Questions.update(
      { _id: id},
      { $inc: obj}
      )
    }
    else{
    Questions.update(
      {_id:id, "options.name":options.name,"options.$.countries.countryCode":{$ne:options.countries.countryCode}},
      {$push: {"options.$.countries": {"countryCode":options.countries.countryCode, "countryName":options.countries.countryName,"count":1}}}
      )
  }
  },
  "comments.voteUp"(id, comment){
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Questions.update(
      { _id: id, "comments.authorId": comment.authorId, "comments.createdAt": comment.createdAt},
      {$inc: { "comments.$.rating.count":1},$inc: { "comments.$.rating.rating":1}}
      )

  },
  "comments.voteDown"(id, comment){
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Questions.update(
      { _id: id, "comments.authorId": comment.authorId, "comments.createdAt": comment.createdAt},
      {$inc: { "comments.$.rating.count":1},$inc: { "comments.$.rating.rating":-1}}
      )
  }
});
