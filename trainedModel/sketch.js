let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "Y";
let score = 0;
let flager = 0;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 3,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'model.json',
    metadata: 'model_meta.json',
    weights: 'model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {

  if (results[0].confidence > 0.9) {
    poseLabel = results[0].label.toUpperCase();
    if (poseLabel === 'T') {
      flager = 1;
      poseLabel = 'Standing';
    }
    if ((poseLabel === 'J') && (flager === 1)){
      poseLabel = 'Jumping Jack';
      score += 1;
      flager = 0;
    }
    if ((poseLabel === 'G') && (flager === 1)) {
      poseLabel = 'Squats';
      score += 1;
      flager = 0;
    }
  }
  //console.log(results[0].confidence);
  classifyPose();
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();

/*
  fill(255, 255, 255);
  noStroke();
  textSize(30);
  textAlign(CENTER, CENTER);
  text(poseLabel, width / 5, height / 5);
  text(score, width/7, height/7)
*/
  document.getElementById("score").innerHTML = score;
  document.getElementById("pose").innerHTML = poseLabel;
}