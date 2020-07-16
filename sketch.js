// Daniel Shiffman
// Neuro-Evolution Flappy Bird with TensorFlow.js
// http://thecodingtrain.com
// https://youtu.be/cdUNkwXx-I4

let TOTAL = parseInt(sessionStorage.getItem('POPULATION'), 10) || 10;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;
let slider;
let paused = false;
let score = 0;
let record = 0;
let generation = 0;
let input, button, populationLabel, speedLabel;
let gameWidth = 1600;
let gameHeight = 800;

function keyPressed() {
  if (key === 'S') {
    let bird = birds[0];
    saveJSON(bird.brain, 'bird.json');
  }

  // pause
  if (key == "p") {
    if (paused) {
      loop();
    } else {
      noLoop();
    }
    paused = !paused;
  }

}

function setup() {

  createCanvas(gameWidth, gameHeight);
  tf.setBackend('cpu');

  slider = createSlider(1, 10, 1);
  speedLabel = createElement('h4', 'Set speed:');
  speedLabel.position(gameWidth + 20, gameHeight + 20);

  input = createInput(TOTAL);
  input.position(gameWidth + 20, 100);

  button = createButton('Restart');
  button.position(input.x + input.width, 100);
  button.mousePressed(setPopulation);

  populationLabel = createElement('h4', 'Set population: (1-500)');
  populationLabel.position(gameWidth + 20, 50);

  textSize(50);

  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
        score++;
        if (score > record) {
          record = score;
        }
      }
    }

    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].offScreen()) {
        savedBirds.push(birds.splice(i, 1)[0]);
      }
    }

    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }

    if (birds.length === 0) {
      counter = 0;
      score = 0;
      generation++;
      nextGeneration();
      pipes = [];
    }
  }

  // All the drawing stuff
  background(0);

  // Display score
  textSize(24);
  fill(255, 0, 0);
  text("Score: " + score, 50, 30);
  textSize(24);
  fill(255, 0, 0);
  text("Record: " + record, 210, 30);
  textSize(24);
  fill(255, 0, 0);
  text("Generation: " + generation, 390, 30);
  fill(255, 0, 0);

  for (let bird of birds) {
    bird.show();
  }

  for (let pipe of pipes) {
    if (score < 100) {
      pipe.show();
    } else {
      noLoop();
      textSize(60);
      fill(0, 255, 0);
      text("Goal (100) Reached!!!", 200, 200);
      textSize(30);
      fill(0, 255, 0);
      text("Reloading...", 200, 300);
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }
}

function setPopulation() {
  const population = input.value();

  if (parseInt(population, 10)) {
    if (population <= 0 || population > 500) {
      alert('Value must be between 1-500')
    } else {
      sessionStorage.setItem('POPULATION', population);
      window.location.reload();
    }
  } else {
    alert('Please enter a valid value for the population')
  }
}

// function keyPressed() {
//   if (key == ' ') {
//     bird.up();
//     //console.log("SPACE");
//   }
// }
