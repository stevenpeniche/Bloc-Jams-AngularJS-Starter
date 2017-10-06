(function() {
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};

    /**
    * @desc Method that gets album data
    * @type {Object} method
    */
    var currentAlbum = Fixtures.getAlbum();

    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;

    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
          currentBuzzObject.stop();
          SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      SongPlayer.currentSong = song;
    };

    /**
    * @function playSong
    * @desc Plays audio file; i.e currentBuzzObject
    * @param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    };

    /**
    * @function stopSong
    * @desc Stops audio file; i.e currentBuzzObject
    * @param {Object} song
    */
    var stopSong = function(song) {
      currentBuzzObject.stop();
      SongPlayer.currentSong.playing = null;
    };

    /**
    * @function getSongIndex
    * @desc Gets index of song object in list of songs {Array}
    * @param {Object} song
    */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };

    /**
    * @desc Active song object from list of songs
    * @type {Object}
    */
    SongPlayer.currentSong = null;

    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;

    /**
    * @desc Current Volume
    * @type {Number}
    */
    SongPlayer.volume = null;

    /**
    * @method play
    * @desc Sets and plays audio file; i.e currentBuzzObject
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
          setSong(song);
          playSong(song);

      } else if (SongPlayer.currentSong === song) {
          if (currentBuzzObject.isPaused()) {
              playSong(song);
          }
      }
    };

    /**
    * @method pause
    * @desc Pauses currently playing audio file; i.e currentBuzzObject
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
    * @method previous
    * @desc Gets index of previous song object in song list {Array} and plays it
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
          stopSong(song);
          SongPlayer.play(song);

      } else {
          var song = currentAlbum.songs[currentSongIndex];
          setSong(song);
          playSong(song);
      }
    };

    /**
    * @method next
    * @desc Gets index of next song object in song list {Array} and plays it
    */
    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if (currentSongIndex > currentAlbum.songs.length - 1) {
          stopSong(song);

      } else {
          var song = currentAlbum.songs[currentSongIndex];
          setSong(song);
          playSong(song);
      }
    };

    /**
    * @function setCurrentTime
    * @desc Sets current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
          currentBuzzObject.setTime(time);
      }
    };

    /**
    * @function setCurrentVolume
    * @desc Sets volume
    * @param {Number} volume
    */
    SongPlayer.setCurrentVolume = function(volume) {
      if (currentBuzzObject) {
          currentBuzzObject.setVolume(volume);
      }
    };

    return SongPlayer;
  }

  angular
  .module('blocJams')
  .factory('SongPlayer',['$rootScope', 'Fixtures', SongPlayer]);
})();
