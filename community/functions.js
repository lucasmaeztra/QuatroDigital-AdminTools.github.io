var Common = {
	init: function() {
		Common.profileUrl(function() {
			Common.userInfo();
			Common.userQuestions();
			Common.userAnswers();
		});
	},
	userId: 0,
	profileUrl: function(callback) {
		$(".profile-url-form").submit(function(e) {
			e.preventDefault();

			Common.userId = ($(this).find("#profile-url").val().match(/users\/([0-9]+)/i) || [0]).pop();

			callback();
		});
	},
	userInfo: function() {
		$.ajax({
			url: 'http://lab.vtex.com/community/services/v1/user/' + Common.userId + '/info.json',
			dataType:'jsonp',
			success: function(data) {
				$(".data_user-name").text(data.result.user.realname);
				$(".data_user-username").text(data.result.user.username);
				$(".data_user-avatar").attr("src", data.result.user.avatar);

				$('.user-welcome').removeClass('hide');
			},
			error: function() {alert("Ooopps, houve um erro :(");}
		});
	},
	userQuestions: function() {
		var elem = $(".data_user-questions");
		elem.html("Carregando ...");

		$.ajax({
			url: 'http://lab.vtex.com/community/services/v1/user/' + Common.userId + '/questions.json?pageSize=100',
			dataType:'jsonp',
			success: function(data) {
				var wrapper = $('<ul></ul>').appendTo(elem.empty());

				for(var i in data.result.questions)
					wrapper.append('<li><a href="http://lab.vtex.com/community/questions/' + data.result.questions[i].id + '/' + data.result.questions[i].plug + '.html" target="_blank">' + data.result.questions[i].title + '</a></li>');
			},
			error: function() {alert("Ooopps, houve um erro :(");}
		});
	},
	userAnswers: function() {
		var page = 1;
		var elem = $(".data_user-answers");
		elem.html("Carregando ...");

		var getData = function() {
			$.ajax({
				url: 'http://lab.vtex.com/community/services/v1/user/' + Common.userId + '/answers.json?pageSize=20&page=' + page,
				dataType:'jsonp',
				success: function(data) {
					if(page == 1)
						elem.empty();

					var wrapper = $('<ul></ul>').appendTo(elem);

					for(var i in data.result.answers)
						getQuestions(data.result.answers[i], wrapper);
				},
				error: function() {alert("Ooopps, houve um erro :(");}
			});
		}
		getData();

		var getQuestions = function(answer, wrapper) {
			$.ajax({
				url: 'http://lab.vtex.com/community/services/v1/question/' + answer.parentId + '.json',
				dataType:'jsonp',
				success: function(data) {
					wrapper.append('<li><a href="http://lab.vtex.com/community/answers/' + answer.id + '/view.html" target="_blank">' + data.result.title + '</a> <i>' + answer.body.substring(0, 75) + ' ...</i> (' + answer.creationDateFormatted + ')</li>');
				},
				error: function() {alert("Ooopps, houve um erro :(");}
			});
		};

		$(".user-answers-next-page").click(function() {
			page = page + 1;
			getData();
			return false;
		});
	}
};

var TeamHub = {RequestCallback: function(fName, data) {window[fName].call(this, data); }};

$(function() { Common.init(); });