<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    echo 'Please complete the required fields.';
    exit;
}

$to = 'info@clickforparts.co.za';
$subject = 'New website enquiry from Click For Parts';
$body = "Name: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message";

mail($to, $subject, $body, "From: $email");

header('Location: index.html');
exit;
?>
