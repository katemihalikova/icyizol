<?php

$page = $_GET["page"];

include "assets/vendor/PHPMailer-5.2.22/PHPMailerAutoload.php";

$mail = new PHPMailer();
$mail->IsSMTP();
$mail->CharSet = "UTF-8";

$mail->Host = "smtp9.onebit.cz";
$mail->SMTPDebug = 0;
$mail->SMTPAuth = true;
$mail->Port = 25;
$mail->Username = "web@icyizol.cz";
$mail->Password = "WEBweb999";

$mail->setFrom("web@icyizol.cz");
$mail->addAddress("martin.libal@icyizol.cz");
$mail->addAddress("jan.moler@icyizol.cz");
$mail->addAddress("ladislav.sedlicky@icyizol.cz");

// $mail->addAttachment("/var/tmp/file.tar.gz");
// $mail->addAttachment("/tmp/image.jpg", "new.jpg");
$mail->isHTML(false);

if ($page == "kontakt") {
  $mail->Subject = "Nový zanechaný kontakt [z webu]";
  $mail->Body = "Nový zanechaný kontakt:\n\n"
    . "Jméno a příjmení: " . $_POST["jmeno"] . "\n"
    . "Email nebo telefon: " . $_POST["email_telefon"];
} elseif ($page == "kalkulace") {
  $mail->addReplyTo($_POST["email"]);
  $mail->Subject = "Nová kalkulace [z webu]";
  $mail->Body = "Nová kalkulace:\n\n"
    . "Jméno a příjmení: " . $_POST["jmeno"] . "\n"
    . "Email: " . $_POST["email"] . "\n"
    . "Telefon: " . $_POST["telefon"] . "\n"
    . "PSČ: " . $_POST["psc"] . "\n"
    . "Co Vás pálí a studí?:\n" . $_POST["info"] . "\n"
    . "Typ stavby: " . $_POST["typ"] . "\n"
    . "Místo stavby: " . $_POST["misto"] . "\n"
    . "Plocha: " . $_POST["plocha"] . " (m²)\n"
    . "Tloušťka: " . $_POST["tloustka"] . " (cm)\n"
    . "Předpokládaný termín realizace: " . $_POST["termin"];
} else {
  $mail->addReplyTo($_POST["email"]);
  $mail->Subject = "Nový rychlý dotaz [z webu]";
  $mail->Body = "Nový rychlý dotaz:\n\n"
    . "Jméno a příjmení: " . $_POST["jmeno"] . "\n"
    . "Email: " . $_POST["email"] . "\n"
    . "Dotaz:\n" . $_POST["dotaz"];
}

header("Content-Type: text/plain");

if(!$mail->send()) {
  $return = "chyba";
} else {
  $return = "odeslano";
}

if ($page == "kontakt") {
  header("Location: /kontakt.html#" . $return);
} elseif ($page == "kalkulace") {
  header("Location: /kalkulace.html#" . $return);
} else {
  header("Location: /rychly-dotaz.html#" . $return);
}
