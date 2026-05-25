// Small DOM helpers shared by the example modules.

// Fetch a SNOBOL source file bundled with the demo.
export async function loadSource( url ) {
    const response = await fetch( url );
    if ( !response.ok ) {
        throw new Error( 'Could not load ' + url.pathname );
    }
    return response.text();
}

// Populate a <select> from a { key: { label } } preset table.
export function fillSelect( select, presets ) {
    for ( const [ key, preset ] of Object.entries( presets ) ) {
        const option = document.createElement( 'option' );
        option.value = key;
        option.textContent = preset.label;
        select.append( option );
    }
}
