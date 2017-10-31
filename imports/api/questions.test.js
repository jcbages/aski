import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import Questions from "./questions.js"
import faker from 'faker';

const assert = chai.assert;

var createCategories = function(){
	const arr = [];
	for (var i = 2; i >= 0; i--) {
		arr.push(faker.lorem.word())
	}
	return arr;
}

Factory.define('question', Questions, {
  question: () => faker.lorem.sentence(),
  description: () => faker.lorem.sentence(),
  categories: () => createCategories(),
  rating: () => {return {rating:3.5,count:0}},
  options: () => {return ["a","b"]},
  canAdd: () => faker.random.boolean(),
  publishedAt: () => new Date(),
});

describe('question api', function () {
  it('Inserts a question', function () {
    // This code will be executed by the test driver when the app is started
    // in the correct mode
    const questionsParams = {
		question: () => faker.lorem.sentence(),
		description: () => faker.lorem.sentence(),
		categories: () => createCategories(),
		options: () => {return ["a","b"]},
		canAdd: () => faker.random.boolean(),
		collections: () => ['a','b']
    }
    Meteor.call('questions.insert', questionsParams.question, questionsParams.description, questionsParams.categories,
    	questionsParams.options, questionsParams.canAdd, questionsParams.collections)
    const questions = Questions.find({question:questionsParams.question})
    assert.equal(question.description, questionsParams.description)
  })
})