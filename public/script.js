const socket = io('/');

const myvideo = document.createElement('video');
const videogrid = document.getElementById('video-grid');
myvideo.muted = true;

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(stream => {
    addvideostream(myvideo, stream);
})

console.log("Working   " + ROOM_ID);
socket.emit('join-room', ROOM_ID);

socket.on('user-connected', () => {
    connectuser();
})

const connectuser = () => {
    console.log("New User Is Connected");
}

const addvideostream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videogrid.append(video);
}