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

var createComments = function(){
  const obj = {
  authorId: faker.name.findName(),
  authorName: faker.name.findName(),
  text: faker.lorem.sentence(),
  createdAt: new Date(),
  votes: {result:0,
    votersUp:[],
    votersDown:[]
    }
  }
  var arr = []
  arr.push(obj)
  return arr
}

Factory.define('question.comments', Questions, {
  question: () => faker.lorem.sentence(),
  description: () => faker.lorem.sentence(),
  categories: () => createCategories(),
  rating: () => {return {rating:3.5,count:0}},
  options: () => {return []},
  canAdd: () => faker.random.boolean(),
  publishedAt: () => new Date(),
  comments: ()=>createComments()
});

Factory.define('question', Questions, {
  question: () => faker.lorem.sentence(),
  description: () => faker.lorem.sentence(),
  categories: () => createCategories(),
  rating: () => {return {rating:3.5,count:0}},
  options: () => {return []},
  canAdd: () => faker.random.boolean(),
  publishedAt: () => new Date()
});

describe('question api', function () {
  beforeEach(function () {
    resetDatabase(); 
    Factory.define('user', Meteor.users, {
      username:faker.name.findName(),
    });
    currentUser = Factory.create('user');
    sinon.stub(Meteor, 'user');
    Meteor.user.returns(currentUser);
  });
   afterEach(() => {
    Meteor.user.restore();
    resetDatabase();
  });

  it('Inserts a question', function () {
    // This code will be executed by the test driver when the app is started
    // in the correct mode
    const questionsParams = Factory.build("question");
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

  it('Votes Up a comment', function(){
    const questionsParams = Factory.create('question.comments')
    var comment = questionsParams.comments[0]
    //Checking initial state
    assert.equal(comment.votes.result, 0)
    assert.lengthOf(comment.votes.votersUp, 0)
    assert.lengthOf(comment.votes.votersDown, 0)

    Meteor.call('comments.voteUp', questionsParams._id, comment)

    const newQuestion = Questions.findOne(questionsParams._id)
    comment = newQuestion.comments[0]
    //Checking new state
    assert.equal(comment.votes.result, 1)
    assert.lengthOf(comment.votes.votersUp, 1)
    assert.lengthOf(comment.votes.votersDown, 0)
  })

  it('Votes Down a comment', function(){
    const questionsParams = Factory.create('question.comments')
    var comment = questionsParams.comments[0]
    //Checking initial state
    assert.equal(comment.votes.result, 0)
    assert.lengthOf(comment.votes.votersUp, 0)
    assert.lengthOf(comment.votes.votersDown, 0)

    Meteor.call('comments.voteDown', questionsParams._id, comment)

    const newQuestion = Questions.findOne(questionsParams._id)
    comment = newQuestion.comments[0]
    //Checking new state
    assert.equal(comment.votes.result, -1)
    assert.lengthOf(comment.votes.votersUp, 0)
    assert.lengthOf(comment.votes.votersDown, 1)
  })

  it('Removes a votes up from a comment', function(){
    const authorId = faker.name.findName()
    const questionsParams = Factory.create('question.comments', {comments:[{
      authorId: authorId,
      authorName: faker.name.findName(),
      text: faker.lorem.sentence(),
      createdAt: new Date(),
      votes: {result:1,
        votersUp:[authorId],
        votersDown:[]
        }
    }]})
    var comment = questionsParams.comments[0]
    //Checking initial state
    assert.equal(comment.votes.result, 1)
    assert.lengthOf(comment.votes.votersUp, 1)
    assert.lengthOf(comment.votes.votersDown, 0)

    Meteor.call('comments.removeVoteUp', questionsParams._id, comment)

    const newQuestion = Questions.findOne(questionsParams._id)
    comment = newQuestion.comments[0]
    //Checking new state
    assert.equal(comment.votes.result, 0)
    assert.lengthOf(comment.votes.votersUp, 0)
    assert.lengthOf(comment.votes.votersDown, 0)
  })

  it('Removes a votes down from a comment', function(){
    const authorId = faker.name.findName()
    const questionsParams = Factory.create('question.comments', {comments:[{
      authorId: authorId,
      authorName: faker.name.findName(),
      text: faker.lorem.sentence(),
      createdAt: new Date(),
      votes: {result:-1,
        votersUp:[],
        votersDown:[authorId]
        }
    }]})
    console.log(questionsParams)
    var comment = questionsParams.comments[0]
    //Checking initial state
    assert.equal(comment.votes.result, -1)
    assert.lengthOf(comment.votes.votersUp, 0)
    assert.lengthOf(comment.votes.votersDown, 1)

    Meteor.call('comments.removeVoteDown', questionsParams._id, comment)

    const newQuestion = Questions.findOne(questionsParams._id)
    comment = newQuestion.comments[0]
    //Checking new state
    assert.equal(comment.votes.result, 0)
    assert.lengthOf(comment.votes.votersUp, 0)
    assert.lengthOf(comment.votes.votersDown, 0)
  })
})