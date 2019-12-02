export const getValuesFromLangAware = (rawItem, propertyName, backupProperty = undefined, language = 'en') => {
  const returnValues = rawItem[propertyName] && rawItem[propertyName][language] ? rawItem[propertyName][language] : undefined;
  if (returnValues) {
    return returnValues;
  }
  if (backupProperty && rawItem[backupProperty]) {
    return rawItem[backupProperty];
  }
  return undefined;
}

export const getValueFromLangAware = (rawItem, propertyName, backupProperty = undefined, language = 'en', index = 0) => {
  const values = getValuesFromLangAware(rawItem, propertyName, backupProperty, language);
  return values && values[index] ? values[index] : undefined;
}
