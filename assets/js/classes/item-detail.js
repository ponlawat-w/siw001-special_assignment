import { getValuesFromLangAware, getValueFromLangAware } from '../functions/lang-aware.js';

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
  }

  get concepts() {
    return this._concepts;
  }
};
