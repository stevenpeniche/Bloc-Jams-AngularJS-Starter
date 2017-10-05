(function() {
  function seekBar($document) {

    /**
    * @function calculatePercent
    * @desc Calculates the horizontal percent along the seek bar where the event occured.
    * @param {$(jQuery-element)} seekBar, event
    */
    var calculatePercent = function(seekBar, event) {
      var offsetX = event.pageX - seekBar.offset().left;
      var seekBarWidth = seekBar.width();
      var offsetXPercent = offsetX / seekBarWidth;
      offsetXPercent = Math.max(0, offsetXPercent);
      offsetXPercent = Math.min(1, offsetXPercent);
      return offsetXPercent;
    };

    return {
      templateUrl: '/templates/directives/seek_bar.html',
      replace: true,
      restrict: 'E',
      scope: {
        onChange: '&'
      },
      link: function(scope, element, attributes) {
        scope.value = 0;
        scope.max = 100;

        /**
        * @desc Holds the element that matches the directive (<seek-bar>) as a jQuery object so we can call jQuery methods on it.
        * @type {Object} jQuery
        */
        var seekBar = $(element);

        attributes.$observe('value', function(newValue) {
          scope.value = newValue;
        });

        attributes.$observe('max', function(newValue) {
          scope.max = newValue;
        });

        /**
        * @function percentString
        * @desc A function that calculates a percent based on the value and maximum value of a seek bar.
        */
        var percentString = function () {
          var value = scope.value;
          var max = scope.max;
          var percent = value / max * 100;

          return percent + "%";
        };

        /**
        * @method fillStyle
        * @desc Returns the width of the seek bar fill element based on the calculated percent.
        */
        scope.fillStyle = function() {
          return {width: percentString()};
        };

        /**
        * @method thumbStyle
        * @desc Updates the position of the seek bar thumb.
        */
        scope.thumbStyle = function() {
          return {left: percentString()};
        };

        /**
        * @method onClickSeekBar
        * @desc Updates the seek bar value based on the seek bar's width and the location of the user's click on the seek bar.
        * @param event
        */
        scope.onClickSeekBar = function(event) {
          var percent = calculatePercent(seekBar, event);
          scope.value = percent * scope.max;
          notifyOnChange(scope.value);
        };

        /**
        * @method trackThumb
        * @desc Applies the change in value of scope.value as the user drags the seek bar thumb.
        */
        scope.trackThumb = function() {
          $document.bind('mousemove.thumb', function(event) {
            var percent = calculatePercent(seekBar, event);
            scope.$apply(function() {
              scope.value = percent * scope.max;
              notifyOnChange(scope.value);
            });
          });

          $document.bind('mouseup.thumb', function() {
            $document.unbind('mousemove.thumb');
            $document.unbind('mouseup.thumb');
          });
        };

        var notifyOnChange = function(newValue) {
          if (typeof scope.onChange === 'function') {
            scope.onChange({value: newValue});
          }
        };
      }
    };
  }

  angular
    .module('blocJams')
    .directive('seekBar', ['$document', seekBar]);
})();
