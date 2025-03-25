const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContent("2d");

async function setupCamera() {
	video.width = 640;
	video.height = 480;
	const stream = await
	navigator.mediaDevice.getUserMedia({ video: true});
	video.srcObject = stream;
	return new Promise((resolve) =>{
		video.onloadedmetadata = () => resolve(video);
	});
}
async function loadModel() {
	return await
	poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
}
async function detectPose(detector) {
	const poses = await detector.estimatePoses(video);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	
	if (poses.length > 0) {
		for (let keypoint of poses[0].keypoint) {
			ctx.fillStyle="red";
			ctx.beginPath();
			ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
			ctx.fill();
		}
	}
	requestAnimationFrame(() => detectPose(detector));
}
async function start() {
	await setupCamera();
	const detector= await loadModel();
	detectPose(detector);
}
start();
			