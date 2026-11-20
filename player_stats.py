
import json
import logging
from pathlib import Path

import yaml


LOGGER = logging.getLogger(__name__)

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
        user["uuid"].casefold(): user["name"]
        for user in users
    }


def get_essentials_nicknames(userdata_directory):
    if userdata_directory is None:
        return {}

    directory = Path(userdata_directory)
    if not directory.is_dir():
        raise FileNotFoundError(
            f"Essentials userdata directory not found: {directory}"
        )

    nicknames = {}
    for path in directory.glob("*.yml"):
        try:
            with path.open(encoding="utf-8") as file:
                userdata = yaml.safe_load(file)
        except yaml.YAMLError as error:
            LOGGER.warning(
                "Could not parse Essentials userdata file %s: %s",
                path,
                error
            )
            continue
        except OSError as error:
            LOGGER.warning(
                "Could not read Essentials userdata file %s: %s",
                path,
                error
            )
            continue

        if userdata is None:
            continue
        if not isinstance(userdata, dict):
            LOGGER.warning(
                "Essentials userdata file %s does not contain a mapping",
                path
            )
            continue

        nickname = userdata.get("nickname")
        if isinstance(nickname, str) and nickname.strip():
            nicknames[path.stem.casefold()] = nickname

    return nicknames


def get_player_names(cache_path, essentials_userdata_directory=None):
    usernames = get_usernames(cache_path)
    nicknames = get_essentials_nicknames(essentials_userdata_directory)
    player_names = {}

    for uuid, username in usernames.items():
        nickname = nicknames.get(uuid)
        player_names[uuid] = {
            "username": username,
            "nickname": nickname,
            "display_name": nickname or username
        }

    for uuid, nickname in nicknames.items():
        player_names.setdefault(uuid, {
            "username": uuid[:8],
            "nickname": nickname,
            "display_name": nickname
        })

    return player_names


def get_player_stats(cache_path, stats_directory, player_names=None):

    if player_names is None:
        player_names = get_player_names(cache_path)

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
        player_name = player_names.get(uuid.casefold(), {})
        username = player_name.get("username", uuid[:8])

        player = {
            "uuid": uuid,
            "username": username,
            "name": player_name.get("display_name") or username,

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


def get_online_player_displays(query_usernames, player_names):
    names_by_username = {
        player_name["username"].casefold(): player_name
        for player_name in player_names.values()
        if player_name["username"]
    }

    return [
        {
            "username": username,
            "name": names_by_username.get(
                username.casefold(),
                {"display_name": username}
            )["display_name"]
        }
        for username in query_usernames
    ]


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
