// ===============================
//  PEPFLICK DISCORD LOGGER (1 FILE)
// ===============================

// SET YOUR WEBHOOK HERE:
const WEBHOOK = "https://discord.com/api/webhooks/1520358215441715335/-WlhUfwKPLIA_uJBOFFgRUcJB1KvptLVU3CGvJTmdqK_xlBLiFaFiPVTFVkZaBlQAw92";

// OPTIONAL: If Pepflick exposes a user object, set it here.
function getUser() {
    try {
        if (window.pepflickUser && window.pepflickUser.username) {
            return window.pepflickUser.username;
        }
    } catch (e) {}
    return "Guest";
}

function nowISO() {
    return new Date().toISOString();
}

function sendEmbed(embed) {
    fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] })
    }).catch(err => console.error("Webhook error:", err));
}

// ------------------------------
// LOG SITE VISIT
// ------------------------------
function logVisit() {
    const embed = {
        title: "👤 New Site Visit",
        color: 0x3498db,
        fields: [
            { name: "User", value: getUser(), inline: true },
            { name: "URL", value: window.location.href, inline: false },
            { name: "Timestamp", value: nowISO(), inline: false }
        ],
        footer: { text: "Pepflick Logger" }
    };
    sendEmbed(embed);
}

// ------------------------------
// LOG WATCH START
// ------------------------------
function getTitle() {
    const selectors = [".title", ".video-title", "h1", "h2"];
    for (const s of selectors) {
        const el = document.querySelector(s);
        if (el && el.textContent.trim()) return el.textContent.trim();
    }
    return document.title || "Unknown Title";
}

function logWatchStart() {
    const embed = {
        title: "▶️ Started Watching",
        color: 0xe67e22,
        fields: [
            { name: "User", value: getUser(), inline: true },
            { name: "Title", value: getTitle(), inline: true },
            { name: "URL", value: window.location.href, inline: false },
            { name: "Started At", value: nowISO(), inline: false }
        ],
        footer: { text: "Pepflick Logger" }
    };
    sendEmbed(embed);
}

// ------------------------------
// HOOK INTO HTML5 VIDEO
// ------------------------------
function hookVideo() {
    const video = document.querySelector("video");
    if (!video) return;

    let played = false;

    video.addEventListener("play", () => {
        if (!played) {
            played = true;
            logWatchStart();
        }
    });
}

// ------------------------------
// INIT
// ------------------------------
(function init() {
    if (!WEBHOOK.includes("discord.com/api/webhooks")) {
        console.warn("Webhook missing.");
        return;
    }

    logVisit();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", hookVideo);
    } else {
        hookVideo();
    }

    console.log("Pepflick Logger Loaded.");
})();
