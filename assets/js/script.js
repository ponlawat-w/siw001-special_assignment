import { CONFIG } from '../../settings.js';
import { ResultItem } from './classes/result-item.js';
import { Pagination } from './classes/pagination.js';
import { Coordinate } from './classes/coordinate.js';

$(document).ready(() => {
  var app = new Vue({
    el: '#app',
    data: {
      loading: false,
      error: null,
      resultItems: [],
      totalResults: 0,
      itemsPerPage: 12,
      page: 1,
      pagination: null,
      view: 'list',
      map: null,
      markersGroup: null,
      searchByLocation: false,
      searchLocations: []
    },
    computed: {
      pages: function() {
        return this.pagination ? this.pagination.pages : 0;
      }
    },
    methods: {
      query: function(params = {}) {
        return new Promise(function(resolve, reject) {
          if (!params.wskey) {
            params.wskey = CONFIG.apiKey;
          }
          if (!params.query) {
            params.query = 'Thyssen-Bornemisza';
            // params.query = 'pl_wgs84_pos_lat:[27+TO+62]+AND+pl_wgs84_pos_long:[-36+TO+40]+AND+Thyssen-Bornemisza';
          }
          if (!params.rows) {
            params.rows = this.itemsPerPage;
          }
          if (!params.start) {
            params.start = ((this.page - 1) * this.itemsPerPage) + 1;
          }
          const queryString = Object.keys(params).map(key => `${key}=${encodeURI(params[key])}`).join('&');
          const url = `https://www.europeana.eu/api/v2/search.json?${queryString}`;
          return $.get(url).then(results => resolve(results)).catch(error => reject(error));
        }.bind(this));
      },
      buildKeywords: function() {
        const keywords = ['Thyssen-Bornemisza'];

        if (this.searchByLocation && this.searchLocations.length > 1) {
          const lats = [this.searchLocations[0].latitude, this.searchLocations[1].latitude];
          const lngs = [this.searchLocations[0].longitude, this.searchLocations[1].longitude];

          keywords.push(`pl_wgs84_pos_lat:[${Math.min(...lats)}+TO+${Math.max(...lats)}]`);
          keywords.push(`pl_wgs84_pos_long:[${Math.min(...lngs)}+TO+${Math.max(...lngs)}]`);
        }

        return keywords;
      },
      search: function() {
        this.loading = true;
        this.resultItems = [];
        this.error = null;

        const errorHandler = function(error) {
          this.loading = false;
          if (error.responseJSON && error.responseJSON.error) {
            this.error = error.responseJSON.error;
          } else if (this.statusText) {
            this.error = (this.status ? this.status + ' - ' : '') + this.statusText;
          } else {
            this.error = 'Error';
          }
        }.bind(this);

        const queryKeyword = this.buildKeywords().join('+AND+');
        const params = {
          query: queryKeyword
        };

        this.query(params).then(function(result) {
          this.loading = false;
          if (!result.success) {
            return;
          }
          this.resultItems = result.items.map(x => new ResultItem(x));
          this.totalResults = result.totalResults;
          this.pagination = new Pagination(result, this.itemsPerPage, this.page);
          this.updateMarkers();
        }.bind(this)).catch(errorHandler);
      },
      setPage: function(page) {
        this.page = page;
        this.search();
      },
      selectPage: function() {
        this.setPage(this.page);
      },
      openItem: function(item) {
      },
      setView: function(view) {
        if (view === 'list' || view === 'map') {
          if (this.view === 'map' && view !== 'map') {
            this.destroyMap();
          }
          this.view = view;
        }
      },
      initiateMap: function() {
        if (!this.map) {
          this.map = L.map('map', {
            center: [40.4160447, -3.6971141],
            zoom: 6
          });

          this.map.on('moveend', this.mapMoved.bind(this));

          this.map.addLayer(L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${CONFIG.mapboxAccessToken}`, {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: CONFIG.mapboxAccessToken
          }));
          this.updateMarkers();
        }
      },
      mapMoved: function() {
        if (this.searchByLocation) {
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
    },
    mounted: function() {
      this.search();
    },
    updated: function() {
      if (this.view === 'map' && !this.map && document.getElementById('map')) {
        this.initiateMap();
      }
    }
  });
});
