export class Pagination {
  constructor(apiResult, itemsPerpage, currentPage) {
    this._pages = apiResult.itemsCount ? Math.ceil(apiResult.totalResults / itemsPerpage) : 0;
    this._currentPage = currentPage;
  }

  get pages() {
    return this._pages;
  }

  getPagesArray(skip = true) {
    const pages = [];

    const shouldSkip = p => {
      if (this._pages > 5) {
        if (p === 1 || p === this._currentPage) {
          return false;
        }
        if (p === this.pages) {
          return false;
        }
        if (Math.abs(p - this._currentPage) < 3) {
          return false;
        }
        return true;
      }
      return false;
    };

    for (let i = 1; i <= this._pages; i++) {
      if (skip && shouldSkip(i)) {
        if (!pages.length || !pages[pages.length - 1].isSkippingPage) {
          pages.push({
            page: '…',
            class: {
              disabled: true
            },
            isSkippingPage: true
          });
        }
        continue;
      }

      pages.push({
        page: i,
        class: {
          active: i === this._currentPage
        }
      });
    }
    return pages;
  }
}
