"""Original KeyMouse score + restrained V2 sound design. No sampled or third-party audio.

Rebuild with Python 3 and numpy: python scripts/score.py
48 seconds, 120 BPM, D minor, 48 kHz stereo. Seeded for reproducibility.
"""
from pathlib import Path
import wave
import numpy as np

SR = 48000
DURATION = 48
N = SR * DURATION
rng = np.random.default_rng(7301)
music = np.zeros((N, 2), dtype=np.float64)
effects = np.zeros_like(music)

def hz(note):
    return 440 * 2 ** ((note - 69) / 12)

def time(duration):
    return np.arange(int(duration * SR)) / SR

def place(track, signal, at, gain=1, pan=0):
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

# Warm sub, tight low drums and deliberately quiet brushed upper percussion.
for beat in np.arange(0,DURATION-2,.5):
    full=beat>=4
    t=time(.46)
    freq=49+102*np.exp(-t/.023)
    phase=2*np.pi*np.cumsum(freq)/SR
    kick=np.sin(phase)*np.exp(-t/.10)*(1-np.exp(-t/.0018))
    kick+=.035*rng.standard_normal(len(t))*np.exp(-t/.008)
    if full or beat%2==0:
        place(music,kick,beat,.36 if full else .19)
    if full and int(round(beat*2))%2:
        t=time(.18)
        noise=rng.standard_normal(len(t))
        hi=noise-np.convolve(noise,np.ones(10)/10,mode='same')
        env=(1-np.exp(-t/.002))*(np.exp(-t/.025)+.35*np.exp(-((t-.022)/.009)**2))
        place(music,hi*env,beat,.022,pan=.12)
    if full:
        for step in [0,.25]:
            t=time(.095 if step==0 else .15)
            noise=rng.standard_normal(len(t))
            hi=noise-np.convolve(noise,np.ones(4)/4,mode='same')
            env=np.exp(-t/(.014 if step==0 else .031))*(1-np.exp(-t/.001))
            place(music,hi*env,beat+step,.018 if step==0 else .026,pan=-.35 if step==0 else .35)

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

# V2: no air sweeps, reverse noise, risers, or sound on continuous motion.
# Soft low-register tine accents replace the transition swipes.
def tine(at, note=62, level=.11):
    t=time(.7)
    f=hz(note)
    signal=(np.sin(2*np.pi*f*t)+.14*np.sin(2*np.pi*f*3*t)*np.exp(-t/.08))
    signal*=(1-np.exp(-t/.012))*np.exp(-t/.16)
    place(effects,signal,at,level,-.12)
    place(effects,signal,at+.14,level*.13,.2)

for at in [4,14,20,34,40,44]:
    tine(at,62,.10)

def confirm(at):
    tine(at,74,.105)
    tine(at+.085,77,.075)

tine(.18,62,.08)
# Discrete presses only; the continuous cursor and canvas are intentionally quiet.
for at,note in [(5.2,74),(5.7,72),(6.2,76),(6.7,77),
                (7.35,74),(7.9,77),(8.45,81)]:
    tine(at,note,.045)
tine(21.54,69,.07)
confirm(23.85)
tine(25.95,74,.06)
tine(26.3,77,.06)
tine(29.31,69,.08)
confirm(31.27)
confirm(32.6)
tine(34.85,62,.08)
confirm(37.9)
tine(41.8,77,.065)
confirm(44.5)

# Lightweight sidechain gives the score its pulse without masking the UI accents.
ts=np.arange(N)/SR
duck=.72+.28*(1-np.exp(-np.mod(ts,.5)/.07))
music*=duck[:,None]
fadein=np.minimum(ts/.25,1)
fadeout=np.clip((DURATION-ts)/1.6,0,1)
music*=fadein[:,None]*fadeout[:,None]
effects*=np.minimum((DURATION-ts)/.18,1)[:,None]

def write(name,track,peak):
    track=np.tanh(track*1.1)
    track*=peak/max(np.max(np.abs(track)),.001)
    pcm=(np.clip(track,-1,1)*32767).astype('<i2')
    out=Path(__file__).resolve().parents[1]/'public'/'audio'/name
    with wave.open(str(out),'wb') as wav:
        wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(SR);wav.writeframes(pcm.tobytes())
    rms=np.sqrt(np.mean(track**2))
    print(f'{name}: {DURATION}s stereo / peak {20*np.log10(np.max(np.abs(track))):.1f} dBFS / RMS {20*np.log10(rms):.1f} dBFS')

write('in-full-control.wav',music,.70)
write('sound-design.wav',effects,.43)
