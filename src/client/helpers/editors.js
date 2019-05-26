export function getEditorLocation(tags) {
    let location = 'editor';
    if (tags) {
      if (tags.indexOf("farmr") > -1) {
        if (tags.indexOf("farmr-ned") > -1) {
          location = 'farmr-ned';
        } else if (tags.indexOf("farmr-ned") > -1) {
          location = 'farmr-ned';
        } else {
          location = 'main-editor';
        }
      } else if (tags.indexOf("untalented") > -1) {
          location = 'untalented';
      }
    }
    return location;
}
