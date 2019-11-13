import { Coordinate } from './coordinate.js';

const getValuesFromLangAware = (rawItem, propertyName, backupProperty = undefined, language = 'en') => {
  const returnValues = rawItem[propertyName] && rawItem[propertyName][language] ? rawItem[propertyName][language] : undefined;
  if (returnValues) {
    return returnValues;
  }
  if (backupProperty && rawItem[backupProperty]) {
    return rawItem[backupProperty];
  }
  return undefined;
}

const getValueFromLangAware = (rawItem, propertyName, backupProperty = undefined, language = 'en', index = 0) => {
  const values = getValuesFromLangAware(rawItem, propertyName, backupProperty, language);
  return values && values[index] ? values[index] : undefined;
}

export class ResultItem {
  constructor(rawItem) {
    this._id = rawItem.id;
    this._link = rawItem.link;
    this._type = rawItem.type;
    this._year = rawItem.year;

    this._concepts = getValuesFromLangAware(rawItem, 'edmConceptPrefLabelLangAware');
    this._countries = rawItem.country;
    this._creators = rawItem.dcCreator;
    this._previews = rawItem.edmPreview;
    this._timespanLabels = getValuesFromLangAware(rawItem, 'edmTimespanLabelLangAware');
    this._title = getValueFromLangAware(rawItem, 'dcTitleLangAware', 'title');

    if (rawItem.edmPlaceLatitude && rawItem.edmPlaceLongitude) {
      this._coordinates = [];
      for (let i = 0; i < rawItem.edmPlaceLatitude.length; i++) {
        if (!rawItem.edmPlaceLongitude[i]) {
          break;
        }

        this._coordinates.push(new Coordinate(rawItem.edmPlaceLatitude[i], rawItem.edmPlaceLongitude[i]));
      }
    }
  }

  get id() {
    return this._id ? this._id : undefined;
  }

  get link() {
    return this._link ? this._link : undefined;
  }

  get type() {
    return this._type ? this._type : undefined;
  }

  get year() {
    return this._year ? this._year : undefined;
  }

  get concepts() {
    return this._concepts ? this._concepts : [];
  }

  get countries() {
    return this._countries ? this._countries : [];
  }

  get creators() {
    return this._creators ? this._creators : [];
  }

  get hasPreview() {
    return this._previews && this._previews.length ? true : false;
  }

  get previews() {
    return this.hasPreview ? this._previews : [];
  }

  get preview() {
    return this.hasPreview ? this._previews[0] : undefined;
  }

  get timespanLabels() {
    return this._timespanLabels ? this._timespanLabels : [];
  }

  get title() {
    return this._title ? this._title : 'N/A';
  }

  get coordinates() {
    return this._coordinates ? this._coordinates : [];
  }

  get hasCoordinates() {
    return this.coordinates && this.coordinates.length;
  }

  getMarkers(L) {
    if (this.hasCoordinates) {
      const img = this.hasPreview ? `<p><img src="${this.preview}" class="popup-img"></p>` : '';
      const coordinates = this.coordinates;
      const markers = [];
      for (let i = 0; i < coordinates.length; i++) {
        const marker = L.marker([coordinates[i].latitude, coordinates[i].longitude]);
        marker.bindPopup(`${img}<div class="font-weight-bold">${this.title}</div>`, {
          maxWidth: 'auto'
        });
        markers.push(marker);
      }
      return markers;
    }
    return [];
  }
}
