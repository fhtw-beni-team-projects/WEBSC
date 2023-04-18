<?php

class requestLogic
{
	private $id;

	function request($method, $param) {
		switch ($method)
		{
			case 'getAppointList':
				$result = appoint::getList($param['id']);
				break;
			case 'getFullAppoint':
				$result = appoint::getAppoint($param['id']);
				break;
			case 'newAppoint':
				break;
			case 'newVotes':
				break;
			case 'getName':
				$result = user::getName($param['id']);
				break;
			case 'newComment':
				break;
			case 'login':
				$user = new user();
				$result = $user->login($param['email'], $param['pwd']) ? true : null;
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
				$result = $user->signup($param['email'], $param['pwd'], $param['fname'], $param['lname']) ? true : null;
				break;
			default:
				$result = null;
		}

		return $result;
	}
}