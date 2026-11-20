(function () {
    const input = document.getElementById("player-search-input");
    const status = document.getElementById("player-search-status");
    const results = document.getElementById("player-search-results");
    const details = document.getElementById("player-search-details");
    const playerName = document.getElementById("player-search-name");
    const playerUsername = document.getElementById("player-search-username");
    const statistics = document.getElementById("player-search-statistics");

    if (!input || !status || !results || !details
        || !playerName || !playerUsername || !statistics) {
        return;
    }

    let players = [];
    let selectedUuid = null;
    const urlParameters = new URLSearchParams(window.location.search);
    const initialQuery = urlParameters.get("playerSearch") || "";
    const initialUuid = urlParameters.get("player") || "";

    function updateUrl(query, uuid) {
        const parameters = new URLSearchParams(window.location.search);
        if (query.trim()) {
            parameters.set("playerSearch", query);
        } else {
            parameters.delete("playerSearch");
        }

        if (uuid) {
            parameters.set("player", uuid);
        } else {
            parameters.delete("player");
        }

        const queryString = parameters.toString();
        const nextUrl = window.location.pathname
            + (queryString ? `?${queryString}` : "")
            + window.location.hash;
        window.history.replaceState(null, "", nextUrl);
    }

    function appendFormattedName(parent, parts) {
        for (const part of parts) {
            const span = document.createElement("span");
            if (typeof part.color === "string"
                && /^#[0-9a-f]{6}$/i.test(part.color)) {
                span.style.color = part.color;
            }
            if (part.bold) {
                span.style.fontWeight = "bold";
            }
            if (part.italic) {
                span.style.fontStyle = "italic";
            }
            const decorations = [];
            if (part.underline) {
                decorations.push("underline");
            }
            if (part.strikethrough) {
                decorations.push("line-through");
            }
            if (decorations.length) {
                span.style.textDecoration = decorations.join(" ");
            }
            span.textContent = part.text;
            parent.appendChild(span);
        }
    }

    function clearDetails() {
        details.hidden = true;
        playerName.replaceChildren();
        playerUsername.textContent = "";
        statistics.replaceChildren();
    }

    function displayDetails(player) {
        playerName.replaceChildren();
        appendFormattedName(playerName, player.display_name_parts);
        playerUsername.textContent = `Minecraft username: ${player.username}`;
        statistics.replaceChildren();

        for (const stat of player.stats) {
            const label = document.createElement("dt");
            label.textContent = stat.label;
            const value = document.createElement("dd");
            value.textContent = String(stat.value);
            statistics.append(label, value);
        }

        details.hidden = false;
        status.textContent = `Showing statistics for ${player.search_name} (${player.username}).`;
    }

    function displayResults(query) {
        const searchTerm = query.trim().toLocaleLowerCase();
        results.replaceChildren();
        results.hidden = true;

        if (!players.length) {
            status.textContent = "No player statistics are available.";
            return [];
        }

        if (!searchTerm) {
            status.textContent = "Enter a username or nickname to search.";
            return [];
        }

        const matches = players
            .filter((player) => (
                player.username.toLocaleLowerCase().includes(searchTerm)
                || player.search_name.toLocaleLowerCase().includes(searchTerm)
            ))
            .sort((left, right) => (
                left.username.localeCompare(right.username, undefined, {
                    sensitivity: "base"
                })
            ));

        if (!matches.length) {
            status.textContent = "No players match that username or nickname.";
            return matches;
        }

        for (const player of matches) {
            const item = document.createElement("li");
            const button = document.createElement("button");
            button.type = "button";
            button.className = "player-search-result";
            button.setAttribute(
                "aria-label",
                `Show statistics for ${player.search_name} (username ${player.username})`
            );
            button.setAttribute(
                "aria-pressed",
                String(player.uuid === selectedUuid)
            );

            const name = document.createElement("span");
            name.className = "player-search-result-name";
            appendFormattedName(name, player.display_name_parts);

            const username = document.createElement("span");
            username.className = "player-search-result-username";
            username.textContent = `Username: ${player.username}`;

            button.append(name, username);
            button.addEventListener("click", () => selectPlayer(player));
            item.appendChild(button);
            results.appendChild(item);
        }

        results.hidden = false;
        status.textContent = `${matches.length} player${matches.length === 1 ? "" : "s"} found. Select a player to view statistics.`;
        return matches;
    }

    function selectPlayer(player, syncUrl = true) {
        selectedUuid = player.uuid;
        displayResults(input.value);
        displayDetails(player);
        if (syncUrl) {
            updateUrl(input.value, selectedUuid);
        }
    }

    input.addEventListener("input", () => {
        selectedUuid = null;
        clearDetails();
        updateUrl(input.value, null);
        displayResults(input.value);
    });

    fetch(new URL("players.json", document.baseURI), {cache: "no-store"})
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Player data request failed: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (!Array.isArray(data)) {
                throw new TypeError("Player data must be a JSON array.");
            }

            players = data;
            input.value = initialQuery;
            input.disabled = false;
            displayResults(initialQuery);

            const selectedPlayer = players.find(
                (player) => player.uuid === initialUuid
            );
            if (selectedPlayer) {
                selectPlayer(selectedPlayer, false);
            } else if (initialUuid) {
                status.textContent = "The selected player is no longer available. Choose a search result.";
            }
        })
        .catch((error) => {
            console.error("Could not load player statistics.", error);
            status.textContent = "Could not load player statistics. Please refresh the page.";
            input.disabled = true;
        });
}());
