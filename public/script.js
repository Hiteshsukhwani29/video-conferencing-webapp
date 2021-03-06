const socket = io('/');

const myvideo = document.createElement('video');
const videogrid = document.getElementById('video-grid');
myvideo.muted = true;

var userName=prompt("Please enter your name");


var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
})

var myvideostream;

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(stream => {
    myvideostream=stream;
    addvideostream(myvideo, myvideostream);

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

const AudioBtn = () =>{
    const enabled = myvideostream.getAudioTracks()[0].enabled;
    if(enabled){
        myvideostream.getAudioTracks()[0].enabled = false;
        unmuteAudio();
    }
    else{
        muteAudio();
        myvideostream.getAudioTracks()[0].enabled = true;
    }
}

const unmuteAudio = () =>{
    document.getElementById('btn-audio-off').style.display="block";
    document.getElementById('btn-audio-on').style.display="none";
}
const muteAudio = () =>{
    document.getElementById('btn-audio-off').style.display="none";
    document.getElementById('btn-audio-on').style.display="block";
}

const videoBtn = () =>{
    const enabled = myvideostream.getVideoTracks()[0].enabled;
    if(enabled){
        myvideostream.getVideoTracks()[0].enabled = false;
        unmutevideo();
    }
    else{
        mutevideo();
        myvideostream.getVideoTracks()[0].enabled = true;
    }
}

const unmutevideo = () =>{
    document.getElementById('btn-video-off').style.display="block";
    document.getElementById('btn-video-on').style.display="none";
}
const mutevideo = () =>{
    document.getElementById('btn-video-off').style.display="none";
    document.getElementById('btn-video-on').style.display="block";
}