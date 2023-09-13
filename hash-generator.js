async function sha256(message) {
    const msgBuffer = new TextEncoder('utf-8').encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function numberToWord(num) {
    switch (num) {
        case '0': return "zero";
        case '1': return "one";
        case '2': return "two";
        case '3': return "three";
        case '4': return "four";
        case '5': return "five";
        case '6': return "six";
        case '7': return "seven";
        case '8': return "eight";
        case '9': return "nine";
        case 'a': return "a";
        case 'b': return "b";
        // ... add other cases as needed
    }
}

async function findSelfDescriptiveHash() {
    const template = "The SHA256 for this sentence begins with: {} and {}.";
    
    for (let i = 0; i < 16*16; i++) {
        const firstChar = i.toString(16).charAt(0);
        const secondChar = i.toString(16).charAt(1);

        const sentence = template.replace("{}", numberToWord(firstChar)).replace("{}", numberToWord(secondChar));
        const hashResult = await sha256(sentence);

        if (hashResult.startsWith(firstChar + secondChar)) {
            document.getElementById("result").innerText = `Found a matching sentence: ${sentence}\nHash: ${hashResult}`;
            return;
        }
    }

    document.getElementById("result").innerText = 'No matching sentence found.';
}
