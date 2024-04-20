let currentSong = new Audio();
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00 : 00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes} : ${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/Spotify-clone/songs/");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    // console.log(songs);    
    return songs;
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("songs/" + track);
    // audio.play();
    currentSong.src = "songs/" + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    // console.log(currentSong);
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
    // Get the list of all songs
    songs = await getSongs();
    // console.log(songs);
    playMusic(songs[0], true);



    // Show all the songs in list
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    for (const song of songs) {
        // songUL.innerHTML = songUL.innerHTML + `<li>${song.replaceAll("%20"," ")}</li>`;
        songUL.innerHTML = songUL.innerHTML + `<li><img src="music.svg" alt="">
        <div class="info">
            <div><marque width="100%" scrollamount="3">${song.replaceAll("%20", " ")}</marquee></div>
            <!-- <div class="artist">Song Artist</div> -->
        </div>
        <div class="play-now">
        <!-- <span>play now</span> -->   
        <img class="invert pl" src="play.svg" alt="">
    </li>`;
    }

    // Attach event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.getElementsByTagName("div")[1].innerText);
            playMusic(e.getElementsByTagName("div")[1].innerText);
        })
    });

    // Play the first song
    // let a = "./songs/Aaj%Bhi.mp3";
    // var audio = new Audio(a);
    // audio.play();

    // audio.addEventListener("loadeddata", ()=>{
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime);
    // });

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    // timeupdate Event 
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100
            + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // console.log(e);
        // console.log(e.clientX);
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    });

    // Play Nex & Prev song

    previous.addEventListener("click", () => {
        console.log("Previous track");
        // console.log(currentSong);

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        // console.log("Next track");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(songs[index+1]);
        if((index+1) < songs.length ){
            // if((index) == songs.length){
            //     console.log("last song");
            //     playMusic(songs[0]);
            // }else{
                playMusic(songs[index + 1]);
            // }
        // console.log(index + " : " + songs[index]);
        }
        // else{
        //     playMusic(songs[index]);
        // }
    });

    // Add an Event to volume
    document.querySelector("#rng").addEventListener("change", (e)=>{
        console.log(e.target, e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100;
    });

}

main();
