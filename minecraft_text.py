LEGACY_COLORS = {
    "0": "#000000",
    "1": "#0000AA",
    "2": "#00AA00",
    "3": "#00AAAA",
    "4": "#AA0000",
    "5": "#AA00AA",
    "6": "#FFAA00",
    "7": "#AAAAAA",
    "8": "#555555",
    "9": "#5555FF",
    "a": "#55FF55",
    "b": "#55FFFF",
    "c": "#FF5555",
    "d": "#FF55FF",
    "e": "#FFFF55",
    "f": "#FFFFFF"
}


def _rgb_color_at(value, index):
    if value[index:index + 2].casefold() != "§x":
        return None
    if index + 14 > len(value):
        return None

    digits = []
    for pair_start in range(index + 2, index + 14, 2):
        if value[pair_start] != "§":
            return None
        digit = value[pair_start + 1]
        if digit.casefold() not in "0123456789abcdef":
            return None
        digits.append(digit)

    return "#" + "".join(digits), index + 14


def format_minecraft_text(value):
    parts = []
    text = []
    style = {
        "color": None,
        "bold": False,
        "italic": False,
        "underline": False,
        "strikethrough": False
    }

    def flush_text():
        if text:
            parts.append({
                "text": "".join(text),
                **style
            })
            text.clear()

    index = 0
    while index < len(value):
        if value[index] != "§":
            text.append(value[index])
            index += 1
            continue

        rgb_color = _rgb_color_at(value, index)
        if rgb_color is not None:
            flush_text()
            style.update({
                "color": rgb_color[0],
                "bold": False,
                "italic": False,
                "underline": False,
                "strikethrough": False
            })
            index = rgb_color[1]
            continue

        if index + 1 == len(value):
            index += 1
            continue

        code = value[index + 1].casefold()
        color = LEGACY_COLORS.get(code)
        if color is not None:
            flush_text()
            style.update({
                "color": color,
                "bold": False,
                "italic": False,
                "underline": False,
                "strikethrough": False
            })
        elif code == "r":
            flush_text()
            style.update({
                "color": None,
                "bold": False,
                "italic": False,
                "underline": False,
                "strikethrough": False
            })
        elif code in ("l", "m", "n", "o", "k"):
            flush_text()
            if code == "l":
                style["bold"] = True
            elif code == "m":
                style["strikethrough"] = True
            elif code == "n":
                style["underline"] = True
            elif code == "o":
                style["italic"] = True

        index += 2

    flush_text()
    return parts
