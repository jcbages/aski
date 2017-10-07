import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {mount, withOptions} from 'react-mounter';
import App from '../imports/ui/App.jsx';
import Add from "../imports/ui/Add.jsx"

const mount2 = withOptions({
	rootId: 'render-target',
}, mount);

FlowRouter.route("/",{
	action: function(params, queryParams) {
		mount2(App)
	}
})
FlowRouter.route("/Browse",{
	action: function(params, queryParams) {
		console.log("Yeah! We are on the post:"	);
	}
})
FlowRouter.route("/add",{
	action: function(params, queryParams) {
		mount(Add)
	}
})