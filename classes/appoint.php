<?php

class appoint
{

	public static function getList($limit = date("Y-m-d"))
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT DISTINCT id, user_id, title, descr, deadline FROM appointment JOIN timeslot ON appointment.id=timeslot.appoint_id WHERE DATE(end_time) >= ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("s", $limit);
		$stmt->execute()

		$result = $stmt->get_result();

		$array = array();
		while($row = $result->fetch_assoc()) {
			$array[] = $row;
		}

		$stmt->close();
		$conn->close();

		return $array;
	}

	public static function getAppoint($id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT * FROM appointment WHERE id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute()

		$result = $stmt->get_result()->fetch_assoc();
		$stmt->close();

		$result['timeslot'] = getTimeslots($id, true);
		$result['comments'] = getComments($id);

		$conn->close();

		return $result;
	}

	public static function getTimeslots($id, $votes = false)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT * FROM timeslot WHERE appoint_id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute()

		$result = $stmt->get_result();

		$array = array();
		while($row = $result->fetch_assoc()) {
			if ($votes) {
				$row['votes'] = getVotes($row['id']);
			}
			$array[] = $row;
		}

		$stmt->close();
		$conn->close();

		return $array;
	}

	public static function getVotes($id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT * FROM votes WHERE timeslot_id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute()

		$result = $stmt->get_result();

		$array = array();
		while($row = $result->fetch_assoc()) {
			$array[] = $row;
		}

		$stmt->close();
		$conn->close();

		return $array;
	}

	public static function getComments($id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT * FROM comment WHERE appoint_id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute()

		$result = $stmt->get_result()->fetch_assoc();
		$stmt->close();

		$conn->close();

		return $result;
	}
}