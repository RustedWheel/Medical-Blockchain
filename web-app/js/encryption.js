// const _key = '5266556A586E3272357538782F413F442A472D4B6150645367566B5970337336';
// const _initialisationVector = 'Jhs8/MFOrBhevTzoE6t0IQ==';

function loaded() {
    //var buf = crypto.randomBytes(1024 / 8) // 128 bytes
    //buf = new Uint32Array(new Uint8Array(buf).buffer)

    //sjcl.random.addEntropy(buf, 1024, "crypto.randomBytes")

    sjcl.random.startCollectors();
  }


  function getRandomSalt(words, paranoia) {

    console.log("Computing salt"); 
    var salt = sjcl.random.randomWords(words, paranoia);
    console.log(salt); 

    return salt;
  }

  function kdf(password, salt){

     console.log("Password: " + password);

     var iterations = 10000;

     var keyLength = 256;

     if (password.length == 0) {
        error("Need a password!");
        return;
     }

     var keyBitArray = sjcl.misc.pbkdf2(password, salt, iterations, keyLength);

     var key = sjcl.codec.hex.fromBits(keyBitArray);

     console.log(key);

     return key;
  }

  function symEncrypt(data, key, iv){

    console.log("Encrypting data: Data = " + data + " Key = " + key);

     if (data === '') { return ''; }
     if (key.length == 0) {
       error("Need a key!");
       return;
     }

    key = sjcl.codec.hex.toBits(key);

     // Key must be in bit array
     var result = sjcl.encrypt(key, data, {iv : iv, mode : "ccm"});

     console.log(result);

     return result;
  }


  function symDecrypt(encryptedData, key, iv){

     if (encryptedData.length === 0) { return ''; }
     if (key.length == 0) {
       error("Need a key!");
       return;
     }
     if (iv.length === 0) {
      error("Can't decrypt: need an IV!"); return;
     }

     key = sjcl.codec.hex.toBits(key);

     key = new sjcl.cipher.aes(key);

     initialisationVector = sjcl.codec.base64.toBits(iv);

     encryptedData = sjcl.codec.base64.toBits(encryptedData);

     var data = sjcl.codec.utf8String.fromBits(sjcl.mode.ccm.decrypt(key, encryptedData, initialisationVector));

     console.log(data);

     return data;
  }

