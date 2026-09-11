import json
import re
from pathlib import Path
from html import unescape


ARTIST = "SUPER BEAVER"

# 検索対象から除外するHTML
EXCLUDE_FILES = {
    "index.html",
    "search.html",
}


def clean_text(text):
    text = unescape(text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def get_album_name(html):
    match = re.search(
        r"<h1[^>]*>\s*(.*?)\s*</h1>",
        html,
        re.IGNORECASE | re.DOTALL
    )

    if not match:
        return ""

    return clean_text(match.group(1))


def get_songs(html):
    songs = []

    matches = re.findall(
        r'<div[^>]*class=["\'][^"\']*\bsong\b[^"\']*["\'][^>]*>(.*?)</div>',
        html,
        re.IGNORECASE | re.DOTALL
    )

    for match in matches:
        text = clean_text(match)

        # 先頭のトラック番号を削除
        text = re.sub(r"^\d+\s*[\.\-．、]\s*", "", text)

        if text:
            songs.append(text)

    return songs


def main():
    results = []

    for html_file in sorted(Path(".").glob("*.html")):

        if html_file.name in EXCLUDE_FILES:
            continue

        html = html_file.read_text(encoding="utf-8")

        album = get_album_name(html)
        songs = get_songs(html)

        if not album or not songs:
            continue

        for song in songs:
            results.append({
                "artist": ARTIST,
                "album": album,
                "title": song,
                "url": html_file.name
            })

    with open("search-index.json", "w", encoding="utf-8") as f:
        json.dump(
            results,
            f,
            ensure_ascii=False,
            indent=2
        )

    print(f"検索インデックスを {len(results)} 件生成しました。")


if __name__ == "__main__":
    main()
