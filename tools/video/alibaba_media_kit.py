"""1688 / Alibaba / Taobao product media kit downloader.

For affiliate/dropshipper use: Chinese factories publish product videos and images
as marketing assets for registered affiliates to reuse when promoting their products.
This utility parses a product page URL and downloads the media kit to a local folder.

Use only for products you are legitimately selling as an affiliate or have permission
to promote. Respect the factory's stated usage terms.

Usage:
    python tools/video/alibaba_media_kit.py single "https://detail.1688.com/offer/xxxxx.html" --out projects/aff_product1
    python tools/video/alibaba_media_kit.py batch urls.txt --out projects/aff_batch/

The batch mode reads a text file with one product URL per line.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path


USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/131.0.0.0 Safari/537.36"
)

HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "vi,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7",
}


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def extract_product_id(url: str) -> str | None:
    """Extract offer/product id from 1688 or Taobao URL."""
    m = re.search(r"offer/(\d+)", url)
    if m:
        return m.group(1)
    m = re.search(r"id=(\d+)", url)
    if m:
        return m.group(1)
    return None


def find_media_urls(html: str) -> dict[str, list[str]]:
    """Extract video and image URLs from a 1688/Taobao product page HTML.

    1688 product pages embed media URLs in multiple places:
    - JSON blobs inside <script> tags (window.runParams, offerDetail, etc.)
    - Direct <video> and <img> tags
    - Data attributes on image gallery elements

    We do a broad scan for known media URL patterns.
    """
    media = {"videos": [], "images": []}
    seen = set()

    # Video URLs — 1688 CDN patterns
    video_patterns = [
        r'(https?://[^\s"\'<>]*\.(?:mp4|m3u8)(?:\?[^\s"\'<>]*)?)',
        r'"videoUrl"\s*:\s*"([^"]+)"',
        r'"mp4Url"\s*:\s*"([^"]+)"',
        r'videoSrc["\']?\s*[:=]\s*["\']([^"\']+)["\']',
    ]
    for pat in video_patterns:
        for m in re.finditer(pat, html):
            url = m.group(1).replace("\\u002F", "/").replace("\\/", "/")
            if url.startswith("//"):
                url = "https:" + url
            if url not in seen and url.startswith("http"):
                seen.add(url)
                media["videos"].append(url)

    # Image URLs — 1688 alicdn patterns
    image_patterns = [
        r'(https?://cbu\d+\.alicdn\.com/[^\s"\'<>]+\.(?:jpg|jpeg|png|webp))',
        r'(https?://img\.alicdn\.com/[^\s"\'<>]+\.(?:jpg|jpeg|png|webp))',
        r'"imageUrl"\s*:\s*"([^"]+)"',
    ]
    for pat in image_patterns:
        for m in re.finditer(pat, html):
            url = m.group(1).replace("\\u002F", "/").replace("\\/", "/")
            if url.startswith("//"):
                url = "https:" + url
            if url not in seen and url.startswith("http"):
                seen.add(url)
                media["images"].append(url)

    return media


def download_file(url: str, output_path: Path) -> bool:
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=120) as resp:
            output_path.write_bytes(resp.read())
        return True
    except Exception as e:
        print(f"  ! FAIL {url}: {e}", file=sys.stderr)
        return False


def process_product(url: str, out_dir: Path, max_images: int = 30) -> dict:
    pid = extract_product_id(url) or "unknown"
    product_dir = out_dir / pid
    product_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n=== Product {pid} ===")
    print(f"URL: {url}")

    try:
        html = fetch(url)
    except Exception as e:
        print(f"  ! fetch failed: {e}", file=sys.stderr)
        return {"product_id": pid, "url": url, "error": str(e)}

    media = find_media_urls(html)
    print(f"  Found: {len(media['videos'])} videos, {len(media['images'])} images")

    # Download videos
    video_paths = []
    for i, vurl in enumerate(media["videos"][:5]):  # cap at 5 videos per product
        ext = ".mp4" if ".mp4" in vurl.lower() else ".m3u8"
        out = product_dir / f"video_{i:02d}{ext}"
        if download_file(vurl, out):
            video_paths.append(str(out.relative_to(out_dir.parent)))
            print(f"  ✓ video {i}: {out.name}")

    # Download images
    image_paths = []
    for i, iurl in enumerate(media["images"][:max_images]):
        ext_match = re.search(r"\.(jpg|jpeg|png|webp)", iurl.lower())
        ext = f".{ext_match.group(1)}" if ext_match else ".jpg"
        out = product_dir / f"img_{i:02d}{ext}"
        if download_file(iurl, out):
            image_paths.append(str(out.relative_to(out_dir.parent)))

    manifest = {
        "product_id": pid,
        "url": url,
        "videos": video_paths,
        "images_count": len(image_paths),
        "source_video_urls": media["videos"],
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    (product_dir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return manifest


def main() -> int:
    p = argparse.ArgumentParser(description="1688/Taobao product media kit downloader")
    sub = p.add_subparsers(dest="mode", required=True)

    p_single = sub.add_parser("single", help="Download media for one product URL")
    p_single.add_argument("url")
    p_single.add_argument("--out", required=True, help="Output directory")
    p_single.add_argument("--max-images", type=int, default=30)

    p_batch = sub.add_parser("batch", help="Download media for a list of URLs")
    p_batch.add_argument("url_file", help="Text file with one URL per line")
    p_batch.add_argument("--out", required=True)
    p_batch.add_argument("--max-images", type=int, default=30)
    p_batch.add_argument("--delay", type=float, default=2.0, help="Seconds between requests")

    args = p.parse_args()
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    if args.mode == "single":
        manifest = process_product(args.url, out_dir, args.max_images)
        print(json.dumps(manifest, ensure_ascii=False, indent=2))

    elif args.mode == "batch":
        urls = [l.strip() for l in Path(args.url_file).read_text(encoding="utf-8").splitlines() if l.strip() and not l.startswith("#")]
        print(f"Processing {len(urls)} URLs")
        results = []
        for i, url in enumerate(urls):
            print(f"\n[{i+1}/{len(urls)}]")
            results.append(process_product(url, out_dir, args.max_images))
            if i < len(urls) - 1:
                time.sleep(args.delay)
        (out_dir / "batch_manifest.json").write_text(
            json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        ok = sum(1 for r in results if "error" not in r)
        print(f"\nDone: {ok}/{len(urls)} products")

    return 0


if __name__ == "__main__":
    sys.exit(main())
