import { queryMethods } from './methods/queries.js';
import { paginationMethods } from './methods/paginations.js';
import { mapMethods } from './methods/maps.js';
import { viewMethods } from './methods/views.js';

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
      ...queryMethods,
      ...paginationMethods,
      ...mapMethods,
      ...viewMethods,
      openItem: function(item) {
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
