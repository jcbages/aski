import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Questions } from "./questions.js"
import faker from 'faker';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon } from 'meteor/practicalmeteor:sinon';


const assert = chai.assert;
const newUser = {
      username: "test",
      password: "test",
      profile: {
        country:null
      }
    }
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
  let currentId = faker.name.findName();
  beforeEach(function () {
    resetDatabase();
    Factory.define('user', Meteor.users, {
      username:currentId,
    });
    currentUser = Factory.create('user');
    sinon.stub(Meteor, 'user');
    Meteor.user.returns(currentUser);
    sinon.stub(Meteor, 'userId', () => currentId);
  });
   afterEach(() => {
    Meteor.userId.restore();
    Meteor.user.restore();
    resetDatabase();
  });

  it('Inserts a question', function () {
    // This code will be executed by the test driver when the app is started
    // in the correct mode
    const questionsParams = Factory.create("question");
    Meteor.call('questions.insert', questionsParams.question, questionsParams.description, questionsParams.categories,
    	questionsParams.options, questionsParams.canAdd, questionsParams.collections);
    const question = Questions.findOne({question:questionsParams.question});
    console.log(question)
    assert.equal(question.description, questionsParams.description);
  })
})