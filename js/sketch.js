function setup() {
  createCanvas(400, 400);
  getAudioContext().suspend();
  let mySynth = new p5.MonoSynth();

  const startTime = (new Date).getTime() / 1000;

  // This won't play until the context has resumed
  mySynth.play('A6');

  // beatdetektor stuff

  bd_med = new BeatDetektor(85,169);

  vu = new BeatDetektor.modules.vis.VU();
  kick_det = new BeatDetektor.modules.vis.BassKick();

  // p5 stuff
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);

  funk = function(){
    spectrum = fft.analyze();

    const currentTime = (new Date).getTime() / 1000;
    const timer_seoncds = currentTime-startTime;
    bd_med.process(timer_seoncds, spectrum)
  }

  // analyse with 60 frames, we could maybe use requestAnimationFrame here
  setInterval( funk, 1000/60 )
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  text(getAudioContext().state, width/2, height/2);
}

function mousePressed() {
  userStartAudio();
  bd_med.reset();
}