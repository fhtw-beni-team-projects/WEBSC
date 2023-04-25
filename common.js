$("#sendLogin").on("click", login);
$("#sendSignup").on("click", signup);

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
}