import { CONFIG } from '../../settings.js';
import { appearance } from './appearance.js';
import { ResultItem } from './classes/result-item.js';

$(document).ready(() => {
  const search = (params = {}) => new Promise((resolve, reject) => {
    appearance.startLoad();
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
    $.get(url).then(result => {
      resolve(result);
      appearance.stopLoad();
    }).catch(error => {
      reject(error);
      appearance.stopLoad();
    });
  });

  const searchAction = () => {
    search().then(results => {
      const items = results.items.map(x => new ResultItem(x));
      console.log(items);
      appearance.updateResultItems(items);
    });
  };

  const initial = () => {
    appearance.startUp();
    searchAction();
  };

  initial();
});
