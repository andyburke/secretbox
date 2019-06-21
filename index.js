'use strict';

const crypto = require( 'crypto' );
const Delver = require( 'delver' );
const extend = require( 'extend' );
const find_in_tree = require( 'util' ).promisify( require( 'walk-up' ) );
const fs = require( 'fs' );
const read_file = require( 'util' ).promisify( fs.readFile );
const traverse = require( 'traverse' );

module.exports = {
    open: async function( _options ) {
        const options = extend( true, {
            key: process.env.SECRET_BOX_KEY,
            filename: 'secretbox.json',
            path: undefined,
            directory: __dirname
        }, _options );

        let secret_box_path = options.path;

        if ( !secret_box_path ) {
            const envelope_search_result = await find_in_tree( options.directory, options.filename );

            if ( !envelope_search_result || !envelope_search_result.found ) {
                throw new Error( `Could not locate an envelope.` );
            }

            const path = require( 'path' );
            secret_box_path = path.join( envelope_search_result.path, options.filename );
        }

        const secrets_json = await read_file( secret_box_path, {
            encoding: 'utf8'
        } );

        const secret_box = {
            _cache: {},
            data: JSON.parse( secrets_json ),
            

        const environment = process.env.NODE_ENV;

        const result = {};
        const env_container = ( environment && envelope[ environment ] ) || envelope;

        options.secrets.forEach( secret => {

            let secret_spec_type = Array.isArray( secret ) ? 'array' : typeof secret;
            let secret_string = null;

            switch( secret_spec_type ) {
                case 'array':
                    secret_string = traverse( env_container ).get( secret );
                    break;
                case 'string':
                    secret_string = Delver.get( env_container, secret );
                    break;
                case 'object':
                    if ( secret.name ) {
                        secret_string = env_container[ secret.name ];
                    }
                    else if ( secret.path ) {
                        secret_string = typeof secret.path === 'string' ? Delver.get( env_container, secret.path ) : traverse( env_container ).get( secret.path );
                    }
                    break;
                default:
                    throw new Error( `Unknown secret spec type: ${ secret_spec_type }` );
            }

            if ( !secret_string ) {
                throw new Error( `Could not locate secret: ${ secret.name || secret.path } in ${ envelope_path }` );
            }

            const key = secret.key || options.key;

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
        } );

        return result;        
    }
}