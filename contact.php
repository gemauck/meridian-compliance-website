<?php
declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

// Honeypot fields — bots only
if (!empty($_POST['bot-field']) || !empty($_POST['chat-bot-field'])) {
    header('Location: thank-you.html');
    exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$matter = trim((string) ($_POST['matter'] ?? 'General'));
$message = trim((string) ($_POST['message'] ?? ''));
$form = trim((string) ($_POST['form-name'] ?? 'contact'));

if ($name === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: index.html#contact');
    exit;
}

$to = 'info@meridianconsulting.co.za';
$subject = 'Website enquiry - ' . $matter;
$body = "Form: {$form}\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Matter: {$matter}\n\n"
    . "{$message}\n";

$headers = implode("\r\n", [
    'From: Meridian Website <noreply@meridianconsulting.co.za>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
]);

@mail($to, $subject, $body, $headers);

header('Location: thank-you.html');
exit;
