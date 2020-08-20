
import {createDiffieHellman, createDiffieHellmanGroup} from 'diffie-hellman';

import { ec as EllipticCurve, ec } from 'elliptic';

class ECDH{
    instance = null;
    keyPair = null;

    constructor(){
        this.instance = EllipticCurve('secp256k1');
        this.keyPair = this.instance.genKeyPair();
    }

    getPublicKey(){
        return this.keyPair.getPublic();
    }

    getInstance(){
        return this.instance;
    }
    getKeyPair(){
        return this.keyPair;
    }
}


export default ECDH;