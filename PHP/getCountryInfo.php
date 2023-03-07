<?php

// remove for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);



$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, 'http://api.geonames.org/countryInfoJSON?username=IshitaBhuva');
$result = curl_exec($ch);
curl_close($ch);
$allCountryData = json_decode($result);
$country_data = array();

$coundry_code = null;
foreach ($allCountryData->geonames as $countries) {
    if ($countries->countryName == $_REQUEST['country_name']) {
        $country_code = $countries->countryCode;
    }
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, 'http://api.geonames.org/countryInfoJSON?country=' . $country_code . '&username=IshitaBhuva&style=full');
$result = curl_exec($ch);
curl_close($ch);
$response = array();
$response['country_name'] = json_decode($result)->geonames[0]->countryName;
$response['country_code'] = json_decode($result)->geonames[0]->countryCode;
$response['area'] = json_decode($result)->geonames[0]->areaInSqKm;
$response['continent_name'] = json_decode($result)->geonames[0]->continentName;
$response['capital'] = json_decode($result)->geonames[0]->capital;
$response['population'] = json_decode($result)->geonames[0]->population;
$response['languages'] = json_decode($result)->geonames[0]->languages;
$response['currency_code'] = json_decode($result)->geonames[0]->currencyCode;
$response['east'] = json_decode($result)->geonames[0]->east;
$response['north'] = json_decode($result)->geonames[0]->north;
$response['south'] = json_decode($result)->geonames[0]->south;
$response['west'] = json_decode($result)->geonames[0]->west;

$c_north = $response['north'];
$c_east = $response['east'];
$c_south = $response['south'];
$c_west = $response['west'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, 'http://api.geonames.org/weatherJSON?north=' . $c_north . '&south=' . $c_south . '&east=' . $c_east . '&west=' . $c_west . '&username=IshitaBhuva');
$result = curl_exec($ch);
curl_close($ch);


$temperature = json_decode($result)->weatherObservations;

$weather_length = count($temperature);
$sum = array();
for ($i = 0; $i < $weather_length; $i++) {
    array_push($sum, $temperature[$i]->temperature);
}
$weather_average = array_sum($sum) /  $weather_length;
$response['temperature'] = round($weather_average, 2);

$response['wikipedia'] = 'https://en.wikipedia.org/wiki/' . $response['country_name'];

// printf("-----");
// printf(json_encode($decode, JSON_PRETTY_PRINT));
// printf("-----");

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $response;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
