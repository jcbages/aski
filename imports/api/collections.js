import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";
import {Questions} from "./questions"

const collectionSchema = new SimpleSchema({
	name:String,
	owner:String,
	createdAt:Date,
	questions:[String]
});

export const Collections = new Mongo.Collection("collections");
if(Meteor.isServer){
  Meteor.publish('collections.user', function(userId){
    return Collections.find({owner:userId})
  })
  Meteor.publish("collections.questions", function(collectionId){
    var questions = Collections.findOne({_id:collectionId}).questions;

    return Questions.find({_id:{$in:questions}});
  })
}

Meteor.methods({
  "collections.insert"(name){

  	const userId = Meteor.userId();

    // Make sure the user is logged in before inserting a task
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    const collection = {
    	name:name,
    	owner:userId,
    	createdAt:new Date(),
    	questions:[]
    }

    collectionSchema.validate(collection);

    return Collections.insert(collection)
  },
  'collections.questions.insert'(questionId, collections){

  	const userId = Meteor.userId();

    // Make sure the user is logged in before inserting a task
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    const collectionIds = collections.map(function(d){
      return d.id;
    })

    const existingCollections = Collections.find({_id:{$in:collectionIds}}).fetch()
    const nonExistingCollections = collections.filter(function(collection){
      var exists = false;
      for (var i = existingCollections.length - 1; i >= 0 && !exists; i--) {
        if(existingCollections[i]._id === collection.id)
          exists = true;
      }
      return !exists;
    })

    existingCollections.forEach((collection)=>{
      if(collection.owner !== userId){
        throw new Meteor.Error('collections.questions.insert.unauthorized',
          'Cannot add questions in a collection thats not yours');
      } 
      Collections.update({_id:collectionId},{$push:{questions:questionId}})
    }) 

    nonExistingCollections.forEach((collection)=>{
      Meteor.call('collections.insert', collection.name, (err, result)=>{
        if(err){
          throw new Meteor.Error('collections.questions.insert.error',
          'Error adding in the database');
        }
        Collections.update({_id:result},{$push:{questions:questionId}})
      })
    })
  }
});