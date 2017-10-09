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



const categories = [
  { label: 'Ciencia', value: 'ciencia' },
  { label: 'Vanilla', value: 'vanilla' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Caramel', value: 'caramel' },
  { label: 'Cookies and Cream', value: 'cookiescream' },
  { label: 'Peppermint', value: 'peppermint' },
];
// Task component - represents a single todo item
class Add extends Component {	

constructor(props) {
    super(props);
    this.state = {value:"",display:false, error:""}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

   handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const question = ReactDOM.findDOMNode(this.refs.question).value.trim();
    const description = ReactDOM.findDOMNode(this.refs.desc).value.trim();
    const categories = this.state.value.split(",");
    const options = this.props.options;
    if(options.length == 0){
      this.setState({display:true, error:"Debe haber al menos una opción"});
    }
    else{
    this.setState({display:false});
    Meteor.call("questions.insert", question, description, categories, options)
    ReactDOM.findDOMNode(this.refs.question).value = "";
    ReactDOM.findDOMNode(this.refs.desc).value = "";
    this.setState({value:""});
    this.props.options.map((option)=>{
      Options.remove({_id:option._id});
    })
    window.alert("Se ha creado una nueva pregunta");
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
        this.setState({display:false})
      Options.insert({
        name: name,
        count:0,
        countries:[]
      })
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
    return(
        <div className="container">
          <header>
            <h1>Ask Away!</h1>
            <form id="saveQuestion"></form>
            <div className = "new-question">
              <input
                type="text"
                ref="question"
                placeholder="What do you wanna ask?"
              />
              <input
                type="text"
                ref="desc"
                placeholder="Description"
              />
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
                <input required
                  type="text"
                  onKeyPress={this.handleOptions.bind(this)}
                  ref="option"
                  placeholder="Add new options to your question (press enter to submit each option)"
                />
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
              <input type="button" value="Submit" form="saveQuestion" onClick={this.handleSubmit.bind(this)} />
              </div>
          </header>          
        </div>
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