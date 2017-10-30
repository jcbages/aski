import {mount, withOptions} from 'react-mounter';
import App from '../../imports/ui/App.jsx';
import QuestionList from "../../imports/ui/questions/QuestionList"
import MyQuestionsList from "../../imports/ui/questions/MyQuestionsList"
import Add from "../../imports/ui/Add.jsx"
import Question from "../../imports/ui/Question.jsx"
import ProfilePage from "../../imports/ui/users/UserPageContainer"

const mount2 = withOptions({
	rootId: 'renderPage-target',
}, mount);

FlowRouter.route("/",{
	action: function(params, queryParams) {
		mount(App)
	}
})

FlowRouter.route("/add",{
	action: function(params, queryParams) {
		mount(Add)
	}
})

FlowRouter.route("/questions", {
	action: function(params, queryParams) {
		mount(QuestionList, {query:queryParams.query})
	}
});
FlowRouter.route("/question/:id", {
	action: function(params, queryParams) {
		mount(Question, {id:params.id})
	}
});
FlowRouter.route("/myQuestions", {
	action: function(params, queryParams) {
		mount(MyQuestionsList, {idUser:queryParams.idUser}) 
	}
});
FlowRouter.route("/user/:id", {
	action: function(params, queryParams) {
		mount(ProfilePage, {id:params.id}) 
	}
});
