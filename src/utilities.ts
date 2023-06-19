export function makeImagePath(id:string, format?:string) {
  return `https://image.tmdb.org/t/p/${format?format:"original"}${id}`;
}

export function makeOverlayId(mode:string, id:string) {
  return `${mode}|${id}`;
}