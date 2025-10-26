<?php
$conn = new mysqli("localhost", "root", "", "slgaminghub");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_POST['register'])) {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if ($password != $confirm_password) {
        echo "Passwords do not match!";
        exit();
    }

    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (username, email, password)
            VALUES ('$username', '$email', '$password_hash')";

    if ($conn->query($sql)) {
        echo "Registration successful! <a href='login.html'>Login Now</a>";
    } else {
        echo "Error: " . $conn->error;
    }
}
?>