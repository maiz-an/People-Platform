# People Platform - Setup Guide

## Prerequisites

Before setting up the People Platform, ensure you have the following installed:

1. **PHP** (version 7.4 or higher recommended)
   - Download from: https://www.php.net/downloads.php
   - Or use XAMPP/WAMP which includes PHP, MySQL, and Apache

2. **MySQL** (version 5.7 or higher)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL

3. **Composer** (optional, for managing PHP dependencies)
   - Download from: https://getcomposer.org/download/
   - Note: Dependencies are already included in the `vendor` folder, but Composer is needed if you want to update them

4. **Web Server** (Apache, Nginx, or PHP built-in server)
   - XAMPP/WAMP includes Apache
   - Or use PHP's built-in server: `php -S localhost:8000`

## Setup Steps

### 1. Database Setup 

1. Start your MySQL server (if using XAMPP/WAMP, start MySQL from the control panel)

2. Create a new database named `demo`:
   ```sql
   CREATE DATABASE demo;
   ```

3. Import the database schema:
   - Open phpMyAdmin (if using XAMPP/WAMP) or use MySQL command line
   - Select the `demo` database
   - Import the file: `SQL _Database/demo.sql`
   
   Or via command line:
   ```bash
   mysql -u root -p demo < "SQL _Database/demo.sql"
   ```

### 2. Database Configuration

Edit the `connection.php` file to match your MySQL settings:

```php
<?php
// Update these values according to your MySQL configuration
$connection = mysqli_connect("localhost", "root", ""); // host, username, password
$db = mysqli_select_db($connection, 'demo');
?>
```

**Default configuration:**
- Host: `localhost`
- Username: `root`
- Password: `` (empty)
- Database: `demo`

If your MySQL setup is different, update these values accordingly.

### 3. PHP Dependencies

The project dependencies are already included in the `vendor` folder. However, if you need to update or reinstall them:

```bash
composer install
```

**Required packages:**
- `minishlink/web-push`: For push notifications
- `phpmailer/phpmailer`: For email functionality

### 4. Web Server Configuration

#### Option A: Using XAMPP/WAMP
1. Copy the project folder to `htdocs` (XAMPP) or `www` (WAMP)
2. Access via: `http://localhost/People/` or `http://localhost/People-Platform/`

#### Option B: Using PHP Built-in Server
1. Navigate to the project directory in terminal
2. Run: `php -S localhost:8000`
3. Access via: `http://localhost:8000`

#### Option C: Using Apache/Nginx
1. Configure your web server to point to the project directory
2. Ensure PHP is enabled and configured

### 5. Email Configuration (Optional)

If you want email functionality to work, you'll need to configure PHPMailer. Check files that use email functionality and update SMTP settings accordingly.

### 6. Verify Installation

1. Open your browser and navigate to the project URL
2. You should see the People Platform homepage
3. Try registering a new user or logging in with existing credentials

## Default Admin Credentials

Based on the database dump, there are admin accounts. You may need to check the database for actual credentials or reset passwords as needed.

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check `connection.php` credentials
- Ensure the `demo` database exists and is imported

### PHP Errors
- Check PHP error logs
- Ensure PHP version is 7.4 or higher
- Verify all required PHP extensions are enabled (mysqli, mbstring, etc.)

### Dependencies Issues
- Run `composer install` if vendor folder is missing or corrupted
- Ensure Composer is installed and in your PATH

## Project Structure

- `connection.php` - Database connection configuration
- `SQL _Database/demo.sql` - Database schema and initial data
- `vendor/` - PHP dependencies (Composer packages)
- `PHPMailer-master/` - PHPMailer library
- Main PHP files - Application logic and pages

## Next Steps

1. Configure your database connection
2. Import the database schema
3. Start your web server
4. Access the application in your browser

For more information, refer to the main [README.md](README.md) file.

