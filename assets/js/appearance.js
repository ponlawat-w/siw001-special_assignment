const $loading = $('#loading');
const $resultItemTemplate = $('#result-item-template');
const $searchResults = $('#search-results');
const $resultItems = $('#result-items');

export const appearance = {
  startUp: () => {
    $loading.hide();
    $resultItemTemplate.hide();
  },
  startLoad: () => {
    $loading.show();
    $searchResults.hide();
  },
  stopLoad: () => {
    $loading.hide();
    $searchResults.show();
  },
  updateResultItems: resultItems => {
    $resultItems.html('');
    for (let i = 0; i < resultItems.length; i++) {
      const resultItem = resultItems[i];
      const $resultItem = $resultItemTemplate.clone().show();
      if (resultItem.previews.length) {
        $resultItem.find('.result-item-image').attr('src', resultItem.previews[0]);
      } else {
        $resultItem.find('.result-item.image').hide();
      }
      $resultItem.find('.result-item-title').html(resultItem.title);

      $resultItems.append($resultItem);
    }
  }
};
