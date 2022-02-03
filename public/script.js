const socket = io('/');

const myvideo = document.createElement('video');
const videogrid = document.getElementById('video-grid');
myvideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '5000'
})

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(stream => {
    addvideostream(myvideo, stream);
})

console.log("Working   " + ROOM_ID);


peer.on('open', id => {
    console.log(`User Id : ${id}`)
    socket.emit('join-room', ROOM_ID, id);
})
socket.on('user-connected', (userId) => {
    connectuser(userId);
})

const connectuser = (userId) => {
    console.log(`${userId} Is Connected`);
}

const addvideostream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videogrid.append(video);
}