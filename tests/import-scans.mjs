import assert from 'node:assert/strict';
import {parseScan} from '../lib/import-scans.ts';
assert.equal(parseScan('Nuclei',JSON.stringify({info:{name:'Observation',severity:'high'},host:'https://example.com'}))[0].severity,'High');
assert.equal(parseScan('SARIF',JSON.stringify({runs:[{results:[{ruleId:'R1',level:'warning',message:{text:'Check source.'}}]}]}))[0].title,'R1');
assert.equal(parseScan('Nmap','<nmaprun><host><address addr="127.0.0.1"/><ports><port protocol="tcp" portid="80"><state state="open"/><service name="http"/></port></ports></host></nmaprun>')[0].severity,'Informational');
assert.throws(()=>parseScan('Nmap','<!DOCTYPE a [<!ENTITY x SYSTEM "file:///etc/passwd">]><nmaprun/>'));
assert.throws(()=>parseScan('Nuclei','not-json'));
assert.throws(()=>parseScan('Nuclei',JSON.stringify(Array(101).fill({info:{name:'too many'}}))));
console.log('PASS: Nuclei/SARIF/Nmap normalization, malformed input rejection, DTD rejection and batch limits.');
