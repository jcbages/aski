import { Factory } from 'meteor/dburles:factory';
import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { Options } from "./options.js"
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
    arr.push({countryCode:faker.lorem.word(),countryName:faker.lorem.sentence(),count:faker.random.number()});
  }
  return arr;
}
Factory.define('option', Options, {
  name: () => faker.lorem.sentence(),
  count: () => faker.random.number(),
  categories: () => createCategories(),
});

describe('option api', function () {
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

  it('Inserts an option', function () {
    // This code will be executed by the test driver when the app is started
    // in the correct mode
    const questionsParams = Factory.create("option");
    Meteor.call('options.insert', questionsParams.name);
    const option = Options.findOne({name:questionsParams.name});
    assert.equal(option.categories[0].countryCode, questionsParams.categories[0].countryCode);
  })
  it('Removes an option', function () {
    // This code will be executed by the test driver when the app is started
    // in the correct mode
    const questionsParams = Factory.create("option");
    Meteor.call('options.insert', questionsParams.name);
    const option = Options.findOne({name:questionsParams.name});
    let numOptions = Options.find({}).fetch().length;
    console.log(numOptions);
    Meteor.call("options.remove",option._id);
    assert.isUndefined(Options.findOne({_id:option._id}),"no option defined");
    assert.equal(Options.find({}).fetch().length,numOptions-1);
  })
})