
from pathlib import Path
from datetime import datetime
from jinja2 import Environment, FileSystemLoader, select_autoescape
from mcstatus import JavaServer
import argparse
import shutil

BASE_DIR = Path(__file__).resolve().parent

SERVER_ADDRESS = "murphyhall.duckdns.org"
JAVA_PORT = 25565
BEDROCK_PORT = 19132


def get_mock_data():
    return {
        "online": True,
        "player_count": 4,
        "max_players": 20,
        "players": [
            "Steve",
            "Alex",
            "Builder123",
            ".BedrockPlayer"
        ],
        "version": "26.3"
    }


def get_server_data(host):
    try:
        server = JavaServer(host, JAVA_PORT)
        query = server.query()

        return {
            "online": True,
            "player_count": query.players.online,
            "max_players": query.players.max,
            "players": sorted(query.players.list),
            "version": query.software.version
        }

    except Exception as error:
        print(f"Query failed: {error}")

        return {
            "online": False,
            "player_count": None,
            "max_players": None,
            "players": [],
            "version": "Unknown"
        }


def build_website(data, mock=False):

    env = Environment(
        loader=FileSystemLoader(BASE_DIR / "templates"),
        autoescape=select_autoescape(["html"])
    )

    template = env.get_template("index.html")

    html = template.render(
        server_name="Murphy Hall",
        server_address=SERVER_ADDRESS,
        java_port=JAVA_PORT,
        bedrock_port=BEDROCK_PORT,
        updated=datetime.now().strftime("%H:%M:%S"),
        mock=mock,
        **data
    )

    output = BASE_DIR / "build"
    output.mkdir(exist_ok=True)

    temporary = output / "index.tmp"
    temporary.write_text(html, encoding="utf-8")
    temporary.replace(output / "index.html")

    shutil.copyfile(
        BASE_DIR / "static/style.css",
        output / "style.css"
    )

    print("Website generated successfully!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--mock",
        action="store_true"
    )

    parser.add_argument(
        "--host",
        default="127.0.0.1"
    )

    args = parser.parse_args()

    if args.mock:
        data = get_mock_data()
    else:
        data = get_server_data(args.host)

    build_website(data, mock=args.mock)