import { ItemDetail } from '../classes/item-detail.js';

export const itemMethods = {
  openItemFromId: function(id) {
    for (let i = 0; i < this.resultItems.length; i++) {
      if (this.resultItems[i].id === id) {
        this.openItem(this.resultItems[i]);
        break;
      }
    }
  },
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
    if (this.selectedItem.map) {
      this.selectedItem.map.remove();
      this.selectedItem.map = null;
    }
    $('body').removeClass('modal-open');
  },
  setItemPreview: function(index) {
    this.selectedItem.previewIndex = index;
  },
  initiateItemMap: function() {
    if (!this.selectedItem.map) {
      this.selectedItem.map = L.map('dialog-map', this.getDefaultMapView());
      this.selectedItem.map.addLayer(this.getDefaultMapLayer());
      const markerGroup = new L.featureGroup(this.selectedItem.detail.getMarkers(L));
      this.selectedItem.map.addLayer(markerGroup);
      this.selectedItem.map.fitBounds(markerGroup.getBounds());
    }
  }
};
