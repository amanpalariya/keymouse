"""Original KeyMouse score + V5 soundtrack: original music with noise percussion removed. No sampled or third-party audio.

Rebuild with Python 3 and numpy: python scripts/score.py
59 seconds, 120 BPM, D minor, 48 kHz stereo. Deterministic synthesis.
"""
from pathlib import Path
import wave
import numpy as np

SR = 48000
DURATION = 59
N = SR * DURATION
music = np.zeros((N, 2), dtype=np.float64)
effects = np.zeros_like(music)

def hz(note):
    return 440 * 2 ** ((note - 69) / 12)

def time(duration):
    return np.arange(int(duration * SR)) / SR

def place(track, signal, at, gain=1, pan=0):
    if track is effects:
        if at < 4: pass
        elif at < 14: at = 4 + np.interp(at-4,[0,7,10.625],[0,5.6,7.5])
        elif at < 40: at = 11 + np.interp(at-14,[0,3.4,5,6.4,7.7,8.5,10.5,12.5,13.7,15.5,18.8,20,21.5,22.2,24,26],[0,3,3.4,4.6,5.1,6.2,7.2,8.8,9.2,10.5,11,12.4,13,14.1,15.4,18])
        elif at < 62: at = 29 + (at-40)*19/22
        elif at < 74:
            old=np.interp(at-62,[0,1.15,2.15,5.4,6.4,8,12],[0,1.15,1.15,4.4,4.4,6,10])
            at=48+np.interp(old,[0,.85,1.25,3.6,3.9,4.4,6.5,6.9,8.6,8.9,10],[0,.65,.9,2.65,3,3.25,3.4,3.65,5.3,5.6,7])
        else: at = 55 + (at-74)
    start = int(at * SR)
    offset = max(0, -start)
    start = max(0, start)
    count = min(len(signal) - offset, len(track) - start)
    if count <= 0:
        return
    signal = signal[offset:offset+count]
    if signal.ndim == 1:
        stereo = signal[:, None] * np.array([np.cos((pan+1)*np.pi/4), np.sin((pan+1)*np.pi/4)])[None, :]
    else:
        stereo = signal
    track[start:start+count] += stereo * gain

def pluck(note, duration=.8, soft=False):
    t = time(duration)
    f = hz(note)
    env = (1-np.exp(-t/0.004))*np.exp(-t/(.38 if soft else .19))
    # Rounded FM mallet with a brief upper partial rather than a click transient.
    body = np.sin(2*np.pi*f*t + 1.2*np.exp(-t/.1)*np.sin(2*np.pi*f*2*t))
    body += .13*np.sin(2*np.pi*f*3*t)*np.exp(-t/.09)
    return body*env

# Suspended, wide pads. Chord changes every four seconds.
chords = [[50,57,60,64,69],[46,53,57,60,65],[53,60,64,67,72],[48,55,60,62,67]]
for bar in range((DURATION+3)//4):
    at = bar*4
    t = time(5.8)
    envelope=(1-np.exp(-t/.5))*np.exp(-np.maximum(t-3.65,0)/.7)
    tone=np.zeros((len(t),2))
    for i,note in enumerate(chords[bar%4][1:]):
        f=hz(note+12)
        for channel,detune in enumerate([-.0015,.0015]):
            tone[:,channel] += (np.sin(2*np.pi*f*(1+detune)*t+.1*i)+.15*np.sin(2*np.pi*f*2*t))*envelope/4
    place(music,tone,at,gain=.115 if at<DURATION-4 else .16)

# Original low rhythm, with only noise-based percussion removed.
for beat in np.arange(0,DURATION-2,.5):
    full=beat>=4
    t=time(.46)
    freq=49+102*np.exp(-t/.023)
    phase=2*np.pi*np.cumsum(freq)/SR
    kick=np.sin(phase)*np.exp(-t/.10)*(1-np.exp(-t/.0018))
    if full or beat%2==0:
        place(music,kick,beat,.36 if full else .19)
roots=[38,34,41,36]
for bar in range(2,DURATION//2-1):
    root=roots[(bar//2)%4]
    for offset,length,level,note in [(0,.35,.19,root),(.75,.22,.15,root),(1.25,.32,.15,root+12),(1.75,.2,.14,root)]:
        t=time(length+.12)
        env=(1-np.exp(-t/.007))*np.exp(-np.maximum(t-length+.05,0)/.035)
        tone=(np.sin(2*np.pi*hz(note)*t)+.17*np.sin(4*np.pi*hz(note)*t))
        place(music,tone*env,bar*2+offset,level)

# A sparse D-minor motif, leaving the UI demonstrations room to breathe.
motif=[74,None,81,77,None,72,76,None,74,69,None,72,77,None,76,72]
for step in range(16,(DURATION-4)*4):
    note=motif[step%16]
    if note is None:
        continue
    at=step*.25
    gain=.055 if step%4 else .085
    signal=pluck(note,1.15,soft=True)
    pan=(-.35 if step%2 else .35)
    place(music,signal,at,gain,pan)
    place(music,signal,at+.375,gain*.24,-pan)
    place(music,signal,at+.75,gain*.10,pan)

# Discrete, quiet tonal accents. The musical melody and bass above are unchanged.
def tine(at,note=62,level=.08):
    t=time(.7)
    f=hz(note)
    signal=(np.sin(2*np.pi*f*t)+.14*np.sin(2*np.pi*f*3*t)*np.exp(-t/.08))
    signal*=(1-np.exp(-t/.012))*np.exp(-t/.16)
    place(effects,signal,at,level,-.1)
    place(effects,signal,at+.14,level*.1,.2)
def confirm(at):
    tine(at,69,.065)
    tine(at+.11,74,.045)
for at in [4,14,40,62,74]:tine(at,62,.06)
tine(.18,62,.045)
for at,note in [(5.2,65),(5.7,62),(6.2,67),(6.7,69),(7.7,65),(8.65,69),(9.6,74)]:tine(at,note,.035)
# Research workflow: select a depth fact, copy, save a photo, compare lakes.
tine(16,69,.035)
tine(19,65,.045)
confirm(21.4)
tine(24.5,65,.045)
tine(27.4,69,.035)
confirm(29.2)
tine(34,69,.045)
confirm(35.5)
# One uninterrupted photo editor: canvas scroll, then two precise repairs.
tine(50.1,67,.03)
tine(51.5,62,.03)
confirm(53.2)
tine(55.8,67,.03)
tine(57.7,62,.03)
confirm(59.4)
# Horizontal drop, then vertical reorder of the same card.
tine(62.85,62,.04)
confirm(66.9)
tine(70.5,62,.04)
confirm(72.9)
confirm(74.5)
ts=np.arange(N)/SR
music*=(.72+.28*(1-np.exp(-np.mod(ts,.5)/.07)))[:,None]
music*=np.minimum(ts/.25,1)[:,None]*np.clip((DURATION-ts)/1.6,0,1)[:,None]
effects*=np.clip((DURATION-ts)/.18,0,1)[:,None]
def write(name,track,peak):
    track=np.tanh(track*1.1)
    track*=peak/max(np.max(np.abs(track)),.001)
    pcm=(np.clip(track,-1,1)*32767).astype('<i2')
    out=Path(__file__).resolve().parents[1]/'public'/'audio'/name
    with wave.open(str(out),'wb') as wav:
        wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(SR);wav.writeframes(pcm.tobytes())
    print(f'{name}: {DURATION}s stereo, peak {20*np.log10(np.max(np.abs(track))):.1f} dBFS, RMS {20*np.log10(np.sqrt(np.mean(track**2))):.1f} dBFS')
write('in-full-control-original-clean-v8.wav',music,.70)
write('workflow-accents-v8.wav',effects,.32)
