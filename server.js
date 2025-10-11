const express = require('express');
const session = require('express-session');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

const DIR_MP3 = '/var/www/html/_allmp3/';
const DIR_MIX = '/var/www/html/PIONEER_REC2/';
const BASE_URL = 'https://musica.zapto.org';

// app.use(cors({origin: 'https://musica.zapto.org', credentials: true}));
app.use(cors({origin: 'https://musicaguegan.netlify.app', credentials: true}));
app.use(express.json());
app.use(session({secret: 'musica-secret-2025', resave: false, saveUninitialized: true, cookie: {secure: true, httpOnly: true, maxAge: 86400000}}));

function getAllMp3(dir) { return fs.readdirSync(dir).filter(f => f.endsWith('.mp3')); }

app.get('/api/next-song', (req, res) => {
    if (!req.session.playedSongs) req.session.playedSongs = [];
    const allSongs = getAllMp3(DIR_MP3);
    let available = allSongs.filter(s => !req.session.playedSongs.includes(s));
    if (!available.length) { req.session.playedSongs = []; available = allSongs; }
    const song = available[Math.floor(Math.random() * available.length)];
    req.session.playedSongs.push(song);
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const inverse = '#' + (16777215 - parseInt(color.substring(1), 16)).toString(16).padStart(6, '0');
    // res.json({song, songName: song.replace('.mp3', ''), url: `_allmp3/${song}`, cover: `_alljpg/${song}.jpg`, played: req.session.playedSongs.length, total: allSongs.length, color, textColor: inverse});
    res.json({song, songName: song.replace('.mp3', ''), url: `$(BASE_URL)/_allmp3/${song}`, cover: `$(BASE_URL)/_alljpg/${song}.jpg`, played: req.session.playedSongs.length, total: allSongs.length, color, textColor: inverse});
});

// app.get('/api/next-mix', (req, res) => {
//    if (!req.session.playedMixes) req.session.playedMixes = [];
//    const all = getAllMp3(DIR_MIX);
//    let available = all.filter(m => !req.session.playedMixes.includes(m));
//    if (!available.length) { req.session.playedMixes = []; available = all; }
//    const mix = available[Math.floor(Math.random() * available.length)];
//    req.session.playedMixes.push(mix);
//    res.json({mix, mixName: mix.replace('.mp3', ''), url: `PIONEER_REC2/${mix}`});
// });

// app.get('/api/stats', (req, res) => res.json({totalHits: parseInt(fs.readFileSync('/var/www/html/count.txt', 'utf8') || '0'), sessionPlayed: req.session.playedSongs?.length || 0, totalSongs: getAllMp3(DIR_MP3).length}));

// app.post('/api/increment-hits', (req, res) => {
//    const file = '/var/www/html/count.txt';
//    const count = parseInt(fs.readFileSync(file, 'utf8') || '0') + 1;
//    fs.writeFileSync(file, count.toString());
//    res.json({hits: count});
// });

app.listen(PORT, () => console.log('🎵 API sur :3000'));
