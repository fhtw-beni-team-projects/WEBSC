$.ajax({
    type: "GET",
    url: "../service_handler.php",
    cache: false,
    data: { method: "getAppointList", param: {
        limit: Date.now(),
    }}, // TODO: date
    dataType: "json",
    success: function (response) {
    }        
});

$.ajax({
    type: "GET",
    url: "../service_handler.php",
    cache: false,
    data: { method: "getFullAppoint", param: {
        id: 0
    }},
    dataType: "json",
    success: function (response) {
    }        
});

$.ajax({
    type: "GET",
    url: "../service_handler.php",
    cache: false,
    data: { method: "newAppoint", param: {
        timeslots: [
            {
                start: Date.now(),
                end: Date.now(),
            },
            {
                start: Date.now(),
                end: Date.now(),
            },
        ],
        title: "title",
        descr: "descr",
        deadline: Date.now(),
    }},
    dataType: "json",
    success: function (response) {
    }        
});

$.ajax({
    type: "GET",
    url: "../service_handler.php",
    cache: false,
    data: { method: "delAppoint", param: {
        id: 0
    }},
    dataType: "json",
    success: function (response) {
    }        
});

$.ajax({
    type: "GET",
    url: "../service_handler.php",
    cache: false,
    data: { method: "changeVotes", param: {
        votes: [
            {
                id: 0, // leave blank for new votes
                confirm: true,
            },
            {
                id: 1,
                confirm: false,
            },
        ],
        timeslot_id: 0,
    }},
    dataType: "json",
    success: function (response) {
    }        
});

$.ajax({
    type: "GET",
    url: "../service_handler.php",
    cache: false,
    data: { method: "getName", param: {
        id: 0
    }},
    dataType: "json",
    success: function (response) {
    }        
});

$.ajax({
    type: "GET",
    url: "../service_handler.php",
    cache: false,
    data: { method: "newComment", param: {
        content: "This is so funny lmao!",
        appoint_id: 0
    }},
    dataType: "json",
    success: function (response) {
    }        
});

$.ajax({
    type: "GET",
    url: "../service_handler.php",
    cache: false,
    data: { method: "login", param: {
        email: "hello@email.com",
        pwd: "password1234!",
    }},
    dataType: "json",
    success: function (response) {
    }        
});

$.ajax({
    type: "GET",
    url: "../service_handler.php",
    cache: false,
    data: { method: "logout", param: 0 },
    dataType: "json",
    success: function (response) {
    }        
});

$.ajax({
    type: "GET",
    url: "../service_handler.php",
    cache: false,
    data: { method: "signup", param: {
        email: "hello@email.com",
        pwd: "password1234!",
        fname: "Papst",
        lname: "Franciscus",
    }},
    dataType: "json",
    success: function (response) {
    }        
});