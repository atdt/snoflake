// Small DOM helpers shared by the example modules.

// Return a setter for an element's text content, used for the status lines.
export const textSetter = ( el ) => ( text ) => {
    el.textContent = text;
};

// Populate a <select> from a { key: { label } } preset table.
export function fillSelect( select, presets ) {
    for ( const [ key, preset ] of Object.entries( presets ) ) {
        const option = document.createElement( 'option' );
        option.value = key;
        option.textContent = preset.label;
        select.append( option );
    }
}
