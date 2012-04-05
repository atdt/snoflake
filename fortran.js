// FORTRAN string formatting
// TODO: handle other format codes (currently I and H)

function output(format, val) {
    var chunk, chunks, i;
    
    format = format.substring(1, format.length - 1);
    
    function formatChunk(prefix, code, suffix, tail) {
        var formatted;

        prefix = prefix.length ? parseInt(prefix, 10) : '';
        suffix = suffix.length ? parseInt(suffix, 10) : '';
    
        
        switch(code) {
        case 'H':
            tail = suffix + tail;
            formatted = tail.substring(0, prefix);
            break;
        case 'I':
            formatted = val.substring(0, suffix);
            val = val.substring(suffix);
            if (formatted.length < suffix) {
                formatted = Array(suffix - formatted.length).join('0') + formatted;
            }
            break;
        }
        return formatted;
    }
    
    chunks = format.split(',');
    
    for (i = 0; i < chunks.length; i++) {        
        result = /(\d*)(\w)(\d*)(.*)/.exec(chunks[i]);
        result = result.slice(1);
        chunks[i] = formatChunk.apply(null, result);
    }
    return chunks;
}
