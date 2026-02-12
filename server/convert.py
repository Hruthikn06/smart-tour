from g2p_en import G2p
from pydub.utils import mediainfo
import json
import sys

python_dict = json.loads(sys.argv[1])
text = python_dict["text"]
info = mediainfo(f"./public/audio/{python_dict["fileCode"]}.mp3")
duration = float(info['duration'])

# G2P conversion
g2p = G2p()
phonemes = [p for p in g2p(text) if p.isalpha()]  # filter out punctuation
total_phonemes = len(phonemes)

# Estimate timings
time_per_phoneme = duration / total_phonemes
mouth_cues = []
phoneme_to_viseme = {
    "AA": "A", "AE": "A", "AH": "A", "AO": "A",
    "B": "B", "P": "B", "M": "B",
    "CH": "C", "SH": "C", "JH": "C",
    "D": "D", "T": "D", "N": "D", "L": "D",
    "EH": "E", "IY": "E", "IH": "E",
    "F": "F", "V": "F",
    "G": "G", "K": "G", "NG": "G",
    "OW": "H", "UW": "H", "W": "H", "R": "H",
    # fallback
    "default": "A"
}

# Generate mouth cues
time = 0.0
for phoneme in phonemes:
    viseme = phoneme_to_viseme.get(phoneme.upper(), "A")
    mouth_cues.append({
        "start": round(time, 2),
        "end": round(time + time_per_phoneme, 2),
        "value": viseme
    })
    time += time_per_phoneme

output = {
    "metadata": {
        "soundFile": "your_audio.ogg",
        "duration": duration
    },
    "mouthCues": mouth_cues
}

print(json.dumps(output, indent=2))
