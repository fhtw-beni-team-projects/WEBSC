<?php

class requestLogic
{
	private $id;

	function request($method, $param) {
		switch ($method)
		{
			case 'getAppointList':
				$result = appoint::getList($param ? $param['limit'] : NULL);
				break;
			case 'getFullAppoint':
				$result = appoint::getAppoint($param['id']);
				break;
			case 'newAppoint':
				if (!isset($_SESSION['user_id']))
					return null;

				$result = appoint::newAppoint($param['timeslots'], $param['title'], $param['descr'], $param['duration'], $param['deadline'], $_SESSION['user_id']);
				break;
			case 'delAppoint':
				if (!isset($_SESSION['user_id']))
					return null;
				
				$result = appoint::delAppoint($param['id'], $_SESSION['user_id']);
				break;
			case 'changeVotes':
				if (!isset($_SESSION['user_id']))
					return null;

				if (!appoint::appointOpen($param[0]['timeslot_id']))
					return null;

				foreach ($param['votes'] as $vote) {
					if ($vote['id'] != NULL && $vote['confirm'] == false) {
						appoint::delVote($vote['id'], $_SESSION['user_id']);
						continue;
					}

					if ($vote['id'] == NULL && $vote['confirm'] == true) {
						appoint::addVote($vote['timeslot_id'], $_SESSION['user_id']);
					}
				}
				break;
			case 'getName':
				$result = user::getName($param['id']);
				break;
			case 'newComment':
				if (!isset($_SESSION['user_id']))
					return null;

				$result = appoint::newComment($param['content'], $param['appoint_id'], $_SESSION['user_id']);
				break;
			case 'login':
				$user = new user();
				$result = $user->login($param['email'], $param['pwd']);
				if ($result == false)
					$result == null;
				break;
			case 'logout':
				setcookie(session_name(), '', 100);
				session_unset();
				session_destroy();
				$_SESSION = array();
				$result = true;
				break;
			case 'signup':
				$user = new user();
				$result = $user->signup($param['email'], $param['pwd'], $param['fname'], $param['lname']);
				if ($result == false)
					$result == null;
				break;
			default:
				$result = null;
		}

		return $result;
	}
}