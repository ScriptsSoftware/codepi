#!/usr/bin/env node
const {encrypt}=require('../lib/encrypt');
const {decrypt}=require('../lib/decrypt');
const {validateCodepack}=require('../lib/codepack');

const [,,cmd,...a]=process.argv;
const VERSION='1.0.0';

try{
if(cmd==='--version'||cmd==='-v'){console.log(`Code[{π*}] v${VERSION}`);process.exit(0)}
if(cmd==='encrypt'){
if(!a[0]||!a[1])throw Error('Usage: codepi encrypt "message" "password"');
console.log(encrypt(a[0],a[1]));
}else if(cmd==='decrypt'){
if(!a[0]||!a[1])throw Error('Usage: codepi decrypt "[{...}]" "password"');
console.log(decrypt(a[0],a[1]));
}else if(cmd==='validate'){
if(!a[0])throw Error('Usage: codepi validate "[{...}]"');
console.log(validateCodepack(a[0]));
}else{
console.log('Code[{π*}]');
console.log('codepi encrypt "message" "password"');
console.log('codepi decrypt "[{...}]" "password"');
console.log('codepi validate "[{...}]"');
}
}catch(error){
console.error('Error:',error.message);
process.exit(1);
}
