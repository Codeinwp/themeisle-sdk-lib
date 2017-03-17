const installPluginOrTheme = ( slug, theme = false ) => {
	return new Promise( ( resolve ) => {
		wp.updates.ajax( theme === true ? 'install-theme' : 'install-plugin', {
			slug,
			success: (response) => {
				resolve( { success: true, data: response } );
			},
			error: ( err ) => {
				resolve( { success: false, code: err.errorCode } );
			},
		} );
	} );
};

const activatePlugin = ( url ) => {
	return new Promise( ( resolve ) => {
		jQuery
			.get( url )
			.done( () => {
				resolve( { success: true } );
			} )
			.fail( () => {
				resolve( { success: false } );
			} );
	} );
};


const flatRecursively = ( r, a ) => {
	const b = {};
	Object.keys( a ).forEach( function ( k ) {
		if ( 'innerBlocks' !== k ) {
			b[ k ] = a[ k ];
		}
	} );
	r.push( b );
	if ( Array.isArray( a.innerBlocks ) ) {
		b.innerBlocks = a.innerBlocks.map( ( i ) => {
			return i.id;
		} );
		return a.innerBlocks.reduce( flatRecursively, r );
	}
	return r;
};

/**
 * Get blocks by type.
 *
 * @param {Array} blocks blocks array.
 * @param {string} type type of block looking for.
 *
 * @return {Array} array of blocks of {type} in page
 */
const getBlocksByType = ( blocks, type ) =>
	blocks.reduce( flatRecursively, [] ).filter( ( a ) => type === a.name );

export { installPluginOrTheme, activatePlugin, getBlocksByType };

