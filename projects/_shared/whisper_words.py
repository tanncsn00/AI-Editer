"""Per-beat whisper word-timestamps → global. Mỗi beat clip ngắn nên KHÔNG hallucination,
KHÔNG cần chunk 35s. Timestamp mỗi beat + start offset từ segments.json."""
import io,json,sys,subprocess
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding="utf-8")
from faster_whisper import WhisperModel
m=WhisperModel("large-v3",device="cpu",compute_type="int8")
seg=json.load(open("segments.json",encoding="utf-8"))["segments"]
allw=[]
for s in seg:
    mp3=f"tts/beat_{s['index']:02d}.mp3"
    segs,_=m.transcribe(mp3,language="vi",word_timestamps=True,beam_size=5,condition_on_previous_text=False)
    n=0
    for sg in segs:
        for w in sg.words:
            allw.append({"t":round(s["start"]+w.start,3),"w":w.word}); n+=1
    print(f"  beat {s['index']:02d} {s['name']:<11} words={n}")
allw.sort(key=lambda x:x["t"])
json.dump(allw,open("whisper_words.json","w",encoding="utf-8"),ensure_ascii=False,indent=1)
print("total words:",len(allw))
low=" ".join(x["w"] for x in allw).lower()
print("subscribe halluc:", any(k in low for k in ["subscribe","ghiền","mì gõ","đăng ký kênh","nhận thông tin"]))
