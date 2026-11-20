(function (global) {
    function append(parent, parts) {
        if (!Array.isArray(parts)) {
            throw new TypeError("Formatted Minecraft text must be an array.");
        }

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

    global.MinecraftText = {append};
}(window));
