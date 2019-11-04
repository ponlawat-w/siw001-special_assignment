import { CONFIG } from '../../settings.js';
import { ResultItem } from './classes/result-item.js';
import { Pagination } from './classes/pagination.js';

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
      pagination: null
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
          if (!params.qf) {
            params.qf = 'provider_aggregation_edm_dataProvider:"Thyssen-Bornemisza Museum"';
          }
          if (!params.query) {
            params.query = '*';
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

        this.query().then(function(result) {
          this.loading = false;
          if (!result.success) {
            return;
          }
          this.resultItems = result.items.map(x => new ResultItem(x));
          this.totalResults = result.totalResults;
          this.pagination = new Pagination(result, this.itemsPerPage, this.page);
        }.bind(this)).catch(errorHandler);
      },
      setPage: function(page) {
        this.page = page;
        this.search();
      }
    },
    mounted: function() {
      this.search();
    }
  });
});
