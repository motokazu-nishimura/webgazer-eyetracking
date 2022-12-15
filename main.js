const displayMediaOptions = {
    video: {
      cursor: "always"
    },
    audio: false
};

let captureStream = null;
let mediaRecorder = null;
let recordedChunks = [];
async function startCapture(displayMediaOptions) {
    try {
        captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        const options = { mimeType: "video/webm; codecs=vp9" };

        document.querySelector("#showrecordingcount").style.display = "block";
        // 5 sec
        let countdown = 5;
        let handle = setInterval(()=>{
            document.querySelector("#showrecordingcount").innerHTML = countdown;
            countdown --;
            if (countdown == 0) {
                document.querySelector("#showrecordingcount").style.display = "none";
                mediaRecorder = new MediaRecorder(captureStream, options);
                mediaRecorder.ondataavailable = handleDataAvailable;
                
                mediaRecorder.start();
                clearInterval(handle);
            }
        }, 1000);

        document.querySelectorAll(".hideonprogress").forEach((el)=>el.style.display = "none")
        document.querySelector("#stoprecording").style.display = "block";
    } catch (err) {
        console.error(`Error: ${err}`);
    }
    return captureStream;
}

// start capture screen
function start() {
    console.log("start recording");
    startCapture(displayMediaOptions);
}

// handle data of recorder
function handleDataAvailable(event) {
    console.log("data-available");
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
      download();
      stop();
    } else {
      // ...
    }
}

// download record data
function download() {
    var blob = new Blob(recordedChunks, {
      type: "video/webm"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "eyetracking.webm";
    a.click();
    window.URL.revokeObjectURL(url);
}


// end record
function stop() {
    console.log("stopping");
    document.querySelectorAll(".hideonprogress").forEach((el)=>el.style.display = "block");
    document.querySelector("#stoprecording").style.display = "none";
    webgazer.pause();
    if (mediaRecorder !== null) {
        mediaRecorder.stop();
    }
    if (captureStream !== null) {
        const tracks = captureStream.getTracks();
        tracks[0].stop();
    }
}

//
const gazeel = document.querySelector("#gazer");

webgazer.setGazeListener(function(data, elapsedTime) {
    if (data == null) {
        return;
    }
    const xprediction = data.x; //these x coordinates are relative to the viewport
    const yprediction = data.y; //these y coordinates are relative to the viewport
    gazeel.style.left = (xprediction - 20) + "px";
    gazeel.style.top = (yprediction - 20) + "px";
}).saveDataAcrossSessions(true).begin();

//webgazer.showVideo(false);
webgazer.showPredictionPoints(false);
webgazer.applyKalmanFilter(true);
setTimeout(()=>{
    webgazer.setVideoViewerSize(200,200);
}, 1000);

window.saveDataAcrossSessions = true;
window.onbeforeunload = function() {
    webgazer.end();
}

let calibratePoints = [0,0,0,0,0,0,0,0,0];
function calibrate(num) {
    let nidx = num - 1;
    calibratePoints[nidx] ++;
    let green = 255 - (255 * (calibratePoints[nidx] / 5));
    document.querySelector(".calibrationpoint.point"+num).style.background = "rgb(255, "+green+", 0)";
    let count = 0;
    calibratePoints.forEach((p,i)=>{
        if ( p >= 2 ) {
            count ++;
        }
    });
    if (count >= calibratePoints.length) {
        alert("ok, finish calibration");
        closeCalibration();
    }
}
function calibration() {
    document.querySelector("#calibrationbox").style.display = "block";
    calibratePoints.forEach((p,i)=>{
        calibratePoints[i] = 0;
    });
}
function closeCalibration() {
    document.querySelector("#calibrationbox").style.display = "none";
}
function clear() {
    webgazer.clearData(); // データをクリアする
}