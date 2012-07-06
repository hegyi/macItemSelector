beforeEach(function() {

  this.addMatchers({
    toBeSelected: function() {
      var array = this.actual;
      for(i in array) {
        if(array[i].isSelected() == false) {
          this.message = function () {
            return "The node is unselected, index: " + i;
          }
          return false;
        }
      }
      return true;
    },
    toBeUnselected: function() {
      var array = this.actual;
      for(i in array) {
        if(array[i].isSelected()) {
          this.message = function () {
            return "The node is selected, index: " + i;
          }
          return false;
        }
      }
      return true;
    },
    toBePartiallyFilled: function() {
      var array = this.actual;
      for(i in array) {
        if(!array[i].isPartiallyFilled()) {
          this.message = function () {
            return "The node is not partially selected, index: " + i;
          }
          return false;
        }
      }
      return true;
    } 
  });
});
