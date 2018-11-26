<?php
$errors = array();
$data = array();

$to = 'investor.relations@hdlcorporation.com';
$subject = 'Purchase stock request from website';
$from;
$name;
$message;

if(empty($_POST['emailForStock'])) {
	$errors['emailForStock'] = "Email is required.";
}
if(empty($_POST['nameForStock'])){
	$errors['nameForStock'] = "Last name is required.";
}
if(empty($_POST['messageForStock'])){
	$errors['messageForStock'] = "Message is required.";
}
if(empty($_POST['agreeForStock'])){
	$errors['agreeForStock'] = "Please agree to the shareholders agreement.";
}

if (!empty($errors)) {
  $data['success'] = false;
  $data['errors']  = $errors;
}
else {
	$from = $_POST['emailForStock'];
	$name = $_POST['nameForStock'];
	$message = $_POST['messageForStock'];
	$headers = 'From:' .$name. ' <'.$from.'>';

	mail($to, $subject, $message, $headers);

	$data['success'] = true;
	$data['message'] = 'Message has been sent.';
}
echo json_encode($data);
?>
