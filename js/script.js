let currentSong = new Audio();
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");
let songs;
let currFolder;

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

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1]);
        }
    }
    // console.log(songs);    
    

    // Show all the songs in list
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        // songUL.innerHTML = songUL.innerHTML + `<li>${song.replaceAll("%20"," ")}</li>`;
        songUL.innerHTML = songUL.innerHTML + `<li><img src="./Assets/Svgs/music.svg" alt="">
         <div class="info">
             <div><marque width="100%" scrollamount="3">${song.replaceAll("%20", " ")}</marquee></div>
             <!-- <div class="artist">Song Artist</div> -->
         </div>
         <div class="play-now">
         <!-- <span>play now</span> -->   
         <img class="invert pl" src="./Assets/Svgs/play.svg" alt="">
     </li>`;
    }

    // Attach event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.getElementsByTagName("div")[1].innerText);
            playMusic(e.getElementsByTagName("div")[1].innerText);
        })
    });

    return songs;
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("songs/" + track);
    // audio.play();
    currentSong.src = `${currFolder}` + track;
    if (!pause) {
        currentSong.play();
        play.src = "./Assets/Svgs/pause.svg";
    }
    // console.log(currentSong);
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}

async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".card-container");
    let array = Array.from(anchors);
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        if (e.href.includes("/Spotify-clone/songs/")) {
            let folder = e.href.split("/").slice(-1)[0];
            // Get the metaData of the folder
            let a = await fetch(`/${folder}/info.json`);
            let response = await a.json();
            console.log(response.title);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">
                <img src="./Assets/Svgs/triangle.svg" alt="">
            </div>
            <img src="songs/${folder}/cover.jpeg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`

        }

    }

    // Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e);
        e.addEventListener("click", async item => {
            // console.log(item.target, item.target.dataset);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}/`);
            playMusic(songs[0]);

        });
    });
}

async function main() {
    // Get the list of all songs
    await getSongs("songs/Songs/");
    // console.log(songs);
    playMusic(songs[0], true);

    // Display all the albums on the page
    displayAlbums();


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
            play.src = "./Assets/Svgs/pause.svg";
        } else {
            currentSong.pause();
            play.src = "./Assets/Svgs/play.svg";
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
        // console.log("Previous track");
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
        if ((index + 1) < songs.length) {
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
    document.querySelector("#rng").addEventListener("change", (e) => {
        // console.log(e.target, e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100;

        if(e.value = 0){
            console.log(e.value);
            document.querySelector(".volume>img").target.src = "./Assets/Svgs/mute.svg";
            currentSong.volume = parseInt(e.target.value) / 100;
        }
    });

    // Event Listener to mute the volume
    document.querySelector(".volume>img").addEventListener("click", e=>{
        // console.log(e.target.src.split("/")[5]);
        if(e.target.src.split("/").slice(-1)[0] == "volume.svg"){
            // console.log(e.target.src.split("/").slice(-1)[0]);
            e.target.src = "./Assets/Svgs/mute.svg";
            currentSong.volume = 0;
            document.querySelector("#rng").value = 0;
        }else{
            e.target.src = "./Assets/Svgs/volume.svg";
            currentSong.volume = 0.1;
            document.querySelector("#rng").value = 10;
        }

    })
}

main();
