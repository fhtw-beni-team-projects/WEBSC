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
			$row['votecount'] = self::getVoteCount($row['id']);
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
		$stmt->execute();
	
		//$rows = $stmt->get_result()->affected_rows;

		return $conn->affected_rows;
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

		$result['timeslot'] = self::getTimeslots($id, true);
		$result['comment'] = self::getComments($id);
		$result['votecount'] = self::getVoteCount($id);
		$result['owner'] = $result['user_id'] == $_SESSION['user_id'];

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

		$open = new DateTime() <= new DateTime($result['timestamp']);

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

	private static function newTimeslots($start, $appoint_id)
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

		$sql = "SELECT t.*, count(DISTINCT v.user_id) AS votecount FROM timeslot t LEFT JOIN vote v ON t.id = v.timeslot_id WHERE t.appoint_id = ? GROUP BY t.id";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute();

		$result = $stmt->get_result();

		$array = array();
		while($row = $result->fetch_assoc()) {
			if ($votes) {
				$row['votes'] = self::getVotes($row['id']);
			}
			$array[] = $row;
		}

		$stmt->close();
		$conn->close();

		return $array;
	}

	public static function getNullTime($appoint_id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT id FROM timeslot WHERE appoint_id = ? AND start_time IS NULL";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $appoint_id);
		$stmt->execute();
	
		$result = $stmt->get_result();

		return $result->fetch_row()[0];
	}

	public static function addVote($timeslot_id, $user_id)
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

	public static function resetVotes($appoint_id, $user_id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "DELETE vote FROM vote LEFT JOIN timeslot ON vote.timeslot_id=timeslot.id WHERE timeslot.appoint_id = ? AND vote.user_id = ?;";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("ii", $appoint_id, $user_id);
	
		$success = $stmt->execute();

		return $success;
	}

	private static function getVotes($id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT * FROM vote WHERE timeslot_id = ?";
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

	private static function getVoteCount($id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT count(DISTINCT user_id) AS votes FROM vote v JOIN timeslot t ON v.timeslot_id=t.id WHERE t.appoint_id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute();

		$result = $stmt->get_result();

		return $result->fetch_row()[0];
	}

	public static function newComment($content, $appoint_id, $user_id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "INSERT INTO comment (appoint_id, user_id, content) VALUES (?, ?, ?);";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("iis", $appoint_id, $user_id, $content);
	
		$stmt->execute();
		$id = $stmt->insert_id;

		return self::getComment($id);
	}

	private static function getComments($id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT c.*, u.fname, u.lname FROM comment c JOIN user u ON c.user_id = u.id WHERE appoint_id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute();
		$result = $stmt->get_result();

		$comments = [];
		while($row = $result->fetch_assoc()) {
		    $comments[] = $row;
		}

		$stmt->close();
		$conn->close();

		return $comments;
	}

	private static function getComment($comment_id)
	{
		$conn = new mysqli_init();
		if ($conn->connect_error) {
			die("Connection failed: ".$conn->connect_error);
		}

		$sql = "SELECT c.*, u.fname, u.lname FROM comment c JOIN user u ON c.user_id = u.id WHERE c.id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $comment_id);
		$stmt->execute();
		$result = $stmt->get_result()->fetch_assoc();

		$stmt->close();
		$conn->close();

		return $result;
	}
}