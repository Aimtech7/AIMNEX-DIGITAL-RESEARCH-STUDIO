import assert from 'node:assert/strict';
import {isPublicAddress} from '../lib/domain-safety.ts';
for(const ip of ['127.0.0.1','10.0.0.1','192.168.1.1','172.16.0.1','169.254.169.254','100.64.0.1','198.18.0.1','192.0.2.1','198.51.100.1','203.0.113.1','0.0.0.0','224.0.0.1','::1','fc00::1','fe80::1','::ffff:127.0.0.1','2001:db8::1','2002:7f00:1::'])assert.equal(isPublicAddress(ip),false,ip);
for(const ip of ['1.1.1.1','8.8.8.8','2606:4700:4700::1111','2a00:1450:4009::200e'])assert.equal(isPublicAddress(ip),true,ip);
console.log('PASS: 22 public/private address checks.');
