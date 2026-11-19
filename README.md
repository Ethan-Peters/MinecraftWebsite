# MinecraftWebsite

A static status and player-statistics website for a Minecraft server.

## Generate a preview with mock data

From the project directory, run:

```powershell
python main.py --mock
python -m http.server 8000 --directory build
```

Open <http://localhost:8000> to view the generated page.

## Generate the site from a running server

Run the generator on the Minecraft server host, or on a machine that can access
the server files. Pass the server's world `stats` directory and `usercache.json`:

```sh
python3 main.py --host 127.0.0.1 \
  --stats-dir /path/to/minecraft/world/stats \
  --usercache /path/to/minecraft/usercache.json
```

The generator queries the Java server for its live status and reads player
statistics from those files. It writes the static website to `build/`, which
can be served by a web server such as nginx. `--stats-dir` and `--usercache`
must be supplied together.

## Deploy on a Linux VPS

The recommended setup is to run the generator locally on the VPS every 30
seconds and let nginx serve only the generated `build/` directory.

### Configure Minecraft

In the Java server's `server.properties`, enable Query and set its UDP port to
the Java port used by `main.py` (currently `25565`):

```properties
enable-query=true
query.port=25565
```

Restart Minecraft after changing these settings. The generator queries
`127.0.0.1`, so do not open the Query UDP port to the public internet. Keep the
normal Java gameplay TCP port open as needed.

### Install and test the generator

From the deployed project directory:

Use Python 3.11 or newer; the pinned `dnspython` dependency requires it.

```sh
python3 --version
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
mkdir -p build
python main.py \
  --host 127.0.0.1 \
  --stats-dir /opt/minecraft-server/world/stats \
  --usercache /opt/minecraft-server/usercache.json
```

Replace the example stats and cache paths with the actual Minecraft server
paths. The `stats` directory is inside the server's active world directory; the
cache file is in the server root. Confirm `build/index.html` contains live
status and player statistics before installing the timer.

### Install the scheduled generator

The example units in `deploy/systemd/` assume the project is installed at
`/opt/minecraft-website`, the Minecraft server at `/opt/minecraft-server`, and
the service account is `minecraft-website`. Edit
`minecraft-website.service` if your paths differ. Create the service account
and grant it read/traverse access to the project, `usercache.json`, and world
`stats/`, plus write access to the project's `build/` directory only. For
example, on distributions with `useradd`:

```sh
sudo useradd --system --user-group --no-create-home --shell /usr/sbin/nologin minecraft-website
```

Use your distro's ACL or group-permission tools to grant the required access.
Nginx needs read access to `build/` but no access to the Minecraft files.

Install and enable the units:

```sh
sudo cp deploy/systemd/minecraft-website.service /etc/systemd/system/
sudo cp deploy/systemd/minecraft-website.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now minecraft-website.timer
```

Check the timer and generator logs with:

```sh
systemctl status minecraft-website.timer
systemctl list-timers minecraft-website.timer
sudo journalctl -u minecraft-website.service
```

### Serve the generated site with nginx

Edit `deploy/nginx/minecraft-website.conf` to set the site's hostname and
project path, then install it in your distribution's nginx site configuration
directory. Validate and reload nginx:

```sh
sudo nginx -t
sudo systemctl reload nginx
```

The nginx document root must be the project's `build/` directory—not the
Minecraft server directory or the project root. Add TLS using your VPS's
existing HTTPS setup if the site is public. The page makes player names and
statistics public, so only expose it if that is appropriate for your server.

The status and page are regenerated every 30 seconds, but statistics change
only after Minecraft writes updated player-stat files during its save cycle.
