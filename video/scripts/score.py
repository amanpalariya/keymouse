"""Original KeyMouse score + sound design. No sampled or third-party audio.

Rebuild with Python 3 and numpy: python scripts/score.py
40 seconds, 120 BPM, D minor, 48 kHz stereo. Seeded for reproducibility.
"""
from pathlib import Path
import wave
import numpy as np

SR = 48000
DURATION = 40
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

def air(duration=.5, rising=False):
    t = time(duration)
    noise = rng.standard_normal(len(t))
    smooth = np.convolve(noise,np.ones(18)/18,mode='same')
    band = np.convolve(noise,np.ones(3)/3,mode='same')-smooth
    env = np.sin(np.pi*t/duration)**2
    return band*env*(.25+.75*t/duration if rising else 1)

# Suspended, wide pads. Chord changes every four seconds.
chords = [[50,57,60,64,69],[46,53,57,60,65],[53,60,64,67,72],[48,55,60,62,67]]
for bar in range(10):
    at = bar*4
    t = time(5.8)
    envelope=(1-np.exp(-t/.5))*np.exp(-np.maximum(t-3.65,0)/.7)
    tone=np.zeros((len(t),2))
    for i,note in enumerate(chords[bar%4][1:]):
        f=hz(note+12)
        for channel,detune in enumerate([-.0015,.0015]):
            tone[:,channel] += (np.sin(2*np.pi*f*(1+detune)*t+.1*i)+.15*np.sin(2*np.pi*f*2*t))*envelope/4
    place(music,tone,at,gain=.115 if at<36 else .16)

# Warm sub, tight low drums and deliberately quiet brushed upper percussion.
for beat in np.arange(0,38,.5):
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
for bar in range(2,19):
    root=roots[(bar//2)%4]
    for offset,length,level,note in [(0,.35,.19,root),(.75,.22,.15,root),(1.25,.32,.15,root+12),(1.75,.2,.14,root)]:
        t=time(length+.12)
        env=(1-np.exp(-t/.007))*np.exp(-np.maximum(t-length+.05,0)/.035)
        tone=(np.sin(2*np.pi*hz(note)*t)+.17*np.sin(4*np.pi*hz(note)*t))
        place(music,tone*env,bar*2+offset,level)

# A sparse D-minor motif, leaving the UI demonstrations room to breathe.
motif=[74,None,81,77,None,72,76,None,74,69,None,72,77,None,76,72]
for step in range(16,144):
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

# Low, luminous downbeats and stereo reverse air across each editorial cut.
for at in [4,10,16,22,26,32,36]:
    sweep=air(.52,True)
    place(effects,sweep,at-.36,.16,-.35)
    place(effects,sweep[::-1],at-.05,.11,.35)
    t=time(.6)
    thump=np.sin(2*np.pi*(58*t+1.3*(1-np.exp(-t/.07))))*np.exp(-t/.15)*(1-np.exp(-t/.004))
    place(effects,thump,at,.17)

# Sonic identity: soft glass, tuned confirmations, no mouse-click samples.
def glass(at,note=86,level=.15):
    t=time(.7)
    f=hz(note)
    signal=(np.sin(2*np.pi*f*t)*np.exp(-t/.16)+.28*np.sin(2*np.pi*f*2.71*t)*np.exp(-t/.055))*(1-np.exp(-t/.003))
    place(effects,signal,at,level,-.15)
    place(effects,signal,at+.12,level*.24,.4)

def confirm(at):
    place(effects,pluck(81,.65,True),at,.19,-.25)
    place(effects,pluck(86,.85,True),at+.085,.15,.25)

glass(.18,74,.13)
place(effects,air(.85,True),.05,.14)
glass(4.25,86,.13)
confirm(8.5)
for at in [10.8,12.9,14.2]:
    place(effects,air(.42),at,.08,pan=.2)
glass(17.1,81,.11)
confirm(18.75)
glass(20.25,86,.095)
glass(20.5,89,.08)
glass(22.65,81,.12)
confirm(24.05)
confirm(25)
glass(26.85,74,.13)
place(effects,air(1.8),27.3,.06)
confirm(29.9)
place(effects,air(.8,True),32.3,.11)
glass(33.8,89,.10)
confirm(36.5)
place(effects,air(.85,True),38.8,.20)

# Lightweight sidechain gives the score its pulse without masking the UI accents.
ts=np.arange(N)/SR
duck=.72+.28*(1-np.exp(-np.mod(ts,.5)/.07))
music*=duck[:,None]
fadein=np.minimum(ts/.25,1)
fadeout=np.clip((40-ts)/1.6,0,1)
music*=fadein[:,None]*fadeout[:,None]
effects*=np.minimum((40-ts)/.18,1)[:,None]

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
