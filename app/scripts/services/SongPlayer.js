(function() {
  function SongPlayer() {
    var SongPlayer = {};

    var currentSong = null;

    var currentBuzzObject = null;

    /*
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if(currentBuzzObject) {
        currentBuzzObject.stop();
        currentSong.playing = null;
      }

      /*
      * @desc Buzz object audio file
      * @type {Object}
      */
      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      /*
      * @desc Song object in Songs {Array}
      * @type {Object}
      */
      currentSong = song;
    };

    /*
    * @function playSong
    * @desc Plays audio file; i.e currentBuzzObject
    * @param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    };

    /*
    * @method play
    * @desc Sets and plays audio file; i.e currentBuzzObject
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      if(currentSong !== song) {
        setSong(song);
        playSong(song);

      } else if (currentSong === song) {
          if(currentBuzzObject.isPaused()) {
            playSong(song);
          }
      }
    };

    /*
    * @method pause
    * @desc Pauses currently playing audio file; i.e currentBuzzObject
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      currentBuzzObject.pause();
      song.playing = false;
    };

    return SongPlayer;
  }

  angular
  .module('blocJams')
  .factory('SongPlayer',SongPlayer)
})();
