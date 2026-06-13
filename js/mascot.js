// Animated Mascot with Web Speech API
class Mascot {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.messages = [
      "Hey there! Ready to drive black? Let's get you earning top dollar! 🚗",
      "Ezra Mobility Group — where luxury meets opportunity!",
      "Fleet's looking sharp. Pink bumper guards and all!",
      "Uber Black? Lyft Black? We've got the rides. You've got the drive.",
      "Your passengers deserve a Navigator. You deserve the earnings.",
      "Black SUV rental designed for gig workers who want more.",
      "Start your private car service journey with Ezra today!",
      "Need a Suburban? Expedition? Escalade? We've got you covered.",
      "Pink front bumper guards — you can't miss us on the road!",
      "Built for drivers. Powered by luxury. Driven by you."
    ];

    this.currentMessage = 0;
    this.isSpeaking = false;
    this.speechSynth = window.speechSynthesis;
    this.voice = null;

    this.build();
    this.setupVoices();
    this.startWaving();
  }

  build() {
    this.container.innerHTML = `
      <div class="mascot-character mascot-waving">
        <img src="/images/mascot.svg" alt="Ezra Mascot" class="mascot-svg" id="mascotSvg">
        <div class="mascot-speech-bubble" id="speechBubble"></div>
        <button class="mascot-speech-btn" id="speechBtn">
          <span>💬</span> Ask Ezra
        </button>
      </div>
    `;

    this.bubble = document.getElementById('speechBubble');
    this.btn = document.getElementById('speechBtn');
    this.svg = document.getElementById('mascotSvg');

    this.btn.addEventListener('click', () => this.speak());
  }

  setupVoices() {
    const setVoice = () => {
      const voices = this.speechSynth.getVoices();
      this.voice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English')) || voices[0];
    };
    setVoice();
    this.speechSynth.onvoiceschanged = setVoice;
  }

  speak() {
    if (this.isSpeaking) {
      this.speechSynth.cancel();
      this.isSpeaking = false;
      this.btn.innerHTML = '<span>💬</span> Ask Ezra';
      return;
    }

    const msg = this.messages[this.currentMessage];
    this.currentMessage = (this.currentMessage + 1) % this.messages.length;

    // Show bubble
    this.bubble.textContent = msg.replace(/[^\w\s,.!?']/g, '').trim();
    this.bubble.classList.add('show');

    // Speak
    if (this.speechSynth.speaking) this.speechSynth.cancel();

    const utterance = new SpeechSynthesisUtterance(msg.replace(/[^\w\s,.!?']/g, '').trim());
    utterance.voice = this.voice;
    utterance.rate = 1.1;
    utterance.pitch = 1.2;

    this.isSpeaking = true;
    this.btn.innerHTML = '<span>⏹</span> Stop';
    this.svg.classList.add('mascot-talking');

    utterance.onend = () => {
      this.isSpeaking = false;
      this.btn.innerHTML = '<span>💬</span> Ask Ezra';
      this.svg.classList.remove('mascot-talking');
    };

    this.speechSynth.speak(utterance);
  }

  startWaving() {
    setInterval(() => {
      const char = this.container.querySelector('.mascot-character');
      if (char) {
        char.classList.add('mascot-waving');
        setTimeout(() => char.classList.remove('mascot-waving'), 2000);
      }
    }, 8000);
  }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('mascotContainer')) {
    new Mascot('mascotContainer');
  }
});
