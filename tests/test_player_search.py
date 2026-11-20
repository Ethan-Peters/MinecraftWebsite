import json
import unittest

from main import build_player_search_data
from minecraft_text import format_minecraft_text
from player_stats import STATISTICS


class PlayerSearchDataTests(unittest.TestCase):
    def test_includes_all_players_and_searchable_formatted_nicknames(self):
        players = []
        for index in range(12):
            nickname = "§aBuilder&<" if index == 0 else f"Player{index}"
            player = {
                "uuid": f"uuid-{index}",
                "username": f"Account{index}",
                "name": nickname,
                "name_parts": format_minecraft_text(nickname)
            }
            player.update({
                key: index
                for key in STATISTICS
            })
            players.append(player)

        search_data = build_player_search_data(players)

        self.assertEqual(len(search_data), 12)
        first_player = search_data[0]
        self.assertEqual(first_player["username"], "Account0")
        self.assertEqual(first_player["search_name"], "Builder&<")
        self.assertEqual(
            first_player["display_name_parts"][0]["color"],
            "#55FF55"
        )
        self.assertEqual(len(first_player["stats"]), len(STATISTICS))
        self.assertEqual(
            first_player["stats"][0]["label"],
            STATISTICS[next(iter(STATISTICS))]
        )
        self.assertNotIn("§", json.dumps(search_data, ensure_ascii=False))


if __name__ == "__main__":
    unittest.main()
