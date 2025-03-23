// audio.js - Gestion des effets sonores et de la musique de fond

class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.isMuted = false;
        
        // Créer le contexte audio
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Initialiser les sons
        this.initSounds();
    }
    
    async initSounds() {
        // Création des sons 8-bit/16-bit
        this.createRetroSound('select', {
            type: 'square',
            frequency: 440,
            duration: 0.1,
            attack: 0.01,
            decay: 0.1,
            volume: 0.3
        });
        
        this.createRetroSound('confirm', {
            type: 'square',
            frequency: 660,
            duration: 0.2,
            attack: 0.01,
            decay: 0.1,
            volume: 0.3,
            steps: [
                { frequency: 440, time: 0 },
                { frequency: 660, time: 0.1 }
            ]
        });
        
        this.createRetroSound('cancel', {
            type: 'square',
            frequency: 220,
            duration: 0.2,
            attack: 0.01,
            decay: 0.1,
            volume: 0.3,
            steps: [
                { frequency: 330, time: 0 },
                { frequency: 220, time: 0.1 }
            ]
        });
        
        this.createRetroSound('navigate', {
            type: 'square',
            frequency: 330,
            duration: 0.05,
            attack: 0.01,
            decay: 0.05,
            volume: 0.2
        });
        
        this.createRetroSound('buy', {
            type: 'square',
            frequency: 660,
            duration: 0.5,
            attack: 0.01,
            decay: 0.5,
            volume: 0.3,
            steps: [
                { frequency: 440, time: 0 },
                { frequency: 554, time: 0.1 },
                { frequency: 660, time: 0.2 },
                { frequency: 880, time: 0.3 }
            ]
        });
        
        this.createRetroSound('error', {
            type: 'square',
            frequency: 110,
            duration: 0.3,
            attack: 0.01,
            decay: 0.3,
            volume: 0.3,
            steps: [
                { frequency: 220, time: 0 },
                { frequency: 110, time: 0.1 }
            ]
        });
        
        // Créer une musique d'ambiance rétro
        this.createRetroMusic();
    }
    
    createRetroSound(name, options) {
        const sound = {
            buffer: null,
            options: options
        };
        
        // Créer un buffer pour le son
        const duration = options.duration || 0.2;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        // Générer la forme d'onde
        const type = options.type || 'square';
        const steps = options.steps || [{ frequency: options.frequency, time: 0 }];
        
        for (let i = 0; i < data.length; i++) {
            const time = i / sampleRate;
            
            // Trouver l'étape actuelle
            let currentFrequency = options.frequency;
            for (let j = steps.length - 1; j >= 0; j--) {
                if (time >= steps[j].time) {
                    currentFrequency = steps[j].frequency;
                    break;
                }
            }
            
            // Appliquer l'enveloppe ADSR simplifiée
            let envelope = 1;
            if (time < options.attack) {
                envelope = time / options.attack;
            } else if (time < options.attack + options.decay) {
                envelope = 1 - (1 - options.sustain) * ((time - options.attack) / options.decay);
            } else if (time > duration - options.release) {
                envelope = (1 - (time - (duration - options.release)) / options.release) * options.sustain;
            } else {
                envelope = options.sustain || 0.7;
            }
            
            // Générer la forme d'onde
            const t = time * currentFrequency;
            let wave = 0;
            
            switch (type) {
                case 'sine':
                    wave = Math.sin(t * 2 * Math.PI);
                    break;
                case 'square':
                    wave = Math.sign(Math.sin(t * 2 * Math.PI));
                    break;
                case 'sawtooth':
                    wave = 2 * (t % 1) - 1;
                    break;
                case 'triangle':
                    wave = 2 * Math.abs(2 * (t % 1) - 1) - 1;
                    break;
                case 'noise':
                    wave = Math.random() * 2 - 1;
                    break;
            }
            
            // Appliquer l'enveloppe
            data[i] = wave * envelope * (options.volume || 1);
        }
        
        sound.buffer = buffer;
        this.sounds[name] = sound;
    }
    
    createRetroMusic() {
        // Créer une séquence musicale simple en style rétro
        const musicSequence = [
            { note: 'C4', duration: 0.2, time: 0 },
            { note: 'E4', duration: 0.2, time: 0.25 },
            { note: 'G4', duration: 0.2, time: 0.5 },
            { note: 'B4', duration: 0.2, time: 0.75 },
            { note: 'C5', duration: 0.2, time: 1 },
            { note: 'B4', duration: 0.2, time: 1.25 },
            { note: 'G4', duration: 0.2, time: 1.5 },
            { note: 'E4', duration: 0.2, time: 1.75 },
            
            { note: 'A3', duration: 0.2, time: 2 },
            { note: 'C4', duration: 0.2, time: 2.25 },
            { note: 'E4', duration: 0.2, time: 2.5 },
            { note: 'G4', duration: 0.2, time: 2.75 },
            { note: 'A4', duration: 0.2, time: 3 },
            { note: 'G4', duration: 0.2, time: 3.25 },
            { note: 'E4', duration: 0.2, time: 3.5 },
            { note: 'C4', duration: 0.2, time: 3.75 }
        ];
        
        const totalDuration = 4; // 4 secondes par boucle
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * totalDuration, sampleRate);
        const data = buffer.getChannelData(0);
        
        // Mapper les noms de notes aux fréquences
        const noteToFreq = {
            'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77
        };
        
        // Remplir le buffer avec la séquence
        for (const note of musicSequence) {
            const freq = noteToFreq[note.note];
            const startSample = Math.floor(note.time * sampleRate);
            const endSample = Math.floor((note.time + note.duration) * sampleRate);
            
            for (let i = startSample; i < endSample && i < data.length; i++) {
                const t = (i - startSample) / sampleRate;
                
                // Enveloppe simple
                let envelope = 1;
                if (t < 0.01) {
                    envelope = t / 0.01;
                } else if (t > note.duration - 0.05) {
                    envelope = (note.duration - t) / 0.05;
                }
                
                // Forme d'onde carrée
                const wave = Math.sign(Math.sin(t * freq * 2 * Math.PI));
                
                // Mélanger avec le son existant
                data[i] += wave * envelope * 0.15;
            }
        }
        
        // Ajouter une ligne de basse simple
        const bassSequence = [
            { note: 'C3', duration: 0.5, time: 0 },
            { note: 'G3', duration: 0.5, time: 0.5 },
            { note: 'A3', duration: 0.5, time: 2 },
            { note: 'E3', duration: 0.5, time: 2.5 }
        ];
        
        for (const note of bassSequence) {
            const freq = noteToFreq[note.note];
            const startSample = Math.floor(note.time * sampleRate);
            const endSample = Math.floor((note.time + note.duration) * sampleRate);
            
            for (let i = startSample; i < endSample && i < data.length; i++) {
                const t = (i - startSample) / sampleRate;
                
                // Enveloppe simple
                let envelope = 1;
                if (t < 0.02) {
                    envelope = t / 0.02;
                } else if (t > note.duration - 0.1) {
                    envelope = (note.duration - t) / 0.1;
                }
                
                // Forme d'onde en dent de scie
                const wave = 2 * ((t * freq) % 1) - 1;
                
                // Mélanger avec le son existant
                data[i] += wave * envelope * 0.2;
            }
        }
        
        // Normaliser pour éviter l'écrêtage
        let max = 0;
        for (let i = 0; i < data.length; i++) {
            max = Math.max(max, Math.abs(data[i]));
        }
        
        if (max > 0) {
            for (let i = 0; i < data.length; i++) {
                data[i] = data[i] / max * 0.7;
            }
        }
        
        this.music = {
            buffer: buffer,
            source: null,
            isPlaying: false
        };
    }
    
    playSound(name) {
        if (this.isMuted) return;
        
        const sound = this.sounds[name];
        if (!sound) return;
        
        const source = this.audioContext.createBufferSource();
        source.buffer = sound.buffer;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.sfxVolume;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start();
    }
    
    playMusic() {
        if (this.isMuted || !this.music) return;
        
        if (this.music.isPlaying) {
            this.stopMusic();
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = this.music.buffer;
        source.loop = true;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.musicVolume;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start();
        
        this.music.source = source;
        this.music.gainNode = gainNode;
        this.music.isPlaying = true;
    }
    
    stopMusic() {
        if (!this.music || !this.music.isPlaying) return;
        
        this.music.source.stop();
        this.music.isPlaying = false;
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopMusic();
        } else {
            this.playMusic();
        }
        
        return this.isMuted;
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        if (this.music && this.music.isPlaying && this.music.gainNode) {
            this.music.gainNode.gain.value = this.musicVolume;
        }
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
}