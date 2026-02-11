/**
 * Maintenance Mode Worker for OIKO
 * This worker displays a maintenance page for all requests
 */

export default {
  async fetch(request, env, ctx) {
    const maintenanceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OIKO - Under Maintenance</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }

        .container {
            background: white;
            border-radius: 20px;
            padding: 60px 40px;
            max-width: 600px;
            margin: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
        }

        .logo {
            font-size: 48px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 30px;
        }

        h1 {
            font-size: 32px;
            margin-bottom: 20px;
            color: #1a1a1a;
        }

        p {
            font-size: 18px;
            line-height: 1.6;
            color: #666;
            margin-bottom: 15px;
        }

        .icon {
            font-size: 80px;
            margin-bottom: 30px;
        }

        .footer {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 14px;
        }

        @media (max-width: 600px) {
            .container {
                padding: 40px 30px;
            }

            h1 {
                font-size: 24px;
            }

            p {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🛠️</div>
        <div class="logo">OIKO</div>
        <h1>We'll Be Right Back!</h1>
        <p>We're currently performing scheduled maintenance to improve your experience.</p>
        <p>Our site will be back online shortly. Thank you for your patience!</p>
        <div class="footer">
            <p>For urgent inquiries, please contact us at <strong>support@oikaofit.com</strong></p>
        </div>
    </div>
</body>
</html>
    `;

    return new Response(maintenanceHTML, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Retry-After': '3600', // Suggest retry in 1 hour
      },
    });
  },
};
