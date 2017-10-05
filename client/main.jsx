import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {mount, withOptions} from 'react-mounter';
import App from '../imports/ui/App.jsx';

const mount2 = withOptions({
	rootId: 'render-target',
}, mount);

FlowRouter.route("/",{
	action: function(params, queryParams) {
		mount2(App)
	}
})
FlowRouter.route('/blog/:postId', {
	action: function(params, queryParams) {
		console.log("Yeah! We are on the post:", params.postId);
	}
});