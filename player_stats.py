
import json
from pathlib import Path


STATISTICS = {
    "playtime": "Playtime (Hours)",
    "deaths": "Deaths",
    "mob_kills": "Mob Kills",
    "player_kills": "Player Kills",
    "blocks_mined": "Blocks Mined",
    "diamonds_mined": "Diamond Ore Mined",
    "items_crafted": "Items Crafted",
    "distance_walked": "Distance Walked (km)",
    "fish_caught": "Fish Caught",
    "jumps": "Jumps",
    "animals_bred": "Animals Bred",
    "damage_dealt": "Damage Dealt"
}


def get_usernames(cache_path):
    with open(cache_path, encoding="utf-8") as file:
        users = json.load(file)

    return {
        user["uuid"]: user["name"]
        for user in users
    }


def get_player_stats(cache_path, stats_directory):

    usernames = get_usernames(cache_path)
    players = []

    for path in Path(stats_directory).glob("*.json"):

        uuid = path.stem

        try:
            with open(path, encoding="utf-8") as file:
                stats = json.load(file)["stats"]
        except (OSError, ValueError, KeyError):
            continue

        custom = stats.get("minecraft:custom", {})
        mined = stats.get("minecraft:mined", {})
        crafted = stats.get("minecraft:crafted", {})

        player = {
            "uuid": uuid,
            "name": usernames.get(uuid, uuid[:8]),

            "playtime": round(
                custom.get("minecraft:play_time", 0)
                / 72000, 2
            ),

            "deaths": custom.get(
                "minecraft:deaths", 0
            ),

            "mob_kills": custom.get(
                "minecraft:mob_kills", 0
            ),

            "player_kills": custom.get(
                "minecraft:player_kills", 0
            ),

            "blocks_mined": sum(mined.values()),

            "diamonds_mined": (
                mined.get("minecraft:diamond_ore", 0)
                + mined.get(
                    "minecraft:deepslate_diamond_ore", 0
                )
            ),

            "items_crafted": sum(crafted.values()),

            "distance_walked": round(
                custom.get("minecraft:walk_one_cm", 0)
                / 100000, 2
            ),

            "fish_caught": custom.get(
                "minecraft:fish_caught", 0
            ),

            "jumps": custom.get(
                "minecraft:jump", 0
            ),

            "animals_bred": custom.get(
                "minecraft:animals_bred", 0
            ),

            "damage_dealt": custom.get(
                "minecraft:damage_dealt", 0
            ) / 10
        }

        players.append(player)

    return players


def get_leaderboards(players, limit=10):

    leaderboards = []

    for key, title in STATISTICS.items():

        ranked = sorted(
            players,
            key=lambda player: player[key],
            reverse=True
        )

        leaderboards.append({
            "key": key,
            "title": title,
            "players": ranked[:limit]
        })

    return leaderboards


if __name__ == "__main__":

    players = get_player_stats(
        "mock_data/usercache.json",
        "mock_data/stats"
    )

    for player in players:
        print(player)
