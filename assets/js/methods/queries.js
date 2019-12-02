import { CONFIG } from '../../../settings.js';
import { ResultItem } from '../classes/result-item.js';
import { Pagination } from '../classes/pagination.js';

export const queryMethods = {
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
  }
};
