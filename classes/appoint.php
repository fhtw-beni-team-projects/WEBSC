<?php

class appoint
{

	public static function getList($limit = NULL)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT * FROM appointment";
		//$sql = "SELECT DISTINCT id, user_id, title, descr, deadline FROM appointment JOIN timeslot ON appointment.id=timeslot.appoint_id WHERE DATE(end_time) >= ?";
		$stmt = $conn->prepare($sql);
		//$stmt->bind_param("s", $limit);
		$stmt->execute();

		$result = $stmt->get_result();

		$array = array();
		while($row = $result->fetch_assoc()) {
			$array[] = $row;
		}

		$stmt->close();
		$conn->close();

		return $array;
	}

	public static function newAppoint($timeslots, $title, $descr, $duration, $deadline, $user_id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "INSERT INTO appointment (user_id, title, descr, duration, deadline) VALUES (?, ?, ?, ?, ?)";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("issis", $user_id, $title, $descr, $duration, $deadline);
	
		$success = $stmt->execute();
		$id = $stmt->insert_id;
		$stmt->close();

		if (!$success)
			return false;

		$unsuccess = !$success;

		foreach ($timeslots as $timeslot) {
			$unsuccess += !(self::newTimeslot($timeslot, $id));
		}

		$unsuccess += !(self::newTimeslot(NULL, $id));

		return (bool) !$unsuccess;
	}

	public static function delAppoint($id, $user_id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "DELETE FROM appointment WHERE id = ? AND user_id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("ii", $id, $user_id);
	
		$success = $stmt->execute();

		return $success;
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
		$stmt->execute();

		$result = $stmt->get_result()->fetch_assoc();
		$stmt->close();

		$result['timeslot'] = $this->getTimeslots($id, true);
		$result['comments'] = $this->getComments($id);

		$conn->close();

		return $result;
	}

	public static function appointOpen($id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT deadline FROM appointment WHERE id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute();

		$result = $stmt->get_result()->fetch_assoc();
		$stmt->close();

		$open = timestamp() <= $result['timestamp'];

		$conn->close();

		return $open;
	}

	private static function getAppointID($id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT appoint_id FROM timeslot WHERE id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute();

		$result = $stmt->get_result()->fetch_assoc();

		$stmt->close();
		$conn->close();

		return $result['appoint_id'];
	}

	private static function newTimeslot($start, $appoint_id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "INSERT INTO timeslot (appoint_id, start_time) VALUES (?, ?)";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("is", $appoint_id, $start);
	
		$success = $stmt->execute();

		return $success;
	}

	private static function getTimeslots($id, $votes = false)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT * FROM timeslot WHERE appoint_id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute();

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

	private static function newVote($timeslot_id, $user_id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "INSERT INTO vote (user_id, timeslot_id) VALUES (?, ?)";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("ii", $user_id, $timeslot_id);
	
		$success = $stmt->execute();

		return $success;
	}

	private static function delVote($id, $user_id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "DELETE FROM vote WHERE id = ? AND user_id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("ii", $id, $user_id);
	
		$success = $stmt->execute();

		return $success;
	}

	private static function getVotes($id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT * FROM votes WHERE timeslot_id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute();

		$result = $stmt->get_result();

		$array = array();
		while($row = $result->fetch_assoc()) {
			$array[] = $row;
		}

		$stmt->close();
		$conn->close();

		return $array;
	}

	private static function newComment($content, $appoint_id, $user_id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "INSERT INTO comment (appoint_id, user_id, content) VALUES (?, ?, ?);".
				"SELECT * FROM comment WHERE id = SCOPE_IDENTITY();";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("iis", $appoint_id, $timeslot_id, $content);
	
		$stmt->execute();
		$result = $stmt->get_result()->fetch_assoc();

		return $result;
	}

	private static function getComments($id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT * FROM comment WHERE appoint_id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute();

		$result = [];
		while($row = $stmt->get_result()->fetch_assoc()) {
		    $result[] = $row;
		}

		$stmt->close();
		$conn->close();

		return $result;
	}
}