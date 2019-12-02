import { ItemDetail } from '../classes/item-detail.js';

export const itemMethods = {
  openItem: function(item) {
    this.selectedItem.resultItem = item;
    this.selectedItem.previewIndex = 0;
    $('body').addClass('modal-open');

    this.selectedItem.detail = null;
    if (this.selectedItem.resultItem.link) {
      this.selectedItem.loading = true;
      const loadFinally = function() {
        this.selectedItem.loading = false;
      }.bind(this);

      $.get(this.selectedItem.resultItem.link).then(function(response) {
        loadFinally();
        this.selectedItem.detail = new ItemDetail(response.object);
      }.bind(this)).catch(function() {
        loadFinally();
      }.bind(this));
    }
  },
  closeItem: function() {
    this.selectedItem.resultItem = null;
    $('body').removeClass('modal-open');
  },
  setItemPreview: function(index) {
    this.selectedItem.previewIndex = index;
  }
};
