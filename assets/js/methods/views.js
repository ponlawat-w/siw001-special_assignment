export const viewMethods = {
  setView: function(view) {
    if (view === 'list' || view === 'map') {
      if (this.view === 'map' && view !== 'map') {
        this.destroyMap();
      }
      this.view = view;
    }
  },
  enableSearchByLocation: function() {
    this.searchByLocation = true;
    this.page = 1;
    this.mapMoved();
  },
  disableSearchByLocation: function() {
    this.searchByLocation = false;
    this.searchLocations = [];
    this.search();
  }
};
