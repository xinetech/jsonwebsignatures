export const base64 = {
    encode: (unencoded) => {
      return Buffer.from(unencoded || '').toString('base64');
    },
    decode: (encoded) => {
      return Buffer.from(encoded || '', 'base64').toString('utf8');
    },
  };
  
  export const base64url = {
    encode: (unencoded) => {
      const encoded = base64.encode(unencoded);
      return encoded
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
    },
    decode: (encoded) => {
      encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
      while (encoded.length % 4) encoded += '=';
      return base64.decode(encoded);
    },
  };