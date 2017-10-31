import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Meteor } from 'meteor/meteor';
import { Questions } from "./questions.js";
import { Collections } from './collections.js';
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

Factory.define('collection', Collections, {
	name:()=>faker.lorem.word(),
	owner:()=>faker.name.findName(),
	createdAt:()=>new Date(),
	questions:()=>[],
})

describe('collections api', function () {
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

	it("Inserts correctly a new collection", function(){

		const newCol = Factory.build('collection')

		Meteor.call('collections.insert', newCol.name)

		const insertedCollection = Collections.findOne({name:newCol.name})

		assert.equal(insertedCollection.owner, currentId)
		assert.lengthOf(insertedCollection.questions, 0)
	})
})