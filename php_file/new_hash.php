<?php
function myFunc($arg1, $arg2, $arg3, $arg4, $arg5, $arg6) {
    
    $key=$arg1;
    $txnid=$arg2;
    $amount=$arg3;
    $productinfo=$arg4;
    $firstname=$arg5;
    $email=$arg6;
    $salt="Rk9gdpEkiF";

    $hashSeq = $key.'|'.$txnid.'|'.$amount.'|'.$productinfo.'|'.$firstname.'|'.$email.'|||||||||||'.$salt;
    $hash = hash("sha512", $hashSeq);
    // error_log("all posted variables:".print_r($_POST,true));
    echo $hash;
}
?>