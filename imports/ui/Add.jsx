import React, { Component } from "react";
import { Questions } from "../api/questions.js";
import { Options } from "../api/options.js";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Question from "./Question.jsx";
import Option from "./Option.jsx";
import { createContainer } from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor"
import Select from 'react-select';
import "react-select/dist/react-select.css";
import Toggle from 'material-ui/Toggle';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


const categories = [
  { label: 'Academic', value: 'academic' },
  { label: 'Self improvement', value: 'self improvement' },
  { label: 'Social', value: 'social' },
  { label: 'Hobbies', value: 'hobbies' },
  { label: 'Other', value: 'other' },
];
// Task component - represents a single todo item
class Add extends Component {	

constructor(props) {
    super(props);
    this.state = {value:"",display:false, error:"", canAdd:false}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }
  onToggle(event, toggleVal){
    event.preventDefault();
    this.setState({
      canAdd:!this.state.canAdd
    });
  }
   handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const question = ReactDOM.findDOMNode(this.refs.question).value.trim();
    const description = ReactDOM.findDOMNode(this.refs.desc).value.trim();
    const categories = this.state.value.split(",");
    const options = this.props.options;
    const canAdd = this.state.canAdd;
    if(options.length == 0){
      this.setState({display:true, error:"Debe haber al menos una opción"});
    }
    else{
    this.setState({display:false});
    Meteor.call("questions.insert", question, description, categories, options, canAdd)
    ReactDOM.findDOMNode(this.refs.question).value = "";
    ReactDOM.findDOMNode(this.refs.desc).value = "";
    ReactDOM.findDOMNode(this.refs.option).value = "";
    this.setState({value:""});
    this.props.options.map((option)=>{
      Meteor.call("options.remove",option._id);
    })
    window.alert("A new question has been added");
    }
   
  }
  handleOptions(e) {
    if (e.key === 'Enter') {
      const name = ReactDOM.findDOMNode(this.refs.option).value.trim();
      var found = false;
      this.props.options.map((option)=>{
        if(option.name == name){
          found = true;
        }
      })
      if(!found){
        this.setState({display:false});
        Meteor.call("options.insert",name);
    }
    else{
      this.setState({display:true,error:"La opción ya está registrada"})
    }
      ReactDOM.findDOMNode(this.refs.option).value = "";
    }
  }
  handleChange(value) {
    console.log("Selected: " + JSON.stringify(value.split(",")));
    this.setState({ value });
  }
  renderOptions(){
    return this.props.options.map((option)=>(
        <Option key={option._id} option={option}/>
      ));
  }

  render() {
    const { value } = this.state;
    const label = this.state.canAdd ? "Yes they can" : "No they can´t";
    return(
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="container" id="add">
          <header>
            <h1 className="titleAsk">Ask Away!</h1>
            <form id="saveQuestion"></form>
            <div className = "new-question">
              <div className="form-group">
              <label htmlFor="saveQuestion">Question</label>
              <input
                type="text"
                ref="question"
                placeholder="What do you wanna ask?"
                className="form-control"
              />
              </div>
              <div className="form-group">
              <label htmlFor="desc">Description</label>
              <input
                type="text"
                ref="desc"
                placeholder="Add a description to your question"
                className="form-control"
              />
              </div>
              <label>
                Pick the categories that matches your question:
                <Select
                  multi
                  closeOnSelect={false}
                  onChange={this.handleChange}
                  options={categories}
                  placeholder="Select your categories"
                  simpleValue
                  value={value}
                />
              </label>
              <div className="form-group">
                  <label htmlFor="options">Answer options for you question</label>
                <input required
                  type="text"
                  onKeyPress={this.handleOptions.bind(this)}
                  ref="option"
                  placeholder="Press enter to submit each option"
                  className="form-control"
                />
                </div>
                { this.state.display &&
                  <div className="error">
                    {this.state.error}
                </div>
                }
              <div className="row">
                <ul>
                  {this.renderOptions()}
                </ul>
              </div>
              <div className="form-group">
                  <label tmlFor="canAdd">Can users add their own options?</label>
                  <Toggle onToggle={this.onToggle} toggled={this.state.canAdd} label={label} labelPosition="left"/>

                </div>

              <button type="button" className="btn btn-default submit" value="Submit" form="saveQuestion" onClick={this.handleSubmit.bind(this)}><i className="fa fa-paper-plane" aria-hidden="true"></i>Ask it!</button>
              </div>
          </header>          
        </div>
      </MuiThemeProvider>
    );
  }
}

Add.propTypes = {
  questions: PropTypes.array.isRequired,
  options:PropTypes.array
};
export default createContainer(() => {
    Meteor.subscribe('questions');
    Meteor.subscribe("options");

  return {
    questions: Questions.find({}, { sort: { publishedAt: -1 }}).fetch(),
    currentUser:Meteor.user(),
    options:Options.find({}).fetch()
  };
}, Add);

