<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="${url.resourcesPath}/css/custom.css" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body class="kc-body">

<div class="kc-container">
    <div class="kc-card">
        <h1 class="kc-title">Create Account</h1>

        <#if messagesPerField.existsError('firstName','lastName','email','username','password','password-confirm')>
            <div class="alert-error" style="color: #d9534f; background: #f2dede; padding: 10px; border-radius: 5px; margin-bottom: 20px; font-size: 14px;">
                Please check the form fields.
                </div>
        </#if>

        <form action="${url.registrationAction}" method="post">

            <div class="input-group">
                <span class="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <input type="text" name="firstName" value="${(register.formData.firstName!'')}" required placeholder=" " class="kc-input">
                <label class="floating-label">First Name</label>
            </div>

            <div class="input-group">
                <span class="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <input type="text" name="lastName" value="${(register.formData.lastName!'')}" required placeholder=" " class="kc-input">
                <label class="floating-label">Last Name</label>
            </div>

            <div class="input-group">
                <span class="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <input type="email" name="email" value="${(register.formData.email!'')}" required placeholder=" " class="kc-input">
                <label class="floating-label">Email</label>
            </div>

            <div class="input-group">
                 <span class="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input type="text" name="username" value="${(register.formData.username!'')}" required placeholder=" " class="kc-input">
                <label class="floating-label">Username</label>
            </div>

            <div class="input-group">
                <span class="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input type="password" name="password" required placeholder=" " class="kc-input">
                <label class="floating-label">Password</label>
            </div>

            <div class="input-group">
                <span class="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input type="password" name="password-confirm" required placeholder=" " class="kc-input">
                <label class="floating-label">Confirm Password</label>
            </div>

            <button type="submit" class="kc-btn">Register</button>
        </form>

        <p class="bottom-text">Already have an account? <a href="${url.loginUrl}" class="highlight-link">Login</a></p>
    </div>
</div>

</body>
</html>