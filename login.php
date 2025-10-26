<?php
// 1. Start the session at the very beginning
session_start();

// Database connection details
$servername = "localhost";
$db_username = "root"; // Assuming 'root' is correct for your local environment
$db_password = ""; 
$dbname = "slgaminghub";

// Create connection
$conn = new mysqli($servername, $db_username, $db_password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_POST['login'])) {
    // Get and clean up input
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    // 2. Use a Prepared Statement for Security (Prevents SQL Injection)
    $sql = "SELECT id, email, password FROM users WHERE email = ?";
    
    // Prepare the statement
    $stmt = $conn->prepare($sql);
    
    // Bind the user-provided email to the prepared statement
    $stmt->bind_param("s", $email);
    
    // Execute the statement
    $stmt->execute();
    
    // Get the result
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        // Check if the submitted password matches the hashed password in the database
        if (password_verify($password, $row['password'])) {
            
            // --- SUCCESSFUL LOGIN ACTION ---
            
            // Set session variables
            $_SESSION['loggedin'] = TRUE;
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['email'] = $row['email'];
            
            // 3. Redirect to the main page (index.html)
            // Use 'index.html' or rename it to 'index.php' if you want to protect it
            header("Location: index.html"); 
            exit; // Stop further script execution
            
        } else {
            // Invalid Password
            // Redirect back to login page (optional: add error message via session)
            echo "Invalid Password! <a href='login.html'>Try again</a>";
        }
    } else {
        // Email not found (Keep message generic for security)
        echo "Invalid Email or Password! <a href='login.html'>Try again</a>";
    }
    
    $stmt->close();
}

$conn->close();
?>