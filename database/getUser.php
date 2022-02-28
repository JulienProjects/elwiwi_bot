<?php
echo "test"
 $cn = pg_connect("host=ec2-34-242-89-204.eu-west-1.compute.amazonaws.com 
 port=5432 username=wrxtvbjuxmihjf 
 password=17491db7f8d1281f6e3652a8b788e1ba269fcabb2cdc07e3c86413867cb313bb dbname=d40d1gfihfogdb");

 if($cn){
    echo "connect";
    $userId =  $_GET['userId'];
    $result = pg_query($cn, "SELECT FROM e_users WHERE name = {$userId}");

    $data = array();
    while($row = pg_fetch_object($result))
    {
        $data[] = $row
    }

    echo json_encode($data);
 }

?>