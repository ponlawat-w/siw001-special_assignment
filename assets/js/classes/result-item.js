const getValuesFromLangAware = (rawItem, propertyName, language = 'en') => {
  return rawItem[propertyName] && rawItem[propertyName][language] ? rawItem[propertyName][language] : undefined;
}

const getValueFromLangAware = (rawItem, propertyName, language = 'en', index = 0) => {
  const values = getValuesFromLangAware(rawItem, propertyName, language);
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
    this._title = getValueFromLangAware(rawItem, 'dcTitleLangAware');
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

  get previews() {
    return this._previews ? this._previews : [];
  }

  get timespanLabels() {
    return this._timespanLabels ? this._timespanLabels : [];
  }

  get title() {
    return this._title ? this._title : 'N/A';
  }
}
