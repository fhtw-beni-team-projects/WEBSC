var timeslots = 0;

$("#sendLogin").click(login);
$("#sendSignup").click(signup);
$("#sendAppoint").click(newAppoint);
$("#login-button").click(()=>{openForm("login")});
$("#timeslot-prompt").click(newTimeslotField);

$("#closeLogin").click(closeForm);
$("#closeSignup").click(closeForm);
$("#sendLogin").click(login);
$("#sendSignup").click(signup);
$("#changeForm").click(()=>{openForm("signup")})

function openForm(form) {
	$('#' + form + ", .darkener").show();
}

function closeForm() {
	$(".popup, .darkener").hide();
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
	    }        
	});
}

function newTimeslotField() {
	timeslots++;

	var label = document.createElement("label");
	label.className = "descr formleft";
	label.for = "title";
	label.innerHTML = "Option&nbsp;" + timeslots + ":";

	var option = document.createElement("input");
	option.className = "popup_input formright forminput";
	option.type = "datetime-local";
	option.name = "option" + timeslots

	$("#appoint-inputs").append(label);
	$("#appoint-inputs").append(option);
}

function generateAppointmentElements() {
	var json = [];
	$.ajax({
		type: "GET",
		url: "../service_handler.php",
		cache: false,
		data: { method: "getAppointList", param: {
			limit: Date.now(),
		}}, // TODO: date
		dataType: "json",
		success: function (response) {
			json = response;
		}

	});
}

window.addEventListener('load', function () {
	generateAppointmentElements();
  })