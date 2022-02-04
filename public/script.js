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

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addvideostream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        setTimeout(() => {
            connectuser(userId, stream);
        }, 1000)
    })
})

console.log("Working   " + ROOM_ID);


peer.on('open', id => {
    console.log(`User Id : ${id}`)
    socket.emit('join-room', ROOM_ID, id);
})


const connectuser = (userId, stream) => {
    console.log(`${userId} Is Connected`);
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addvideostream(video, userVideoStream)
    })
}

const addvideostream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videogrid.append(video);
}