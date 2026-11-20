import json
import tempfile
import unittest
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

from minecraft_text import format_minecraft_text
from player_stats import (
    get_online_player_displays,
    get_player_names,
    get_player_stats
)


PLAYER_UUID = "00000000-0000-0000-0009-01f017ffa523"


class PlayerNamesTests(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary_directory.name)
        self.cache_path = self.root / "usercache.json"
        self.stats_directory = self.root / "stats"
        self.userdata_directory = self.root / "userdata"
        self.stats_directory.mkdir()
        self.userdata_directory.mkdir()
        self.cache_path.write_text(
            json.dumps([{"uuid": PLAYER_UUID, "name": "AccountName"}]),
            encoding="utf-8"
        )

    def tearDown(self):
        self.temporary_directory.cleanup()

    def write_stats(self):
        stats = {
            "stats": {
                "minecraft:custom": {},
                "minecraft:mined": {},
                "minecraft:crafted": {}
            }
        }
        (self.stats_directory / f"{PLAYER_UUID}.json").write_text(
            json.dumps(stats),
            encoding="utf-8"
        )

    def test_nickname_and_canonical_username_are_kept(self):
        nickname = "§x§F§F§B§6§C§1memaw"
        (self.userdata_directory / f"{PLAYER_UUID}.yml").write_text(
            f"nickname: {nickname}\n",
            encoding="utf-8"
        )
        self.write_stats()

        names = get_player_names(self.cache_path, self.userdata_directory)
        player = get_player_stats(
            self.cache_path,
            self.stats_directory,
            player_names=names
        )[0]

        self.assertEqual(player["username"], "AccountName")
        self.assertEqual(player["name"], nickname)

    def test_empty_nickname_falls_back_to_usercache_for_online_players(self):
        (self.userdata_directory / f"{PLAYER_UUID}.yml").write_text(
            'nickname: ""\n',
            encoding="utf-8"
        )
        names = get_player_names(self.cache_path, self.userdata_directory)

        online_players = get_online_player_displays(
            ["accountname", "UnknownPlayer"],
            names
        )

        self.assertEqual(online_players[0]["username"], "accountname")
        self.assertEqual(online_players[0]["name"], "AccountName")
        self.assertEqual(online_players[1]["name"], "UnknownPlayer")

    def test_malformed_userdata_warns_and_falls_back(self):
        (self.userdata_directory / f"{PLAYER_UUID}.yml").write_text(
            "nickname: [broken\n",
            encoding="utf-8"
        )

        with self.assertLogs("player_stats", level="WARNING"):
            names = get_player_names(
                self.cache_path,
                self.userdata_directory
            )

        self.assertEqual(names[PLAYER_UUID]["display_name"], "AccountName")

    def test_missing_usercache_entry_falls_back_to_uuid_prefix(self):
        self.cache_path.write_text("[]", encoding="utf-8")
        self.write_stats()

        player = get_player_stats(
            self.cache_path,
            self.stats_directory
        )[0]

        self.assertEqual(player["username"], PLAYER_UUID[:8])
        self.assertEqual(player["name"], PLAYER_UUID[:8])

    def test_rgb_and_legacy_formatting_codes_become_display_runs(self):
        parts = format_minecraft_text(
            "§x§F§F§B§6§C§1memaw§r §aGreen§lBold§nUnder"
        )

        self.assertEqual(parts[0]["text"], "memaw")
        self.assertEqual(parts[0]["color"], "#FFB6C1")
        self.assertEqual(parts[1]["text"], " ")
        self.assertIsNone(parts[1]["color"])
        self.assertEqual(parts[2]["text"], "Green")
        self.assertEqual(parts[2]["color"], "#55FF55")
        self.assertTrue(parts[3]["bold"])
        self.assertTrue(parts[4]["underline"])

    def test_obfuscated_code_is_not_rendered_as_raw_formatting(self):
        parts = format_minecraft_text("§kSecret")

        self.assertEqual(parts[0]["text"], "Secret")
        self.assertFalse(parts[0]["bold"])

    def test_rgb_color_is_rendered_as_a_style(self):
        template_directory = Path(__file__).resolve().parents[1] / "templates"
        environment = Environment(
            loader=FileSystemLoader(template_directory),
            autoescape=select_autoescape(["html"])
        )
        template = environment.from_string(
            '{% from "minecraft_text.html" import minecraft_text %}'
            '{{ minecraft_text(parts) }}'
        )

        rendered = template.render(
            parts=format_minecraft_text("§x§F§F§B§6§C§1memaw")
        )

        self.assertIn('style="color:#FFB6C1;"', rendered)
        self.assertIn(">memaw</span>", rendered)

    def test_formatted_text_remains_html_escaped(self):
        template_directory = Path(__file__).resolve().parents[1] / "templates"
        environment = Environment(
            loader=FileSystemLoader(template_directory),
            autoescape=select_autoescape(["html"])
        )
        template = environment.from_string(
            '{% from "minecraft_text.html" import minecraft_text %}'
            '{{ minecraft_text(parts) }}'
        )

        rendered = template.render(
            parts=format_minecraft_text("<script>alert(1)</script>")
        )

        self.assertIn("&lt;script&gt;", rendered)
        self.assertNotIn("<script>", rendered)


if __name__ == "__main__":
    unittest.main()
