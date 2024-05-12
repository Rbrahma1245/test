export function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  
  export function areAllValuesEmpty(formFields) {
    return Object.values(formFields).every((value) => !value);
  }