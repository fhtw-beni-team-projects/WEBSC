var timeslots = 0;
var listLength = 0;

//Block of adding OnClick functionality
$("#sendLogin").click(login);
$("#sendLogout").click(logout);
$("#sendSignup").click(signup);
$("#sendAppoint").click(newAppoint);
$("#login-button").click(()=>{openForm("login")});
$("#logout-button").click(()=>{openForm("logout")});
$("#timeslot-prompt").click(newTimeslotField);
$("#new-button").click(()=>{openForm("new-appoint")});
$("#closeAppoint").click(closeForm);
$("#closeLogin").click(closeForm);
$("#closeSignin").click(closeForm);
$("#closeLogout").click(closeForm);
$(".close").click(closeForm);
$("#loginChangeForm").click(()=>{changeForm("signup")});
$("#signinChangeForm").click(()=>{changeForm("login")});

function openForm(form) {
	$('#' + form + ", .darkener").show();
}

function changeForm(form) {
	closeForm();
	openForm(form);
}

function closeForm() {
	$(".popup, .darkener").hide();
	$("#appoint-popup").remove();
	document.querySelectorAll('.timeslot').forEach(e => e.remove());
	timeslots = 0;
}

function isLoggedIn() {
	$.ajax({
		type: "GET",
		url: "../service_handler.php",
		cache: false,
		data: { method: "isLoggedIn", param: 0 },
		dataType: "json",
		success: function (response) {
			if (response) {
				$('#user-button').html(response);
				$('#user-button').show();
				$('#login-button').hide();
				$('#logout-button').show();
			}
		}
	});
}   	

function login() {
	var form_data = { };
	$.each($('#login').serializeArray(), function() {
		form_data[this.name] = this.value;
	});

	$.ajax({
		type: "GET",
		url: "../service_handler.php",
		cache: false,
		data: { method: "login", param: form_data },
		dataType: "json",
		success: function (response) {
			$('#user-button').html(response);
			$('#user-button').show();
			$('#login-button').hide();
			$('#logout-button').show();
		}	   
	});
	closeForm();
}

function logout() {
	var form_data = { };

	$.ajax({
		type: "GET",
		url: "../service_handler.php",
		cache: false,
		data: { method: "logout", param: 0 },
		dataType: "json",
		success: function (response) {
			$('#user-button').hide();
			$('#login-button').show();
			$('#logout-button').hide();
		}	   
	});
	closeForm();
}

function signup() {
	var form_data = { };
	$.each($('#signup').serializeArray(), function() {
		form_data[this.name] = this.value;
	});

	$.ajax({
		type: "GET",
		url: "../service_handler.php",
		cache: false,
		data: { method: "signup", param: form_data },
		dataType: "json",
		success: function (response) {
			$('#user-button').html(response);
			$('#user-button').show();
			$('#login-button').hide();
			$('#logout-button').show();
		}		
	});
	closeForm();
}

function newAppoint() {
	var form_data = { };
	var timeslots = [ ];
	$.each($('#new-appoint').serializeArray(), function() {
		if (this.name.startsWith("option")) {
			timeslots.push(this.value);
		} else {
			form_data[this.name] = this.value;
		}
	});

	form_data['timeslots'] = timeslots;

	$.ajax({
		type: "GET",
		url: "../service_handler.php",
		cache: false,
		data: { method: "newAppoint", param: form_data },
		dataType: "json",
		success: function (response) {
			timeslots = 0;
			appointListPrepend(form_data);
		}		
	});
	closeForm();
}

function newTimeslotField() {
	timeslots++;

	var label = document.createElement("label");
	label.className = "descr formleft timeslot";
	label.for = "title";
	label.innerHTML = "Option&nbsp;" + timeslots + ":";

	var option = document.createElement("input");
	option.className = "popup_input formright forminput timeslot";
	option.type = "datetime-local";
	option.name = "option" + timeslots;

	$("#appoint-inputs").append(label);
	$("#appoint-inputs").append(option);
}

function getAppointmentElements() {

	//ajax call to get json with appointments
	$.ajax({
		type: "GET",
		url: "../service_handler.php",
		cache: false,
		data: { method: "getAppointList", param: {
		}},
		dataType: "json",
		success: function (response) {
			generateAppointmentElements(response)
		}
	});
}

function generateAppointmentElements(json) {
	//goes through all elements in json and creates an new Appointment on the website
	json.forEach(element => {
		appointListPrepend(element);
	});
}

function appointListPrepend(element) {
	listLength++;

	//Could be done nicer
	var newAppointment = document.createElement("div");
	var timeDiv = document.createElement("div");
	var titleDiv = document.createElement("div");
	var descDiv = document.createElement("div");
	var votecountDiv = document.createElement("div");

	//filling created divs with values
	newAppointment.className = "appointment-entry";
	newAppointment.id = "appointment-nr-" + listLength;
	newAppointment.addEventListener("click", ()=>{loadFullAppoint(element['id'])});

	timeDiv.className = "appointment-time";
	titleDiv.className = "appointment-title";
	descDiv.className = "appointment-desc";
	votecountDiv.className = "appointment-votecount";
	descDiv.innerHTML = element['descr'];
	titleDiv.innerHTML = element['title'];
	timeDiv.innerHTML = "Open&nbsp;until:<br>" + element['deadline'];
	votecountDiv.innerHTML = element['votecount'] + "&nbsp;votes"


	//appending created divs to appointment entry
	newAppointment.appendChild(timeDiv);
	newAppointment.appendChild(titleDiv);
	newAppointment.appendChild(descDiv);
	newAppointment.appendChild(votecountDiv);

	$('#appointment-list').prepend(newAppointment);
}

function deleteAppoint(id) {
	$.ajax({
    	type: "GET",
    	url: "../service_handler.php",
    	cache: false,
    	data: { method: "delAppoint", param: {
    	    id: id,
    	}},
    	dataType: "json",
    	success: function (response) {
        	$('#appointment-nr-' + id).remove();
        	closeForm();
    	}        
	});
}

function loadFullAppoint(id) {

	$.ajax({
		type: "GET",
		url: "../service_handler.php",
		cache: false,
		data: { method: "getFullAppoint", param: {
			id: id
		}},
		dataType: "json",
		success: function (response) {
			var vote_count = response['votecount'];


			var popup = document.createElement("form");
			popup.id = "appoint-popup";
			popup.className = "popup";

			var grid = document.createElement("div");
			grid.className = "formcontent grid";
			var h = document.createElement("h3");
			h.innerHTML = response['title'];
			h.className = "formtext formfull";
			grid.append(h);
			var p1 = document.createElement("p");
			p1.innerHTML = response['descr'];
			p1.className = "formtext formfull";
			grid.append(p1);
			var p2 = document.createElement("p");
			p2.innerHTML = response['duration'] + "&nbsp;Minutes";
			p2.className = "formtext formfull";
			grid.append(p2);
			var p3 = document.createElement("p");
			p3.innerHTML = "Voting&nbsp;closes&nbsp;on&nbsp;" + response['deadline'];
			p3.className = "formtext formfull";
			grid.append(p3);

			var time_grid = document.createElement("div");
			time_grid.className = "formcontent grid";

			var p4 = document.createElement("p");
			p4.innerHTML = "Votes";
			p4.className = "formtext formleft";
			var p5 = document.createElement("p");
			p5.innerHTML = "Select&nbsp;your&nbsp;available&nbsp;timeslots";
			p5.className = "formtext formright";
			var p6 = document.createElement("p");
			p6.className = "formtext formrightright";
			time_grid.append(p4);
			time_grid.append(p5);
			time_grid.append(p6);

			$.each(response['timeslot'], function() {
				if (this.start_time == null)
					return;
				var votes = document.createElement("div")
				votes.className = "descr formleft";
				votes.innerHTML = this.votecount + "/" + vote_count;
				var time = document.createElement("label");
				time.className = "descr formright";
				time.for = "time" + this.id;
				time.innerHTML = this.start_time;
				var check = document.createElement("input");
				check.className = "popup_input formrightright forminput";
				check.type = "checkbox";
				check.name = "time" + this.id;
				check.value = this.id;

				time_grid.append(votes);
				time_grid.append(time);
				time_grid.append(check);
			});

			var hidden = document.createElement("input");
			hidden.type = "hidden";
			hidden.name = "appoint_id";
			hidden.value = response['id'];
			time_grid.append(hidden);

			var btn_grid = document.createElement("div");
			response['owner'] ? btn_grid.className = "formcontent grid triqual" : btn_grid.className = "formcontent grid equal";

			var close_btn = document.createElement("button");
			close_btn.type = "button";
			close_btn.className = "btn formleft";
			close_btn.id = "close";
			close_btn.innerHTML = '<i class="fa-solid fa-square-xmark"></i>&nbsp;Cancel';
			close_btn.addEventListener("click", closeForm);

			var vote_btn = document.createElement("button");
			vote_btn.type = "button";
			vote_btn.className = "btn formright";
			vote_btn.id = "sendVotes";
			vote_btn.innerHTML = '<i class="fa-solid fa-check-to-slot"></i>&nbsp;Vote';
			vote_btn.addEventListener("click", changeVotes);

			btn_grid.append(close_btn);
			btn_grid.append(vote_btn);

			if (response['owner']) {
				var del_btn = document.createElement("button");
				del_btn.type = "button";
				del_btn.className = "btn formrightright red";
				del_btn.id = "del-app";
				del_btn.innerHTML = '<i class="fa-solid fa-trash"></i>&nbsp;Delete';
				btn_grid.append(del_btn);
			}

			var comment_grid = document.createElement("div");
			comment_grid.id = "comment_grid";
	  		comment_grid.className = "formcontent grid equal";
	  
			var text_area = document.createElement("textarea");
			text_area.className = "formfull"
			text_area.id = "new-comment-text"

			var btn_comment = document.createElement("button");
			btn_comment.type = "button";
			btn_comment.className = "btn formfull";
			btn_comment.id = "new-comment-btn";
			btn_comment.innerHTML = "Send&nbsp;comment";

			comment_grid.append(text_area);
			comment_grid.append(btn_comment);

			$.each(response['comment'], function() {
				var comment = document.createElement("div");
				comment.className = "comment formfull";

				var comment_info = document.createElement("div");
				comment_info.className = "info"
				comment_info.innerHTML = "Writen&nbsp;by " + this.fname + "&nbsp;" + this.lname + " on&nbsp;" + this.timestamp;

				var comment_main = document.createElement("p");
				comment_main.innerHTML = this.content;

				comment.append(comment_info);
				comment.append(comment_main);
				comment_grid.append(comment);
			});

			popup.append(grid);
			popup.append(time_grid);
			popup.append(btn_grid);
			popup.append(comment_grid);

			document.body.append(popup);
			$('#new-comment-btn').click(()=>{addComment(response['id'])});
			if (response['owner'])
				$('#del-app').click(()=>{deleteAppoint(response['id'])});
	   		openForm("appoint-popup");
		}
	});
}

function changeVotes() {
	var form_data = {
		appoint_id: null,
		timeslots: [],
	};
	$.each($('#appoint-popup').serializeArray(), function() {
		if (this.name == "appoint_id") {
			form_data['appoint_id'] = this.value;
			return;
		}
		form_data['timeslots'].push(this.value);
	});

	$.ajax({
		type: "GET",
		url: "../service_handler.php",
		cache: false,
		data: { method: "changeVotes", param: form_data },
		dataType: "json",
		success: function (response) {
		}		
	});
	closeForm();
}

function addComment(id) {
	$.ajax({
		type: "GET",
		url: "../service_handler.php",
		cache: false,
		data: { method: "newComment", param: {
			content: $('#new-comment-text').val(),
			appoint_id: id
		}},
		dataType: "json",
		success: function (response) {
			var comment = document.createElement("div");
			comment.className = "comment formfull";

			var comment_info = document.createElement("div");
			comment_info.className = "info"
			comment_info.innerHTML = "Writen&nbsp;by " + response['fname'] + "&nbsp;" + response['lname'] + " on&nbsp;" + response['timestamp'];

			var comment_main = document.createElement("p");
			comment_main.innerHTML = response['content'];

			comment.append(comment_info);
			comment.append(comment_main);
			$('#comment_grid').append(comment);
		}		
	});
}

//creates list of all appointments
window.addEventListener('load', function () {
	isLoggedIn();
	getAppointmentElements();
  })