// checks for url parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let urlSeed = urlParams.get('seed');
let hashKey = urlSeed !== null && urlSeed.toString().length > 0 ? urlSeed : 'a';
console.log('game seed:', hashKey);

// pseudo random numbers using murmurhash3 function
// murmurhash3 for javascript written by mikolalysenko at https://github.com/mikolalysenko/murmurhash-js

// divides 32 bit hash by 32 bit highest unsigned integer
// returns float between 0 and 1
function random(seed) {
    return murmurhash3_32_gc(hashKey, seed) / 4294967295;
}