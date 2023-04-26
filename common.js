var timeslots = 0;

$("#sendLogin").click(login);
$("#sendSignup").click(signup);
$("#sendAppoint").click(newAppoint);
$("#login-button").click(()=>{openForm("login")});

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
	$.each($('#signup').serializeArray(), function() {
		if (this.name.startsWith("start")) {
			timeslots.push({
				start: this.value,
			});
		} else if (this.name.startsWith("end")) {
			timeslots[this.name.splice(3)] = {
				end: this.value,
			};
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

	var start = document.createElement("input");
	start.className = "popup_input formleft forminput";
	start.type = "datetime-local";
	start.name = "start" + timeslots

	var end = document.createElement("input");
	end.className = "popup_input formright forminput";
	end.type = "datetime-local";
	end.name = "start" + timeslots

	$("#appoint-timeslots").append(start);
	$("#appoint-timeslots").append(end);
}