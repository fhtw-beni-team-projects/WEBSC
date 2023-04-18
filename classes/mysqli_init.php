<?php
class mysqli_init extends mysqli
{
    public function __construct($file = "db_settings.ini")
    {
        $settings = parse_ini_file($file, true);
        if (!$settings) {
            throw new exception('Unable to open ' . $file . '.');
        }

    $servername = $settings['database']['host'];
    $username = $settings['database']['username'];
    $password = $settings['database']['password'];
    $schema = $settings['database']['schema'];

    parent::__construct($servername, $username, $password, $schema);

    }
}