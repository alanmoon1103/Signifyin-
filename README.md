# Signifyin' — Black Sound Across Centuries
## Capstone Website

### Setup in VS Code
1. Open this folder in VS Code
2. Install the "Live Server" extension (if not already installed)
3. Right-click index.html → "Open with Live Server"

---

### Adding Images (album covers)
Drop files into `assets/images/` with these exact names:

| Era                  | Files                          |
|----------------------|--------------------------------|
| Western African Oral | wa-01.jpg … wa-05.jpg          |
| Slave Songs          | ss-01.jpg … ss-05.jpg          |
| Black Preaching      | bp-01.jpg … bp-05.jpg          |
| Harlem Renaissance   | hr-01.jpg … hr-05.jpg          |
| Black Arts Movement  | bam-01.jpg … bam-05.jpg        |
| Hip-Hop              | hh-01.jpg … hh-05.jpg          |

Any standard image format works (jpg, png, webp).

---

### Adding Audio
Drop MP3 files into `assets/audio/` with these exact names:

| Era                  | Files                          |
|----------------------|--------------------------------|
| Western African Oral | wa-01.mp3 … wa-05.mp3          |
| Slave Songs          | ss-01.mp3 … ss-05.mp3          |
| Black Preaching      | bp-01.mp3 … bp-05.mp3          |
| Harlem Renaissance   | hr-01.mp3 … hr-05.mp3          |
| Black Arts Movement  | bam-01.mp3 … bam-05.mp3        |
| Hip-Hop              | hh-01.mp3 … hh-05.mp3          |

---

### Editing Track Titles & Artists
In index.html, find each card and edit:
  data-title="Edit Title"   ← track/speech/song name
  data-artist="Edit Artist" ← artist/speaker name

These appear on hover (desktop) or always visible (mobile).

---

### Controls
- Desktop: scroll wheel OR click-drag the strip left/right
- Keyboard: arrow keys scroll the strip
- Bottom-left rectangles: jump to any era instantly
- Bottom bar: play/pause, ±15s skip, progress bar (click to seek)
- Mobile: natural vertical scroll, 2-column grid per era
