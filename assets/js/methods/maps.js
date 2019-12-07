import { CONFIG } from '../../../settings.js';
import { Coordinate } from '../classes/coordinate.js';

export const mapMethods = {
  getDefaultMapLayer: function() {
    return L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${CONFIG.mapboxAccessToken}`, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: CONFIG.mapboxAccessToken
    });
  },
  getDefaultMapView: function() {
    return {
      center: [40.4160447, -3.6971141],
      zoom: 6
    };
  },
  initiateMap: function() {
    if (!this.map) {
      this.map = L.map('map', this.getDefaultMapView());

      this.map.on('moveend', this.mapMoved.bind(this));
      this.map.on('popupopen', this.mapPopUpOpen.bind(this));
      this.map.on('popupclose', this.mapPopUpClose.bind(this));

      this.map.addLayer(this.getDefaultMapLayer());
      this.updateMarkers();
    }
  },
  mapMoved: function() {
    if (this.searchByLocation && !this.mapShowingPopUp) {
      const bounds = this.map.getBounds();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();
      this.searchLocations = [new Coordinate(northEast.lat, northEast.lng), new Coordinate(southWest.lat, southWest.lng)];
      this.search();
    }
  },
  destroyMap: function() {
    this.map.remove();
    this.map = null;
  },
  updateMarkers: function() {
    if (!this.map) {
      return;
    }
    if (this.markersGroup) {
      this.map.removeLayer(this.markersGroup);
      this.markersGroup = null;
    }

    const markers = [];
    for (let i = 0; i < this.resultItems.length; i++) {
      const itemMarkers = this.resultItems[i].getMarkers(L);
      for (let j = 0; j < itemMarkers.length; j++) {
        markers.push(itemMarkers[j]);
      }
    }

    if (markers.length) {
      this.markersGroup = new L.featureGroup(markers);
      this.map.addLayer(this.markersGroup);
      if (!this.searchByLocation) {
        this.map.fitBounds(this.markersGroup.getBounds());
      }
    }
  },
  mapPopUpOpen: function() {
    this.mapShowingPopUp = true;
  },
  mapPopUpClose: function() {
    this.mapShowingPopUp = false;
  }
};
