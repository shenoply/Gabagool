from pathlib import Path
p=Path(__file__).resolve().parents[1];f=p/'index.html';s=f.read_text();a='// BEGIN BACKYARD78';b='// END BACKYARD78'
if a in s:s=s[:s.index(a)]+s[s.index(b)+len(b):]
marker='// All declarations and extension state are ready before constructing the title.'
s=s.replace(marker,a+'\n'+(p/'backyard78.js').read_text()+'\n'+b+'\n'+marker);f.write_text(s)
