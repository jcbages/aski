import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '../imports/ui/App.jsx';
import Nav from "../imports/ui/Nav.jsx";

Meteor.startup(() => {
  render(<Nav />, document.getElementById("header-target"));
  Meteor.subscribe("users")
  Meteor.subscribe("Meteor.users.country");
});
