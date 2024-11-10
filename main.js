/* elementlere ulasip obje olarak kullanma, yakalama*/
const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')


const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton= document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')

// indis sirasi
let index

//dongu
let loop = true

//sarki listesini
const songsList = [
    {
      name: "Sana El Pence Durmam",
      link: "assets/sana-el-pence-durmam.mp3",
      artist: "Emre Fel",
      image: "assets/emre-fel.jpeg",
    },
    {
      name: "Sığamıyorum",
      link: "assets/sigamiyorum.mp3",
      artist: "Bengü",
      image: "assets/bengu.jpg",
    },
    {
      name: "Geceye Selamım Var",
      link: "assets/geceye-selamim-var.mp3",
      artist: "Volkan Arslan",
      image: "assets/volkan-arslan.jpg",
    },
    {
      name: "Numaracı",
      link: "assets/numaraci.mp3",
      artist: "Mabel Matiz",
      image: "assets/mabel-matiz.jpg",
    },
    {
      name: "Papatya",
      link: "assets/papatya.mp3",
      artist: "Eda Sakız & İrem Derici",
      image: "assets/eda-sakiz-irem-derici.jpg",
    },
  ];

//sarki atama
const setSong = (arrayIndex) =>{
    console.log(arrayIndex)
    let {name, link, artist, image} = songsList[arrayIndex]
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image

    audio.onloadedmetadata = () =>{
        //zamani ayalar
        maxDuration.innerText = timeFormatter(audio.duration)
    }
   playAudio()
   playListContainer.classList.add('hide')
}

//sarkiyi cal
const playAudio = () =>{
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
}


//sarkiyi durdurma
const puaseAudio = () => {
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

//onceki sarkiya gec
const previousSong = () => {
    puaseAudio()
    if (index > 0) {
        index -= 1
    } else {
        index = songsList.length - 1
    }
    setSong(index)
    playAudio()
}

//sonraki sarkiya gec
const nextSong = () => {
    if (loop) {
        if (index == (songsList.length - 1)) {
            index = 0
        }else{
            index += 1
        }
        setSong(index)
    } else {
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex)
    }
   playAudio()
}

//sarki en sona geldiginde
audio.onended = () => {
    nextSong()
}

//karistirici tiklanildiginda
shuffleButton.addEventListener('click',()=>{
    if (shuffleButton.classList.contains('active')) {
        shuffleButton.classList.remove('active')
        loop = true
    } else {
        shuffleButton.classList.add('active')
        loop = false
    }
})

//tekrar butonu tiklanildiginda
repeatButton.addEventListener('click', () => {
    if (repeatButton.classList.contains('active')) {
        repeatButton.classList.remove('active')
        loop = false
    } else {
        repeatButton.classList.add('active')
        loop = true
    }
})

//zaman formati olusturma
const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0" + minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0" + second : second
    return `${minute}:${second}`
}

//anlik sarkida gecen toplam saniye
audio.addEventListener('timeupdate',()=>{
    currentTimeRef.innerText = timeFormatter(audio.currentTime)
})

//progress alani hesaplama
progressBar.addEventListener('click',(event) => {

    let coordStart = progressBar.getBoundingClientRect().left
    console.log(coordStart)

    let coordEnd = event.clientX
    console.log(coordEnd)

    let progress = (coordEnd - coordStart) / progressBar.offsetWidth

    currentProgress.style.width = progress * 100 + "%"

    audio.currentTime = progress * audio.duration

    playAudio()
})

//otomatik zaman sayaci
setInterval(() => {
    console.log(audio.duration.toFixed(3))
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
}, 1000);

//listeyi olustur
const initializePlaylist = () => {
    for (let i in songsList) {
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}" />
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songsList[i].name}
            </span>
            <span id="playlist-song-artist-album">
                ${songsList[i].artist}
            </span>
        </li>`
    }
}

//listeyi kapata tiklanildiginda
closeButton.addEventListener('click', () => {
    playListContainer.classList.add('hide')
})

//sarki listesini ac
playListButton.addEventListener('click',()=>{
    playListContainer.classList.remove('hide')
})


//elementlere tiklanildiginda
//oynat butonuna tiklanildiginda
playButton.addEventListener('click', playAudio)

//durdur butonuna tiklanildiginda
pauseButton.addEventListener('click',puaseAudio)

//sonraki sarkiya gec butonu tiklanildiginda
nextButton.addEventListener('click',nextSong)

//geri butonu tiklanildiginda
prevButton.addEventListener('click', previousSong)


//ekran ilk acildiiginda
window.onload = () => {
    index = 0
    setSong(index)
    puaseAudio()
    initializePlaylist()
}