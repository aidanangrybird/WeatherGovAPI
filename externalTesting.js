import apiStuff from './apiStuff.mjs';
const { getSPCOutlook } = apiStuff;
let val = apiStuff.getSPCOutlook(1);  // val is "Hello";
console.log(val);