import { getValuesFromLangAware, getValueFromLangAware } from '../functions/lang-aware.js';
import { Coordinate } from './coordinate.js';

export class Place {
  constructor (rawPlace) {
    this._label = getValueFromLangAware(rawPlace, 'altLabel');
    if (rawPlace.latitude && rawPlace.longitude) {
      this._coordinate = new Coordinate(rawPlace.latitude, rawPlace.longitude);
    } else {
      this._coordinate = undefined;
    }
  }

  get label() {
    return this._label;
  }

  get hasCoordinate() {
    return this._coordinate ? true : false;
  }

  get coordinate() {
    return this._coordinate ? this._coordinate : null;
  }

  getMarker(L) {
    if (!this.hasCoordinate) {
      return null;
    }
    const marker = L.marker([this.coordinate.latitude, this.coordinate.longitude]);
    if (this.label) {
      marker.bindPopup(this.label, {maxWidth: 'auto'});
    }
    return marker;
  }
}

export class Concept {
  constructor (rawConcept) {
    this._about = rawConcept.about;
    this._labels = getValuesFromLangAware(rawConcept, 'prefLabel');
    this._notes = getValuesFromLangAware(rawConcept, 'note');
  }

  get about() {
    return this._about;
  }

  get labels() {
    return this._labels ? this._labels : [];
  }

  get notes() {
    return this._notes ? this._notes: [];
  }
}

export class ItemDetail {
  constructor (rawObject) {
    this._concepts = rawObject.concepts ? rawObject.concepts.map(c => new Concept(c)) : [];
    this._places = rawObject.places ? rawObject.places.map(p => new Place(p)) : [];
  }

  get concepts() {
    return this._concepts;
  }

  get places() {
    return this._places;
  }

  get hasPlaces() {
    return this._places.length ? true : false;
  }

  getMarkers(L) {
    return this.places.map(p => p.getMarker(L)).filter(p => p ? true : false);
  }
};
