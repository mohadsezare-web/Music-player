
const musicData = [
    {
        id: 1,
        title: "Gloo band",
        artist: "Erfan Tahmasbi",
        cover: "assets/images/cover1.jpg",
        audio: "assets/music/song1.mp3"
    },
    {
        id: 2,
        title: "Khoda Ro Che Didi",
        artist: "Alireza Ghorbani",
        cover: "assets/images/cover2.jpg",
        audio: "assets/music/song2.mp3"
    },
    {
        id: 3,
        title: "Sheyda",
        artist: "Alireza Ghorbani",
        cover: "assets/images/cover3.jpg",
        audio: "assets/music/song3.mp3"
    },
    {
        id: 4,
        title: "Maste Eshgh",
        artist: "Alireza Ghorbani",
        cover: "assets/images/cover4.jpg",
        audio: "assets/music/song4.mp3"
    },
    {
        id: 4,
        title: "Bi Ehsas",
        artist: "Shadmehr Aghili",
        cover: "assets/images/cover5.jpg",
        audio: "assets/music/song5.mp3"
    },
    {
        id: 4,
        title: "Dast Man Nist",
        artist: "Shadmehr Aghili",
        cover: "assets/images/cover6.jpg",
        audio: "assets/music/song6.mp3"
    },
    {
        id: 4,
        title: "Harigh Sabz",
        artist: "Ebi",
        cover: "assets/images/cover7.jpg",
        audio: "assets/music/song7.mp3"
    },
    {
        id: 4,
        title: "Pichak",
        artist: "Ebi",
        cover: "assets/images/cover8.jpg",
        audio: "assets/music/song8.mp3"
    }
];


let currentSong = null;
let isPlaying = false;
let audio = new Audio();
let currentTime = 0;
let duration = 0;


document.addEventListener('DOMContentLoaded', function() {

    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeProgress = document.querySelector('.volume-progress');
    const nowPlayingImg = document.querySelector('.now-playing img');
    const nowPlayingTitle = document.querySelector('.now-playing h4');
    const nowPlayingArtist = document.querySelector('.now-playing p');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const musicGrid = document.getElementById('music-grid');


    function initializeMusicGrid() {
        console.log('در حال راه‌اندازی شبکه موسیقی...');
        musicGrid.innerHTML = ''; 
        
        musicData.forEach(song => {
            const card = createMusicCard(song);
            musicGrid.appendChild(card);
        });
    }

    function createMusicCard(song) {
        const card = document.createElement('div');
        card.className = 'music-card bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all duration-300 cursor-pointer flex flex-col items-center';
        card.innerHTML = `
            <div class="image-container w-full h-64 flex items-center justify-center overflow-hidden bg-gray-900">
                <img src="${song.cover}" alt="${song.title}" class="w-full h-full object-contain" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
            </div>
            <div class="p-4 text-center w-full">
                <h3 class="font-semibold truncate mb-1">${song.title}</h3>
                <p class="text-sm truncate">${song.artist}</p>
            </div>
        `;
        card.addEventListener('click', () => playSong(song));
        return card;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function playSong(song) {
        try {
            console.log(`تلاش برای پخش: ${song.title}`);
            currentSong = song;
            audio.src = song.audio;
            
            audio.onerror = function() {
                console.log(`خطا در بارگذاری فایل صوتی: ${song.audio}`);
                alert('خطا در بارگذاری فایل صوتی');
            };
            
            audio.onloadstart = function() {
                console.log(`در حال بارگذاری فایل صوتی: ${song.audio}`);
            };
            
            audio.oncanplay = function() {
                console.log(`فایل صوتی با موفقیت بارگذاری شد: ${song.audio}`);
                audio.play().catch(error => {
                    console.log(`خطا در پخش صدا: ${error.message}`);
                    alert('خطا در پخش فایل صوتی');
                });
            };
            
            isPlaying = true;
            updatePlayerUI();
        } catch (error) {
            console.log(`خطا در تابع playSong: ${error.message}`);
            alert('خطا در پخش آهنگ');
        }
    }

    function updatePlayerUI() {
        if (currentSong) {
            nowPlayingImg.src = currentSong.cover;
            nowPlayingTitle.textContent = currentSong.title;
            nowPlayingArtist.textContent = currentSong.artist;
            playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        }
    }

    function togglePlay() {
        if (!currentSong) {
            if (musicData.length > 0) {
                playSong(musicData[0]);
            }
            return;
        }

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying = !isPlaying;
        updatePlayerUI();
    }

    
    function updateProgress() {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = `${progressPercent}%`;
            currentTimeSpan.textContent = formatTime(audio.currentTime);
            durationSpan.textContent = formatTime(audio.duration);
        }
    }

    function setProgress(e) {
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    function setVolume(e) {
        const width = volumeSlider.clientWidth;
        const clickX = e.offsetX;
        const volume = clickX / width;
        audio.volume = Math.max(0, Math.min(1, volume));
        volumeProgress.style.width = `${volume * 100}%`;
    }

    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', () => {
        const currentIndex = musicData.findIndex(song => song.id === currentSong?.id);
        if (currentIndex > 0) {
            playSong(musicData[currentIndex - 1]);
        }
    });
    nextBtn.addEventListener('click', () => {
        const currentIndex = musicData.findIndex(song => song.id === currentSong?.id);
        if (currentIndex < musicData.length - 1) {
            playSong(musicData[currentIndex + 1]);
        }
    });
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
        const currentIndex = musicData.findIndex(song => song.id === currentSong?.id);
        if (currentIndex < musicData.length - 1) {
            playSong(musicData[currentIndex + 1]);
        } else {
            isPlaying = false;
            updatePlayerUI();
        }
    });
    
    progressBar.addEventListener('click', setProgress);
    volumeSlider.addEventListener('click', setVolume);

    
    initializeMusicGrid();
}); 