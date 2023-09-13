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
    const sentenceTemplate = document.getElementById("sentenceTemplate").value;
    let counter = 0;
    let hashResult;

    while (counter < 100000) { // Limit to prevent indefinite loop
        const sentenceWithCounter = sentenceTemplate.replace(/{{counter}}/g, counter.toString());

        hashResult = await sha256(sentenceWithCounter);
        let bracketMatches = [...sentenceWithCounter.matchAll(/{{}}/g)];
        if (bracketMatches.length <= hashResult.length) {
            let isMatch = true;
            let newSentence = sentenceWithCounter;
            for (let i = 0; i < bracketMatches.length; i++) {
                const word = hexToWord[hashResult[i]];
                if (!word) {
                    isMatch = false;
                    break;
                }
                newSentence = newSentence.replace("{{}}", word);
            }

            if (isMatch) {
                document.getElementById("result").innerText = `Found a matching sentence: ${newSentence}\nHash: ${hashResult}`;
                return;
            }
        }

        counter++;
    }
    document.getElementById("result").innerText = `No matching sentence found.`;
}
