function createMail(body) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>

    <style>
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    color: #333333;
  }
  .email-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .header {
    background-color: #007BFF;
    color: #ffffff;
    text-align: center;
    padding: 20px;
  }
  .header h1 {
    margin: 0;
    font-size: 24px;
  }
  .content {
    padding: 20px;
  }
  .content p {
    line-height: 1.6;
  }
  .button {
    display: inline-block;
    background-color: #007BFF;
    color: #ffffff;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 10px;
  }
  .button:hover {
    background-color: #0056b3;
  }
  .footer {
    background-color: #f4f4f4;
    color: #888888;
    text-align: center;
    font-size: 12px;
    padding: 10px;
  }

  /* Responsive styling */
  @media only screen and (max-width: 600px) {
    .email-container {
      width: 100%;
      margin: 0 auto;
      border-radius: 0; /* Remove rounding on small screens */
      box-shadow: none; /* No shadow for full-width display */
    }
    .content, .header, .footer {
      padding: 15px;
    }
    .header h1 {
      font-size: 20px;
    }
  }

  /* Dark mode styles */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #121212;
      color: #e0e0e0;
    }
    .email-container {
      background: #1e1e1e;
      box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
    }
    .header {
      background-color: #1a73e8;
      color: #ffffff;
    }
    .button {
      background-color: #1a73e8;
      color: #ffffff;
    }
    .button:hover {
      background-color: #1558b3;
    }
    .footer {
      background-color: #1e1e1e;
      color: #bbbbbb;
    }
  }
</style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>CC Pro</h1>
        </div>
        <div class="content">
            ${body}
            <p>Best regards,<br>The CC Pro Team</p>
        </div>
        <div class="footer">
            &copy; 2025 CC Pro. All rights reserved.
        </div>
    </div>
</body>
</html>

  `;
}

export default createMail;