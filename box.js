'use strict';

const DEFAULTS = {
    ALGORITHM: 'aes-256-gcm',
    INPUT_ENCODING: 'utf8',
    OUTPUT_ENCODING: 'base64',
    KEY_HASH_ALGORITHM: 'sha256',
    SEPARATOR: '::',
    STRING_ENCODING_FIELDS: [
        'algorithm',
        'key_hash_algorithm',
        'output_encoding',
        'iv',
        'encrypted',
        'tag'
    ]
};

function parse_secret_string( input, _options ) {
    const options = extend( true, {
        separator: '::',
        fields: [
            'algorithm',
            'key_hash_algorithm',
            'output_encoding',
            'iv',
            'encrypted',
            'tag'
        ]
    }, _options );

    const values = input.split( options.separator );

    if ( values.length !== options.encoding_fields.length ) {
        throw new Error( `Could not parse secret string: ${ input }` );
    }

    const parsed = {};
    options.encoding_fields.forEach( ( field, index ) => {
        parsed[ field ] = values[ index ];
    } );

    return parsed;
}

module.exports = {
    _cache: {},
    data: {},

    get: async function( path, options = {} ) {
        const key = options.key || process.env.SECRET_BOX_KEY;

        const encrypted = parse_secret_string( )

        const encrypted_secret = module.exports.from_string( secret_string );
        const decrypted_secret = module.exports.open( extend( true, {
            key
        }, encrypted_secret ) );

        switch( secret_spec_type ) {
            case 'array':
                traverse( result ).set( secret, decrypted_secret.decrypted );
                break;
            case 'string':
                Delver.set( result, secret, decrypted_secret.decrypted );
                break;
            case 'object':
                if ( secret.name ) {
                    result[ secret.name ] = decrypted_secret.decrypted;
                }
                else if ( secret.path ) {
                    if ( typeof secret.path === 'string' ) {
                        Delver.set( result, secret.path, decrypted_secret.decrypted );
                    }
                    else {
                        traverse( result ).set( secret.path, decrypted_secret.decrypted );
                    }
                }
                break;
        }        
    }
}