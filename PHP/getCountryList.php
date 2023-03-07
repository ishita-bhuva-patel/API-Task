<?php

// remove for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$filename = 'countryBorders.geo.json';


$country_data = json_decode(file_get_contents($filename));
// print_r($country_data);
$res = array();
foreach ($country_data->features as $country) {
    array_push($res, $country->properties->name);
}
// print_r(json_encode($res));

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = json_encode($res);

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
