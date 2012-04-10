/*jslint plusplus:true, bitwise:true, sloppy:true */

// An implementation of Jenkins's one-at-a-time hash
// <http://en.wikipedia.org/wiki/Jenkins_hash_function>
function hashString(key) {
    var hash = 0, i = key.length;
    while (i--) {
        hash += key.charCodeAt(i);
        hash += (hash << 10);
        hash ^= (hash >> 6);
    }
    hash += (hash << 3);
    hash ^= (hash >> 11);
    hash += (hash << 15);
    return hash;
}

console.log(hashString('hello, world!'));
