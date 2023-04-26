var timeslots = 0;

//Block of adding OnClick functionality
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
	$('#user-button').show();
	$('#login-button').hide();
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
	var json = [1,2,3];

	//ajax call to get json with appointments
	$.ajax({
		type: "GET",
		url: "../service_handler.php",
		cache: false,
		data: { method: "getAppointList", param: {
			limit: Date.now(),
		}},
		dataType: "json",
		success: function (response) {
			//dunno how to access data correctly
			//json = response;
		}
	});

	var i = 1;

	//goes through all elements in json and creates an new Appointment on the website
	json.forEach(element => {

		//Could be done nicer
		var newAppointment = document.createElement("div");
		var timeDiv = document.createElement("div");
		var titleDiv = document.createElement("div");
		var descDiv = document.createElement("div");

		//filling created divs with values
		//TODO: actual json Werte verwenden
		newAppointment.className = "appointment-entry";
		newAppointment.id = "appointment-nr-"+i;
		newAppointment.addEventListener("click", ()=>{openForm("appointment")});
		document.getElementById("appointment-list").appendChild(newAppointment);

		timeDiv.className = "appointment-time";
		titleDiv.className = "appointment-title";
		descDiv.className = "appointment-desc";
		descDiv.innerHTML = "aaaaaaaaaaa aaaaaaaaa aaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaa aaaaaaaaaaaaa aaa";
		titleDiv.innerHTML = "TITLE";
		timeDiv.innerHTML = "03.09.2023 <br> 18:30"

		//appending created divs to appointment entry
		document.getElementById("appointment-nr-"+i).appendChild(timeDiv);
		document.getElementById("appointment-nr-"+i).appendChild(titleDiv);
		document.getElementById("appointment-nr-"+i).appendChild(descDiv);

		i++;
	});
}

//creates list of all appointments
window.addEventListener('load', function () {
	generateAppointmentElements();
  })