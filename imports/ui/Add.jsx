import React, { Component } from "react";
import { Questions } from "../api/questions.js";
import { Options } from "../api/options.js";
import { Collections } from "../api/collections.js";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Question from "./Question.jsx";
import Option from "./Option.jsx";
import { createContainer } from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor"
import Select, {Creatable} from 'react-select';
import "react-select/dist/react-select.css";
import Toggle from 'material-ui/Toggle';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import SweetAlert from "react-bootstrap-sweetalert";

import { Tracker } from 'meteor/tracker'
import { compose } from 'react-komposer';


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
    this.state = {value:"", collections:[],display:false, error:"", canAdd:false, open:false, alert:null}
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCollection = this.handleChangeCollection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    console.log(this.props)
    this.collections = this.props.collections.map(function(d){
      return {label:d.name, value:d._id}
    });
  }
  onToggle(event, toggleVal){
    event.preventDefault();
    this.setState({
      canAdd:!this.state.canAdd
    });
  }
     showSuccess(ev){
        this.setState({alert: this.getSuccess()});
    }
    getSuccess(){
      return(
          <SweetAlert success title="Good job!" timer= {1000} showConfirmButton={false} onConfirm={null}>
            Your question has been submited!
          </SweetAlert>
        )
    }
    componentWillUpdate(){
      console.log(this.props)
    this.collections = this.state.collections.map(function(d){
      return {label:d.name, value:d._id}
    });
    }
   handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const question = ReactDOM.findDOMNode(this.refs.question).value.trim();
    const description = ReactDOM.findDOMNode(this.refs.desc).value.trim();
    const categories = this.state.value.split(",");
    const collections = this.state.collections.map(function(d){
      return {name:d.label, id:d.value}
    })
    const options = this.props.options;
    const canAdd = this.state.canAdd;
    if(options.length == 0){
      this.setState({display:true, error:"Debe haber al menos una opción"});
    }
    else{
      this.setState({display:false});
      Meteor.call("questions.insert", question, description, categories, options, canAdd,(err, result)=>{
        console.log(result);
        ReactDOM.findDOMNode(this.refs.question).value = "";
        ReactDOM.findDOMNode(this.refs.desc).value = "";
        ReactDOM.findDOMNode(this.refs.option).value = "";
        this.setState({value:"", open:true});
        if(!err)
        this.showSuccess();
        this.props.options.map((option)=>{
          Meteor.call("options.remove",option._id);
        })
        setTimeout(()=>{
          FlowRouter.go("/question/"+result);
        }, 2000); 
      })
    }

   
  }
 

  handleRequestClose() {
    this.setState({
      open: false,
    });
  };
  handleOptions(e) {
    if (e.key === 'Enter' || e.key == null) {
      const name = ReactDOM.findDOMNode(this.refs.option).value.trim();
      var found = false;
      this.props.options.map((option)=>{
        if(option.name == name){
          found = true;
        }
      })
      if(!found && name.trim() != ""){
        this.setState({display:false});
        Meteor.call("options.insert",name);
    }
    else if (name.trim() == ""){
      this.setState({display:true,error:"La opción no puede estar vacía"})
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
  handleChangeCollection(value){
    console.log(value)
    this.setState({collections:value})
  }
  renderOptions(){
    return this.props.options.map((option)=>(
        <Option key={option._id} option={option}/>
      ));
  }

  render() {
    const { value } = this.state;
    const label = this.state.canAdd ? "Yes they can" : "No they can´t";
    var divStyle = {
  color: '#555',
  width: '30%',
};

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
                  <label htmlFor="options">Posible answers for your question</label>
                  <div className="form-group">
                    <div className= "row">
                      <div className="col-md-8">
                        <input required
                          type="text"
                          onKeyPress={this.handleOptions.bind(this)}
                          ref="option"
                          placeholder="Press enter to submit each option"
                          className="form-control"
                        />
                      </div>
                    <div className="col-md-4">
                      <RaisedButton onClick={this.handleOptions.bind(this)}>Add Option</RaisedButton> 
                    </div>
                  </div>
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
                  <label htmlFor="canAdd">Can users add their own options?</label>
                  <Toggle labelStyle={divStyle} onToggle={this.onToggle} toggled={this.state.canAdd} label={label} labelPosition="left"/>

                </div>
                <label>
                  Do you want to add this question to a collection?(Optional)
                  <Creatable
                    multi
                    closeOnSelect={false}
                    onChange={this.handleChangeCollection}
                    options={this.state.collections}
                    placeholder="Select the collections"
                    value={this.state.collections}
                    shouldKeyDownEventCreateNewOption={({keyCode})=>{return keyCode===13}}
                    promptTextCreator={(label)=>{return("Create collection " + label + " (press enter)")}}
                  />
                </label>

              <button type="button" className="btn btn-default submit" value="Submit" form="saveQuestion" onClick={this.handleSubmit.bind(this)}><i className="fa fa-paper-plane" aria-hidden="true"></i>Ask it!</button>
              </div>
          </header>          
        </div>
        {this.state.alert}
      </MuiThemeProvider>
    );
  }
}

function getTrackerLoader(reactiveMapper) {
  return (props, onData, env) => {
    let trackerCleanup = null;
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        // assign the custom clean-up function.
        trackerCleanup = reactiveMapper(props, onData, env);
      });
    });

    return () => {
      if(typeof trackerCleanup === 'function') trackerCleanup();
      return handler.stop();
    };
  };
}

// function reactiveMapper(props, onData) {
//   const subscription = Meteor.subscribe('collections.user', Meteor.userId());
//   Meteor.subscribe('questions');
//   Meteor.subscribe("options");

//   if (subscription.ready()) {
//     const data = {
//       ready: true,
//       collections: Collections.find({}).fetch(),
//       questions: Questions.find({}, { sort: { publishedAt: -1 }}).fetch(),
//       currentUser:Meteor.user(),
//       options:Options.find({}).fetch(),
//     }
//     onData(null, data);
//   } else {
//     onData(null, {ready: false, questions: [], options:[], collections:[]});
//   }
// }

// Add.propTypes = {
//   questions: PropTypes.array.isRequired,
//   options:PropTypes.array
// };
// export default compose(getTrackerLoader(reactiveMapper))(Add);
export default createContainer(() => {
    Meteor.subscribe('questions');
    Meteor.subscribe("options");
    const handle = Meteor.subscribe('collections.user',Meteor.userId())
    collections = Collections.find({}).fetch()

  return {
    ready: handle.ready(),
    questions: Questions.find({}, { sort: { publishedAt: -1 }}).fetch(),
    currentUser:Meteor.user(),
    options:Options.find({}).fetch(),
    collections:collections,
  };
}, Add);
