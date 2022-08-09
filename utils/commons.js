export function validateEmail(email) {
  var emailValidationRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailValidationRegex.test(email);
}

export function selectedLocation(locations) {
  let maxConfidence = 0;
  let selected = 0;
  for (let i = 0; i < locations.length; i++) {
    if (locations[i].confidence > maxConfidence) {
      maxConfidence = locations[i].confidence;
      selected = i;
    }
  }
  return locations[selected];
}
