
export const metaData = function(metaData){
  const metas = [
    { hid: 'twitter:title', name: 'twitter:title', content: metaData.title},
    { hid: 'twitter:description', name: 'twitter:description', content: metaData.description},
    { hid: 'twitter:image', name: 'twitter:image', content: metaData.image},
    { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: metaData.imageAlt},

    { hid: 'og:title', name: 'og:title', content: metaData.title},
    { hid: 'og:description', name: 'og:description', content: metaData.description},
    { hid: 'og:image', name: 'og:image', content: metaData.image},
    { hid: 'og:image:alt', name: 'og:image:alt', content: metaData.imageAlt},
  ]
  return metas;
}

export const toCapitalize = function(text){
  let split = text.toLowerCase().split(' ');
  return split.map(i=>{
    let n = i.split('')
    n[0] = n[0].toUpperCase();
    return n.join('')
  }).join(' ')
}

export const uuidv4 = function() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}