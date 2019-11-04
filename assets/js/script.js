import { CONFIG } from '../../settings.js';
import { ResultItem } from './classes/result-item.js';

$(document).ready(() => {
  var app = new Vue({
    el: '#app',
    data: {
      loading: false,
      resultItems: []
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
          const queryString = Object.keys(params).map(key => `${key}=${encodeURI(params[key])}`).join('&');
          const url = `https://www.europeana.eu/api/v2/search.json?${queryString}`;
          return $.get(url).then(results => resolve(results)).catch(error => reject(error));
        });
      },
      search: function() {
        this.loading = true;
        this.query().then(function(results) {
          this.resultItems = results.items.map(x => new ResultItem(x));
          this.loading = false;
        }.bind(this)).catch(function(error) {
          this.loading = false;
        }.bind(this));
      }
    },
    mounted: function() {
      this.search();
    }
  });
});
