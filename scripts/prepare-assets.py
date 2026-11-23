import json
import os
import re
import shutil
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = os.getcwd()
SOURCE = ROOT
PUBLIC = os.path.join(ROOT, 'public', 'assets', 'videos')
LOGO_SOURCE = os.path.join(ROOT, 'logo.png')
LOGO_TARGET = os.path.join(ROOT, 'public', 'assets', 'logo', 'logo.png')
MANIFEST = os.path.join(ROOT, 'src', 'data', 'portfolio.js')

CATEGORIES = [
    ('ai-edits', 'Ai Edits', 'AI Edits'),
    ('car-edits', 'Car Edits', 'Car Edits'),
    ('event-edits', 'Event Edits', 'Event Edits'),
    ('industrial-production', 'Industrial Production Edits', 'Industrial Production'),
    ('influencer-edits', 'Influencer Edits', 'Influencer Edits'),
    ('politics-edits', 'Politics Edits', 'Politics Edits'),
    ('product-edits', 'Product Edits', 'Product Edits'),
    ('promotional-edits', 'Promotional Edits', 'Promotional Edits'),
    ('recent-work', 'Visuark - Recent Work', 'Recent Work'),
]

VIDEO_EXTENSIONS = {'.mov', '.mp4'}


def run(command):
    subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def probe(path):
    output = subprocess.check_output([
        'ffprobe', '-v', 'error', '-select_streams', 'v:0',
        '-show_entries', 'stream=codec_name,width,height:format=duration',
        '-of', 'json', path,
    ], text=True)
    data = json.loads(output)
    stream = data['streams'][0]
    return {
        'codec': stream.get('codec_name'),
        'width': int(stream.get('width', 0)),
        'height': int(stream.get('height', 0)),
        'duration': round(float(data['format'].get('duration', 0)), 2),
    }


def display_title(stem):
    value = re.sub(r'^copy_', '', stem, flags=re.IGNORECASE)
    value = re.sub(r'\s*[-–]\s*R⤓Download$', '', value, flags=re.IGNORECASE)
    uuid_match = re.match(r'^([0-9a-fA-F]{8})-[0-9a-fA-F-]+$', value)
    if uuid_match:
        return uuid_match.group(1).upper()
    if re.fullmatch(r'[0-9a-fA-F]{16,}', value):
        return value[:8].upper()
    value = value.lstrip('@').replace('_', ' ').replace('-', ' ')
    value = re.sub(r'\s+', ' ', value).strip()
    if value.islower():
        value = value.title()
    return value or 'Untitled'


def scale_filter(width, height, max_dimension):
    if width >= height:
        target_w = min(width, max_dimension)
        target_h = max(2, round(height * target_w / width / 2) * 2)
    else:
        target_h = min(height, max_dimension)
        target_w = max(2, round(width * target_h / height / 2) * 2)
    return f'scale={target_w}:{target_h}:flags=lanczos'


def prepare(item):
    entry = item['entry']
    source = item['source']
    folder = os.path.join(PUBLIC, entry['category'])
    os.makedirs(folder, exist_ok=True)
    base = os.path.join(folder, entry['id'])
    full = base + '.mp4'
    preview = base + '-preview.mp4'
    poster = base + '-poster.jpg'

    info = probe(source)
    is_h264 = info['codec'] == 'h264'
    full_command = ['ffmpeg', '-y', '-v', 'error', '-i', source]
    if is_h264:
        full_command += ['-c', 'copy', '-movflags', '+faststart', full]
    else:
        full_command += [
            '-map', '0:v:0', '-map', '0:a:0?',
            '-vf', scale_filter(info['width'], info['height'], 1600 if info['width'] >= info['height'] else 1920),
            '-c:v', 'libx264', '-preset', 'faster', '-crf', '26',
            '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k',
            '-movflags', '+faststart', full,
        ]
    run(full_command)

    run([
        'ffmpeg', '-y', '-v', 'error', '-i', source, '-t', '6',
        '-vf', scale_filter(info['width'], info['height'], 640 if info['width'] >= info['height'] else 360),
        '-an', '-r', '24', '-c:v', 'libx264', '-preset', 'veryfast',
        '-crf', '30', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', preview,
    ])

    seek = min(max(info['duration'] * 0.18, 0.4), 8)
    run([
        'ffmpeg', '-y', '-v', 'error', '-ss', str(seek), '-i', source,
        '-frames:v', '1', '-q:v', '4',
        '-vf', scale_filter(info['width'], info['height'], 960 if info['width'] >= info['height'] else 540),
        poster,
    ])

    entry.update({
        'src': f'assets/videos/{entry["category"]}/{entry["id"]}.mp4',
        'previewSrc': f'assets/videos/{entry["category"]}/{entry["id"]}-preview.mp4',
        'poster': f'assets/videos/{entry["category"]}/{entry["id"]}-poster.jpg',
        'duration': info['duration'],
        'width': info['width'],
        'height': info['height'],
        'orientation': 'landscape' if info['width'] >= info['height'] else 'portrait',
        'sourceCodec': info['codec'],
        'deliveryCodec': 'h264' if is_h264 else 'h264-transcoded',
    })
    return entry


def main():
    if not os.path.isdir(SOURCE):
        raise SystemExit(f'Missing source directory: {SOURCE}')

    os.makedirs(PUBLIC, exist_ok=True)
    os.makedirs(os.path.dirname(LOGO_TARGET), exist_ok=True)
    shutil.copy2(LOGO_SOURCE, LOGO_TARGET)

    categories = []
    jobs = []
    for number, (category_id, folder_name, display_name) in enumerate(CATEGORIES, start=1):
        folder = os.path.join(SOURCE, folder_name)
        filenames = sorted(
            name for name in os.listdir(folder)
            if os.path.splitext(name)[1].lower() in VIDEO_EXTENSIONS
        )
        video_ids = []
        for index, filename in enumerate(filenames, start=1):
            stem = os.path.splitext(filename)[0]
            entry = {
                'id': f'{category_id}-{index:02d}',
                'title': display_title(stem),
                'category': category_id,
                'categoryLabel': display_name,
                'index': index,
                'originalName': filename,
                'originalPath': os.path.join(folder_name, filename).replace(os.sep, '/'),
            }
            video_ids.append(entry['id'])
            jobs.append({'entry': entry, 'source': os.path.join(folder, filename)})

        categories.append({
            'id': category_id,
            'name': display_name,
            'number': f'{number:02d}',
            'count': len(filenames),
            'videoIds': video_ids,
            'coverId': video_ids[0] if video_ids else None,
        })

    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = [pool.submit(prepare, job) for job in jobs]
        videos = []
        for future in as_completed(futures):
            videos.append(future.result())

    order = {job['entry']['id']: index for index, job in enumerate(jobs)}
    videos.sort(key=lambda video: order[video['id']])

    landscape = next((video for video in videos if video['orientation'] == 'landscape'), videos[0])
    recent_h264 = next(
        (video for video in videos if video['category'] == 'recent-work' and video['sourceCodec'] == 'h264'),
        landscape,
    )

    manifest = {
        'site': {
            'name': 'VISUARK',
            'logo': 'assets/logo/logo.png',
            'description': 'Visual storytelling, creative editing and production that make brands impossible to ignore.',
        },
        'categories': categories,
        'videos': videos,
        'hero': {'videoId': landscape['id']},
        'showreel': {'videoId': recent_h264['id']},
        'featuredIds': [
            videos[0]['id'],
            next(v for v in videos if v['category'] == 'car-edits')['id'],
            next(v for v in videos if v['category'] == 'product-edits')['id'],
            next(v for v in videos if v['category'] == 'event-edits')['id'],
        ],
    }

    with open(MANIFEST, 'w', encoding='utf-8') as output:
        output.write('export const portfolio = ')
        json.dump(manifest, output, indent=2, ensure_ascii=False)
        output.write('\n\nexport default portfolio\n')

    unsupported = [v['originalPath'] for v in videos if v['sourceCodec'] == 'hevc']
    print(f'Prepared {len(videos)} videos across {len(categories)} categories.')
    print(f'Unsupported HEVC originals converted to H.264: {len(unsupported)}')
    for path in unsupported:
        print(f'  - {path}')
    print(f'Manifest: {os.path.relpath(MANIFEST, ROOT)}')


if __name__ == '__main__':
    main()
