<?php
require 'class.php';
session_start();
?>

<!DOCTYPE html>
<html>
<head>
	<!-- Test pls work ;-; -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Not doodle</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
	<script defer src="./common.js"></script>
	<link rel="stylesheet" href="base.css">
</head>
<body>
<nav class="navMenu">
      <a id="home-button">Home</a>
      <a id="about-button">About</a>
	  <a id="login-button">Login</a>
	  <a id="user-button"></a>
      <div class="dot"></div>
    </nav>

	<?php include "./i/login.html" ?>
</body>
</html>