// we need a handle to the socket to send our osc values
var socket;
var isConnected;

let video;
let poseNet;
let poses = [];

let easing = 0.05;

function setup() {
  createCanvas(960, 720);
  setupOsc(8000, 12000);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Ready!');
}

function mousePressed(){
  console.log(JSON.stringify(poses))
}

function draw() {
  image(video, 0, 0, width, height);
  strokeWeight(2);

  // For one pose only (use a for loop for multiple poses!)
  if (poses.length > 0) {
    let pose = poses[0].pose;

    fill(255, 0, 0);
    noStroke();
    textSize(20);

    //Nose X on Canvas
    //2 Frenquency
    let nose = pose['nose'];
    ellipse(nose.x, nose.y, 10, 10);
    var vNoseX = 1 - abs(nose.x - width/2)/width*2;
    // var vNoseX = lerp(vNoseX0, 0.02);
    text(vNoseX, nose.x + 10, nose.y -5);
    text('C78 Core Kit - Volume', nose.x  + 10, nose.y - 25);

    //Right Shoulder on Canvas
    //Ambient Volume
    let rightShoulder = pose['rightShoulder'];
    ellipse(rightShoulder.x, rightShoulder.y, 10, 10);
    var vRightShoulder = 1 - abs(rightShoulder.x - width/2)/width*2;
    text(vRightShoulder, rightShoulder.x  + 10, rightShoulder.y + 15);
    text('Bells & ThinPad - Volume', rightShoulder.x  + 10, rightShoulder.y - 5);

    //Right Wrist to Nose
    //2 Volume
    let rightWrist = pose['rightWrist'];
    ellipse(rightWrist.x, rightWrist.y, 10, 10);
    var vRightWrist = dist(rightWrist.x, rightWrist.y, nose.x, nose.y)/1000;
    text('C78 Core Kit - Volume', rightWrist.x  + 10, rightWrist.y - 5);
    text(vRightWrist, rightWrist.x  + 10, rightWrist.y + 15);

    //Right Elbow on Canvas
    // 4 L Sync
    let rightElbow = pose['rightElbow'];
    ellipse(rightElbow.x, rightElbow.y, 10, 10);
    var vRightElbow = 1 - abs(rightElbow.x - width/2)/width*2;
    text('Bells & ThinPad - L Sync', rightElbow.x  + 10, rightElbow.y - 5);
    text(vRightElbow, rightElbow.x + 10, rightElbow.y + 15);

    //Left Wrist on Right Wrist
    //3 Filter Freq
    let leftWrist = pose['leftWrist'];
    ellipse(leftWrist.x, leftWrist.y, 10, 10);
    var vLeftWrist = dist(leftWrist.x, leftWrist.y, rightWrist.x, rightWrist.y)/width;
    text('Bass - Filter Freq', leftWrist.x  + 10, leftWrist.y - 5);
    text(vLeftWrist, leftWrist.x  + 10, leftWrist.y + 15);

    //Left Shoulder on Canvas
    //5 Volume
    let leftShoulder = pose['leftShoulder'];
    ellipse(leftShoulder.x, leftShoulder.y, 10, 10);
    var vLeftShoulder = 1 - abs(leftShoulder.x - width/2)/width*2;
    text('Tape Choir Cm - Volume', leftShoulder.x  + 10, leftShoulder.y - 5);
    text(vLeftShoulder, leftShoulder.x  + 10, leftShoulder.y + 15);
   
    //Left Elbow on Right Wrist
    let leftElbow = pose['leftElbow'];
    ellipse(leftElbow.x, leftElbow.y, 10, 10);
    var vLeftElbow = dist(leftElbow.x, leftElbow.y, rightWrist.x, rightWrist.y)/width;
    text('FX Base - Volume', leftElbow.x  + 10, leftElbow.y - 5);
    text(vLeftElbow, leftElbow.x  + 10, leftElbow.y + 15);

    //Nose Y on Canvas
    //2 Frenquency
    var vNoseY = 1 - abs(nose.y - height/2)/height*2;
    text(vNoseY, nose.x + 10, nose.y + 45);
    text('FX Base - Frenquency', nose.x  + 10, nose.y + 25);

    //Left Shoulder on Canvas
    //5 Volume
    let leftHip = pose['leftHip'];
    ellipse(leftHip.x, leftHip.y, 10, 10);
    var vLeftHip = 1 - abs(leftHip.x - width/2)/width*2;
    text('Master - Chain Selector', leftHip.x  + 10, leftHip.y - 5);
    text(vLeftHip, leftHip.x  + 10, leftHip.y + 15);

    if (isConnected) {
    socket.emit('message', ['/wek/outputs', vNoseX, vRightShoulder, vRightWrist, vRightElbow, vLeftWrist, vLeftShoulder, vLeftElbow, vNoseY, vLeftHip]);
    }
  }
}

function receiveOsc(address, value) {
  console.log("received OSC: " + address + ", " + value);
}

function sendOsc(address, value) {
  socket.emit('message', [address, value]);
}

function setupOsc(oscPortIn, oscPortOut) {
  socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
  socket.on('connect', function() {
    socket.emit('config', { 
      server: { port: oscPortIn,  host: '127.0.0.1'},
      client: { port: oscPortOut, host: '127.0.0.1'}
    });
  });
  socket.on('connect', function() {
    isConnected = true;
  });
  socket.on('message', function(msg) {
    if (msg[0] == '#bundle') {
      for (var i=2; i<msg.length; i++) {
        receiveOsc(msg[i][0], msg[i].splice(1));
      }
    } else {
      receiveOsc(msg[0], msg.splice(1));
    }
  });
}
