
async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/Spotify-clone/songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    console.log(songs);    
    return songs;
}

async function main(){
    // Get the list of all songs
    let songs = await getSongs();
    // console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    for (const song of songs) {
        // songUL.innerHTML = songUL.innerHTML + `<li>${song.replaceAll("%20"," ")}</li>`;
        songUL.innerHTML = songUL.innerHTML + `<li><img src="music.svg" alt="">
        <div class="info">
            <div><marque width="100%" scrollamount="3">${song.replaceAll("%20"," ")}</marquee></div>
            <!-- <div class="artist">Song Artist</div> -->
        </div>
        <div class="play-now">
        <!-- <span>play now</span> -->   
        <img class="invert pl" src="play.svg" alt="">
    </li>`;
    }

    // Play the first song
    var audio = new Audio(songs[0]);
    audio.play();

    audio.addEventListener("loadeddata", ()=>{
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    });
}

main();
