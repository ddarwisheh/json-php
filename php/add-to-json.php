<?php

//update all json file 

$data = $_POST['todoList'];
$jsonData = str_replace('\\', '', json_encode($data));
$jsonData = substr($jsonData, 1);
$jsonData = substr($jsonData, 0, -1);

file_put_contents('../json/todos.json', $jsonData);




    //add todo json fie
    /*
    $data = $_POST;
    
    $inp = file_get_contents('../json/todos.json');
    $tempArray = json_decode($inp);
    array_push($tempArray, $data);
    $jsonData = json_encode($tempArray);
    file_put_contents('../json/todos.json', $jsonData);
    echo $jsonData;
    */
