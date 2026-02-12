from pydub.utils import mediainfo
import json
import sys
import re

python_dict = json.loads(sys.argv[1])
text = python_dict["text"]
info = mediainfo(f"./public/audio/{python_dict["fileCode"]}.mp3")
duration = float(info['duration'])

# Clean text
words = re.findall(r"\b\w+\b", text)

# Word count and average time per word
word_count = len(words)
time_per_word = duration / word_count
char_to_viseme = {
    "a": "A",
    "e": "E",
    "i": "E",
    "o": "O",
    "u": "O",
    "b": "B",
    "p": "B",
    "m": "B",
    "f": "F",
    "v": "F",
    "w": "H",
    "r": "H",
    "t": "D",
    "d": "D",
    "n": "D",
    "l": "D",
    "s": "C",
    "c": "C",
    "j": "C",
    "z": "C",
}

mouth_cues = []
time = 0.0
for word in words:
    first_char = word[0].lower()
    viseme = char_to_viseme.get(first_char, "A")
    mouth_cues.append(
        {
            "start": round(time, 2),
            "end": round(time + time_per_word, 2),
            "value": viseme,
        }
    )
    time += time_per_word

output = {
    "metadata": {"soundFile": "your_audio.ogg", "duration": duration},
    "mouthCues": mouth_cues,
}

print(json.dumps(output, indent=2))
