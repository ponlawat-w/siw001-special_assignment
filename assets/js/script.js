import { queryMethods } from './methods/queries.js';
import { paginationMethods } from './methods/paginations.js';
import { mapMethods } from './methods/maps.js';
import { viewMethods } from './methods/views.js';
import { itemMethods } from './methods/items.js';

$(document).ready(() => {
  const app = new Vue({
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
      mapShowingPopUp: false,
      markersGroup: null,
      searchByLocation: false,
      searchLocations: [],
      selectedItem: {
        previewIndex: 0,
        resultItem: null,
        detail: null,
        loading: false,
        map: null
      }
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
      ...itemMethods
    },
    mounted: function() {
      this.search();
    },
    updated: function() {
      if (this.view === 'map' && !this.map && document.getElementById('map')) {
        this.initiateMap();
      }
      if (this.selectedItem.detail && this.selectedItem.detail.hasPlaces && document.getElementById('dialog-map')) {
        this.initiateItemMap();
      }
    }
  });

  $(document).on('click', '.popup-btn', function(event) {
    const $target = $(event.target);
    app.openItemFromId(decodeURI($target.attr('data-id')));
  });
});
