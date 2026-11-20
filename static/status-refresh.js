(function () {
    const status = document.getElementById("server-status");
    const playerCount = document.getElementById("player-count");
    const version = document.getElementById("server-version");
    const onlinePlayers = document.getElementById("online-player-content");
    const lastUpdated = document.getElementById("last-updated");
    const refreshError = document.getElementById("status-refresh-error");

    if (!status || !playerCount || !version || !onlinePlayers
        || !lastUpdated || !refreshError || !window.MinecraftText) {
        console.error("Server status refresh elements are missing.");
        return;
    }

    let refreshing = false;

    function updateOnlinePlayers(data) {
        onlinePlayers.replaceChildren();

        if (!data.online) {
            const message = document.createElement("p");
            message.textContent = "Player list unavailable.";
            onlinePlayers.appendChild(message);
            return;
        }

        if (!data.players.length) {
            const message = document.createElement("p");
            message.textContent = "No players online.";
            onlinePlayers.appendChild(message);
            return;
        }

        const list = document.createElement("ul");
        for (const player of data.players) {
            const item = document.createElement("li");
            window.MinecraftText.append(item, player.name_parts);
            list.appendChild(item);
        }
        onlinePlayers.appendChild(list);
    }

    function updateLeaderboards(leaderboards) {
        for (const element of document.querySelectorAll(
            "[data-leaderboard-key]"
        )) {
            const key = element.dataset.leaderboardKey;
            const leaderboard = leaderboards.find((item) => item.key === key);
            const list = element.querySelector("ol");
            if (!leaderboard || !list) {
                throw new Error(`Missing refreshed leaderboard data for ${key}.`);
            }

            list.replaceChildren();
            for (const player of leaderboard.players) {
                const item = document.createElement("li");
                const name = document.createElement("span");
                name.className = "leaderboard-player";
                window.MinecraftText.append(name, player.name_parts);

                const value = document.createElement("span");
                value.className = "leaderboard-value";
                value.textContent = String(player.value);

                item.append(name, value);
                list.appendChild(item);
            }
        }
    }

    async function refreshStatus() {
        if (refreshing) {
            return;
        }
        refreshing = true;

        try {
            const response = await fetch(
                new URL("status.json", document.baseURI),
                {cache: "no-store"}
            );
            if (!response.ok) {
                throw new Error(`Status request failed: ${response.status}`);
            }

            const data = await response.json();
            if (typeof data.online !== "boolean"
                || !Array.isArray(data.players)
                || !Array.isArray(data.leaderboards)) {
                throw new TypeError("Status data has an invalid shape.");
            }

            status.textContent = data.online ? "Online" : "Unavailable";
            status.className = data.online ? "online" : "offline";
            playerCount.textContent = data.online
                ? `${data.player_count}/${data.max_players}`
                : "Unknown";
            version.textContent = data.version;
            updateOnlinePlayers(data);
            updateLeaderboards(data.leaderboards);
            lastUpdated.textContent = data.updated;
            refreshError.hidden = true;
            refreshError.textContent = "";
        } catch (error) {
            console.error("Could not refresh server status.", error);
            refreshError.hidden = false;
            refreshError.textContent = "Could not refresh live server data; showing the last available update.";
        } finally {
            refreshing = false;
        }
    }

    refreshStatus();
    window.setInterval(refreshStatus, 30000);
}());
