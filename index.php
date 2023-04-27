<?php
require 'class.php';
session_start();
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Not doodle</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
	<script src="https://kit.fontawesome.com/cd39ba936d.js" crossorigin="anonymous"></script>
	<script defer src="./common.js"></script>
	<link rel="stylesheet" href="base.css">
</head>
<body>
	<div class="darkener" id="darkener" onclick="closeForm()"></div>
	<nav class="navMenu">
    	<a id="home-button">Home</a>
      	<a id="about-button">About</a>
	  	<a id="login-button">Login</a>
	  	<a id="user-button"></a>
	  	<a id="logout-button"><i class="fa fa-sign-out" aria-hidden="true"></i>
</a>
      	<div class="dot"></div>
    </nav>

	<div id="appointment-list"></div>

	<?php include "./i/login.html" ?>
	<?php include "./i/appoint.html" ?>
</body>
</html>