import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {mount, withOptions} from 'react-mounter';
import App from '../imports/ui/App.jsx';
import Nav from "../imports/ui/Nav.jsx";

Meteor.startup(() => {
  render(<Nav />, document.getElementById("header-target"));
  render(<App />, document.getElementById("renderPage-target"));
});

const mount2 = withOptions({
	rootId: 'renderPage-target',
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