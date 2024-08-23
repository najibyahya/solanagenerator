const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const readline = require('readline');

// Menghilangkan semua peringatan
process.removeAllListeners('warning');

// Simple function to convert a buffer to a Base58 string
function toBase58(buffer) {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let carry;
    const digits = [0];

    for (let i = 0; i < buffer.length; i++) {
        carry = buffer[i];
        for (let j = 0; j < digits.length; j++) {
            carry += digits[j] << 8;
            digits[j] = carry % 58;
            carry = (carry / 58) | 0;
        }
        while (carry) {
            digits.push(carry % 58);
            carry = (carry / 58) | 0;
        }
    }

    let result = '';
    for (let k = 0; k < buffer.length && buffer[k] === 0; k++) {
        result += '1';
    }
    for (let k = digits.length - 1; k >= 0; k--) {
        result += alphabet[digits[k]];
    }

    return result;
}

// Fungsi untuk menghasilkan wallet Solana
function generateWallet() {
    const keypair = Keypair.generate();
    const privateKey = toBase58(keypair.secretKey); // Convert secretKey to Base58 manually
    const publicKey = keypair.publicKey.toString();

    return { privateKey, publicKey };
}

// Fungsi utama
async function main() {
    console.log("\n================================================================");
    console.log("                     \x1b[94mSolana Wallet Generator\x1b[0m                     ");
    console.log("================================================================");
    console.log("                                                                ");
    console.log("Skrip ini menghasilkan wallet Solana secara acak. Setiap wallet ");
    console.log("memiliki Address dan private key yang aman. Data wallet akan ");
    console.log("disimpan dalam file wallet.txt dan hanya Address yang disimpan");
    console.log("dalam file address.txt.                                         ");
    console.log("                                                                ");
    console.log("            Github: \x1b[94mhttps://github.com/najibyahya\x1b[0m               ");
    console.log("              Telegram: \x1b[94mhttps://t.me/andraz404\x1b[0m                   ");
    console.log("                                                                ");
    console.log("================================================================");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (str) => new Promise(resolve => rl.question(str, resolve));
    
    const numWallets = await question("\nMasukkan jumlah wallet yang ingin dibuat: ");
    rl.close();

    for (let i = 0; i < numWallets; i++) {
        const { privateKey, publicKey } = generateWallet();

        fs.appendFileSync('wallet.txt', `${publicKey} // ${privateKey}\n`);
        fs.appendFileSync('address.txt', `${publicKey}\n`);

        console.log(`\n\x1b[93mWallet ${i + 1}\x1b[0m`);
        console.log(`\x1b[94mAddress     : \x1b[92m${publicKey}\x1b[0m`);
        console.log(`\x1b[94mPrivate Key : \x1b[92m${privateKey}\x1b[0m`);
    }

    console.log("\n\x1b[93mAddress & Private Key » wallet.txt");
    console.log("Address Only » address.txt\x1b[0m\n");
}

main();
