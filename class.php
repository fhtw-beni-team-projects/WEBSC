<?php
spl_autoload_register(function ($class_name) {
    require "classes/".$class_name . ".php";
});
