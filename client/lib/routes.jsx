import {mount, withOptions} from 'react-mounter';
import App from '../../imports/ui/App.jsx';
import QuestionList from "../../imports/ui/questions/QuestionList"

const mount2 = withOptions({
	rootId: 'renderPage-target',
}, mount);

FlowRouter.route("/",{
	action: function(params, queryParams) {
		console.log("We are on the main page")
		mount2(App)
	}
})

FlowRouter.route("/questions", {
	action: function(params, queryParams) {
		console.log("Yeah! We are on the question list");
		const exampleQuestion = {question:"Where should I go to a date?",
							publishedAt:"2017/10/07 2:10 PM",
							description:"It's my first date and I want to know where to go",
							ownerName:"JavierTrc" };
		const questions = [exampleQuestion,
							exampleQuestion,
							exampleQuestion,
							exampleQuestion,
							exampleQuestion,
							exampleQuestion,
							exampleQuestion,
							exampleQuestion,
							exampleQuestion,
							exampleQuestion]
		mount2(QuestionList, {questions:questions})
	}
});