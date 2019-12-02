export const paginationMethods = {
  setPage: function(page) {
    this.page = page;
    this.search();
  },
  selectPage: function() {
    this.setPage(this.page);
  }
};
