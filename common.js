var timeslots = 0;

//Block of adding OnClick functionality
$("#sendLogin").click(login);
$("#sendSignup").click(signup);
$("#sendAppoint").click(newAppoint);
$("#login-button").click(()=>{openForm("login")});
$("#timeslot-prompt").click(newTimeslotField);

$("#closeLogin").click(closeForm);
$("#closeSignup").click(closeForm);
$("#closeAppoint").click(closeForm);
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
	closeForm();
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

		timeDiv.className = "appointment-time";
		titleDiv.className = "appointment-title";
		descDiv.className = "appointment-desc";
		descDiv.innerHTML = element['descr'];
		titleDiv.innerHTML = element['title'];
		timeDiv.innerHTML = "Open until:<br>" + element['deadline'];

		//appending created divs to appointment entry
		newAppointment.appendChild(timeDiv);
		newAppointment.appendChild(titleDiv);
		newAppointment.appendChild(descDiv);

		document.getElementById("appointment-list").appendChild(newAppointment);

		i++;
	});
}

//creates list of all appointments
window.addEventListener('load', function () {
	getAppointmentElements();
  })