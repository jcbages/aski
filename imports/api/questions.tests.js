import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Meteor } from 'meteor/meteor';
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
  options: () => {return []},
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
    assert.equal(question.description, questionsParams.description);
  })

  it("Answers a question", function(){
    const questionsParams = Factory.create("question");
    Meteor.call('questions.insert', questionsParams.question, questionsParams.description, questionsParams.categories,
      questionsParams.options, questionsParams.canAdd, questionsParams.collections);
    let question = Questions.findOne({question:questionsParams.question});
    const rating = faker.random.number();
    const comment = faker.lorem.sentence();
    const option = {name:faker.name.findName(),count:faker.random.number(),countries:[]};
      Meteor.call('questions.answer',question._id,rating, option,comment, false, 0, 0);
      question = Questions.findOne({question:questionsParams.question});
      assert.equal(question.comments[0],comment);
    })

  it("Adds a new option", function(){
    const questionsParams = Factory.create("question");
    Meteor.call('questions.insert', questionsParams.question, questionsParams.description, questionsParams.categories,
      questionsParams.options, questionsParams.canAdd, questionsParams.collections);
    let question = Questions.findOne({question:questionsParams.question});
    const option = {name:faker.name.findName(),count:1,countries:[]};
    Meteor.call("questions.addOption", question._id, option);
    question = Questions.findOne({question:questionsParams.question});
    assert.equal(question.options[0].name, option.name); 
  }) 
})