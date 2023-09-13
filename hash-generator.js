async function sha256(message) {
    // Encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(message);
    
    // Hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // Convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

const hexToWord = {
    '0': 'zero',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine',
    'a': 'a',
    'b': 'bee',
    'c': 'see',
    'd': 'dee',
    'e': 'e',
    'f': 'eff'
};

function replacePlaceholders(sentence, hash) {
    let currentHashIndex = 0;
    while (sentence.includes("{{}}") && currentHashIndex < hash.length) {
        sentence = sentence.replace("{{}}", hexToWord[hash[currentHashIndex]]);
        currentHashIndex++;
    }
    return sentence;
}

async function findMatchingSentence() {
    const baseSentence = document.getElementById("baseSentence").value;
    let counter = 0;
    const MAX_ITERATIONS = 100000;  // For demonstration purposes
    
    try {
        for (let i = 0; i < MAX_ITERATIONS; i++) {
            const currentSentence = replacePlaceholders(baseSentence, await sha256(baseSentence.replace("{{}}", i.toString())));
            const currentHash = await sha256(currentSentence);
            if (currentSentence.includes("{{}}") === false && currentHash.startsWith(currentSentence.match(/: (\w+),/)[1])) {
                document.getElementById("result").innerText = `Found a matching sentence: ${currentSentence}\nHash: ${currentHash}`;
                return;
            }
        }
        document.getElementById("result").innerText = 'No matching sentence found.';
    } catch (err) {
        console.error(err);
        document.getElementById("result").innerText = 'An error occurred.';
    }
}

document.getElementById("findButton").addEventListener("click", findMatchingSentence);
