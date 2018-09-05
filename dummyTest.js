let name = /^[a-zA-Z\u00C0-\u017F]+\.?\s?[a-zA-Z\u00C0-\u017F]+[.,-]?\.?\s?[a-zA-Z\u00C0-\u017F]+[.,-]?$/

let address = /^[a-zA-Z\u00C0-\u017F0-9.,\s]+$/

console.log( name.test( 'Hajdú' ) )
console.log( name.test( 'Hajdú-Bíhar' ) )
console.log( address.test( 'Thomas Mann u. 31' ) )
