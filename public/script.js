const socket = io('/');

const myvideo = document.createElement('video');
const videogrid = document.getElementById('video-grid');
myvideo.muted = true;

var userName=prompt("Please enter your name");


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

let text = $('input');
console.log(text);

$('html').keydown((e) => {
    if (e.which == 13 && text.val().length != 0) {
        socket.emit('message', text.val(), userName);
        console.log(text.val());
        text.val('');
    }
})


socket.on('createmsg', (m, un) => {
    $('ul').append(`<li><h6>${un}</h6><br>${m}</li>`);
    scrolltobottom();
})

const scrolltobottom = () =>{
    $('.chat-main').scrollTop($('.chat-main').prop("scrollHeight"));
}