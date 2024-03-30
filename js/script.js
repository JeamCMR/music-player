/**VARIABLE */
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

//Se crea una array con objectos los cuales tendran la informaicon de las caciones a reproducir
const allSongs = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/still-learning.mp3",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cruising-for-a-musing.mp3",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/never-not-favored.mp3",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/from-the-ground-up.mp3",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/walking-on-air.mp3",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stop-me-cant-even-slow-me-down.mp3",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/the-surest-way-out-is-through.mp3",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/chasing-that-feeling.mp3",
  },
];
const audio = new Audio(); //Se crea un objecto de Audio que a su ves es una (API) navita de js
let userData = {
  songs: [...allSongs], //el operador ...sir
  currentSong: null,
  songCurrentTime: 0,
};

/**FUNCIONES */

/**
 * Reproducir la cancion
 */
const playSong = (id) => {
  const song = userData?.songs.find((song)=> song.id ===id);
  audio.src = song.src;
  audio.title = song.title;
  if (userData?.currentSong === null ||  userData?.currentSong.id !== song.id) {
    audio.currentTime=0;
  }else{
    audio.currentTime = userData?.songCurrentTime;
  }
  
  userData.currentSong = song;
  playButton.classList.add("playing");
  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();
};




/**FUNCION PARA PAUSAR LAS CANCIONES */

const pauseSong = ()=> {
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing");
  audio.pause();
};


/**Funcion para pasar a la siguiente cancion */
const playNextSong = () => {
 if (userData?.currentSong === null) {
   playSong(userData?.songs[0].id)
 }else{
  const currentSongIndex = getCurrentSongIndex();
  const nextSong = userData?.songs[currentSongIndex + 1];
  playSong(nextSong.id);
 }
}
/**Funcion para pasar a la ATRAS LA cancion */
const playPreviousSong = () => {
 if (userData?.currentSong === null) {
   return
 }else{
  const currentSongIndex = getCurrentSongIndex();
  const previousSong = userData?.songs[currentSongIndex - 1];
  playSong(previousSong.id);
 }
}

/*Funcion para mostrar informacion de la cancion en el html */
const setPlayerDisplay  = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist  = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;
  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
}


/** Funcion para seleccionar y resaltar la cancion que se esta reproducion actualmente */
const highlightCurrentSong  = () =>{
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(`song-${userData?.currentSong?.id}`);
  playlistSongElements.forEach(songEl => {
    songEl.removeAttribute("aria-current");
  });

  if(songToHighlight){
    songToHighlight.setAttribute("aria-current", "true");
  }
}


/**Funcion para el boton aleatory */
const shuffle = () => {
  userData?.songs.sort(()=> Math.random() - 0.5); //Una forma de aleatorizar una serie de elementos sería restar 0,5 de Math.random(), lo que produce valores aleatorios que son positivos o negativos
  userData.currentSong = null;
  userData.songCurrentTime = 0;
  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
}



/**Funcion para eliminar canciones */

const deleteSong = (id) =>{
  userData.songs = userData?.songs.filter((song)=>  song.id !== id );
  renderSongs(userData?.songs);
  highlightCurrentSong();
  setPlayButtonAccessibleText();
  // ser valida si la cancion a eliminar es la que se reproduce actualmente
  if(userData?.currentSong?.id === id){ 
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong();
    setPlayerDisplay();
  }
  
  //Si la lista de canciones esta vacia se debe crear un botton para reiniar.
  if(userData?.songs.length === 0){
    const resetButton = document.createElement("button"); //createElement se puede crear etiquetas html
    const resetText = document.createTextNode("Reset Playlist"); // crear un nodo de texto para el boton
    resetButton.id="reset"; //Agregar un atributo id al button creado
    resetButton.ariaLabel="Reset playlist" //Agregar un atributo ariaLabel al button creado
    resetButton.appendChild(resetText); // Agrega el texto al boton
    playlistSongs.appendChild(resetButton); //agrega el boton a la lista de reproduccion como elemento segundario

    resetButton.addEventListener("click", ()=>{
      userData.songs = [...allSongs];
      renderSongs(sortSongs());
      setPlayButtonAccessibleText()
      resetButton.remove();
    })
  }
}

/**
 * Muestra la lista de canciones 
 */
const renderSongs = (array) => {
  const songsHTML = array
    .map((song) => {//El método map() se utiliza para iterar a través de una matriz y devolver una nueva matriz.
    return`
    <li id="song-${song.id}" class="playlist-song">
    <button class="playlist-song-info" onclick="playSong(${song.id})">
        <span class="playlist-song-title">${song.title}</span>
        <span class="playlist-song-artist">${song.artist}</span>
        <span class="playlist-song-duration">${song.duration}</span>
    </button>
    <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
      </button>
    </li>
    `;
      })
      .join(""); //join() Se utiliza para concatenar todos los elementos de una matriz en una sola cadena
  
      playlistSongs.innerHTML = songsHTML;

};


/**Funcion para mostar una descripcion de la cacion en el boton play */

const setPlayButtonAccessibleText = () =>{
  const song = userData?.currentSong || userData?.songs[0];
  playButton.setAttribute("aria-label", song?.title ? `Play ${song.title}` : 'Play' );
}

/**funcion para obtener el indice del audio que se estra reproduccion actualmente  */
const getCurrentSongIndex = () =>{
  return userData?.songs.indexOf(userData?.currentSong);
}


/**Se agrega el evento al play para reproducir las canciones */
playButton.addEventListener("click", ()=>{
  if (!userData?.currentSong) {
    playSong(userData?.songs[0].id);
  }else{
    playSong(userData?.currentSong.id);
  }
});

/**Se agrega la funcion de pausar al button pauseButton */
pauseButton.addEventListener("click", pauseSong);

/**Se agrega la funcion de pasar a la siguiente cancion al button nextButton  */

nextButton.addEventListener("click", playNextSong);

/**Se agrega la funcion de pasar a la atrras la cancion al button previousButton  */

previousButton.addEventListener("click", playPreviousSong);



/**Se agrega la funcion de aleatorizar las canciones  al button shuffleButton  */

shuffleButton.addEventListener("click", shuffle);


/**Reproducir siguiente cancion automaticamente cuando la anterior acabe */
audio.addEventListener("ended", ()=>{
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData.songs.length > currentSongIndex ? true : false ; //Se valida si el valor de matriz.length es mator que currentSongIndex
  if (nextSongExists){ //si existe
    playNextSong();
  }else{
    userData.currentSong= null;
    userData.songCurrentTime= 0;
    pauseSong();
    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
  }
})


/**
 * ORDERNA LA LISTA DE CACIONES DE FORMA ALFABETICA
 * El método sort() convierte elementos de una matriz 
 * en cadenas y los ordena según sus valores en la codificación UTF-16.
 */
const sortSongs = () =>{
  userData?.songs.sort((a,b)=>{
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
  });
  return userData?.songs;
};






renderSongs(sortSongs());
