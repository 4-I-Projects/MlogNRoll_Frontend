<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="${url.resourcesPath}/css/custom.css" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body class="kc-body">

<div class="kc-container">
    <div class="kc-card">
        <h1 class="kc-title">Welcome Back!!</h1>

        <form action="${url.loginAction}" method="post">
            
            <div class="input-group">
                <span class="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <input type="text" name="username" required placeholder=" " class="kc-input">
                <label class="floating-label">Email hoặc Username</label>
            </div>

            <div class="input-group">
                <span class="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input type="password" name="password" required placeholder=" " class="kc-input">
                <label class="floating-label">Mật khẩu</label>
            </div>

            <div style="text-align: right; margin-bottom: 20px;">
                <a href="#" class="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" class="kc-btn">Login</button>
        </form>

        <div class="separator">- or -</div>

        <div class="social-icons">
            <div class="social-btn google"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" width="20"></div>
            <div class="social-btn fb"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" width="20"></div>
            <div class="social-btn apple"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" width="18"></div>
        </div>

        <p class="bottom-text">Don't have an account? <a href="${url.registrationUrl}" class="highlight-link">Sign up</a></p>
    </div>
</div>

</body>
</html>