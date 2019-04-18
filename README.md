# PoseNet as MIDI controller for Live

Use PoseNet/p5.js to detect pose and communicate with Live via LiveOSC.
- p5js > LiveOSC > Ableton

![alt text](https://confluence.office.ableton.com/download/attachments/225546269/test2.gif?version=1&modificationDate=1555510111873&api=v2g)

#### Demo video: 
https://vimeo.com/331012711

#### Setup:
Install [node](https://nodejs.org/en/)

Install [LiveOSC](https://livecontrol.q3f.org/ableton-liveapi/liveosc/)

Clone this repo and run npm to get required libraries
```
$ git clone https://github.com/nmtrang29/p5js-osc
$ cd p5js-osc/
$ npm install
```

Start node
```
$ node bridge.js
```

Open the example Live set included in the folder (thanks Christian Kleine!). Only then run LiveOSC and select a few output parameters

Run the sketch locally (index.html)
