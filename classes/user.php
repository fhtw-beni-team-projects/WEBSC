<?php

class user
{
	public $user;

	public function login($email, $pwd)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		$sql = "SELECT * FROM users WHERE email = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("s", $email);
		$stmt->execute();

		$user = $stmt->get_result()->fetch_assoc();

		$stmt->close();

		if ($user && password_verify($pwd, $user['pwd_hash'])) {
			$_SESSION['user_id'] = $user['id'];
			$success = true;
		} else {
			$success = false;
		}

		$conn->close();

		return $success;
	}

	public function signup($email, $pwd, $fname, $lname)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !strlen($pwd)) {
			return false;
		}

		$sql = "SELECT * FROM users WHERE email = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("s", $email);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($result->num_rows > 0) {
			return false;
		}

		$pwd_hash = password_hash($pwd, PASSWORD_BCRYPT);
	
		$sql = "INSERT INTO users (email, pwd_hash, fname, lname) VALUES (?, ?, ?, ?)";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("ssss", $email, $pwd_hash, $fname, $lname);
	
		$success = $stmt->execute();

		if ($success) {
			$sql = "SELECT * FROM users WHERE email = ?";
			$stmt2 = $conn->prepare($sql);
			$stmt2->bind_param("s", $email);
			$stmt2->execute();
			$user = $stmt2->get_result()->fetch_assoc();
	
			$_SESSION['user_id'] = $user['id'];
		}

		$stmt->close();
		$conn->close();

		return $success;
	}

	public static function getName($id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT * FROM user WHERE id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute()

		$result = $stmt->get_result()->fetch_assoc();

		$stmt->close();
		$conn->close();

		return $result['fname'] + ' ' + $result['lname'];
	}
}