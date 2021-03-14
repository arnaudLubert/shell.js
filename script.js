'use strict';

let consol;
let cursor = 0;
let blinkTimout;
let mark = false;

function onLoad() {
    const newLine = document.createElement('p');
    newLine.innerHTML = navigator.platform + ':&nbsp;&nbsp;';
    cursor = navigator.platform.length + 2;
    consol = newLine;
    document.body.appendChild(newLine);
    blink();
}

function blink() {

    if (mark)
        consol.innerHTML = consol.textContent;
    else
        consol.innerHTML = consol.textContent.substr(0, cursor) + "<mark id=\"mark\">" + consol.textContent.charAt(cursor) + "</mark>" + consol.textContent.substr(cursor + 1, consol.textContent.length);

    mark = !mark;
    blinkTimout = setTimeout(blink, 700);
}

function AppendText(character) {
    if (cursor === consol.textContent.length - 1)
        consol.textContent = consol.textContent.substr(0, cursor) + character + consol.textContent.substr(cursor, consol.textContent.length);
    else
        consol.textContent = consol.textContent.substr(0, cursor) + character + consol.textContent.substr(cursor + 1, consol.textContent.length);
    cursor++;

    if (blinkTimout)
        clearTimeout(blinkTimout);
    mark = false;
    blinkTimout = setTimeout(blink, 700);
}

function ClearText() {
    consol.innerHTML = "";
    cursor = 0;
}

function isPrintable(keyCode) {
    if ((keyCode > 31 && keyCode < 127))
        return true;

    return false;
}

document.addEventListener('keypress', function(event) {
    let key = event.charCode || event.keyCode; // Unicode

    if (key > 31 && key < 127) { // letter
        AppendText(String.fromCharCode(key));

        if (blinkTimout)
            clearTimeout(blinkTimout);
        mark = false;
        blink();
    }
});

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 8: // delete
            if (cursor > navigator.platform.length + 2) {
                cursor--;
                consol.textContent = consol.textContent.substr(0, cursor) + consol.textContent.substr(cursor + 1, consol.textContent.length);

                if (blinkTimout)
                    clearTimeout(blinkTimout);
                mark = false;
                blink();
            }
            break;
        case 9: // tab

            break;
        case 13: // enter
            if (blinkTimout)
                clearTimeout(blinkTimout);
            consol.innerHTML = consol.textContent.substr(0, consol.textContent.length - 1);
            execute(consol.textContent.substr(navigator.platform.length + 2));
            const newLine = document.createElement('p');
            newLine.innerHTML = navigator.platform + ':&nbsp;&nbsp;';
            cursor = navigator.platform.length + 2;
            consol = newLine;
            document.body.appendChild(newLine);
            mark = false;
            blink();
            break;
        case 37: // left arrow
            if (cursor > navigator.platform.length + 2) {
                cursor--;

                if (blinkTimout)
                    clearTimeout(blinkTimout);
                mark = false;
                blink();
            }
            break;
        case 39: // right arrow
            if (cursor < consol.textContent.length - 1) {
                cursor++;

                if (blinkTimout)
                    clearTimeout(blinkTimout);
                mark = false;
                blink();
            }
            break;
        case 46: // delete
            if (cursor < consol.textContent.length - 1) {
                consol.textContent = consol.textContent.substr(0, cursor) + consol.textContent.substr(cursor + 1, consol.textContent.length);

                if (blinkTimout)
                    clearTimeout(blinkTimout);
                mark = false;
                blink();
            }
            break;
    }
});

function writeLine(str) {
    const resp = document.createElement('p');
    resp.innerText = str;
    document.body.appendChild(resp);
}

function writeLink(str, link) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.innerText = str;
    a.href = link;
    p.appendChild(a);
    document.body.appendChild(p);
}

function execute(line) {
    const parts = line.split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
        case 'help':
            writeLine('Available commands: cd clear credit date exit htop ls reboot shutdown user-agent');
            break;
        case 'clear':
            document.body.innerHTML = '';
            break;
        case 'credit':
            writeLine('Made by arnaud.lubert@epitech.eu');
            writeLine('14/03/2021');
            writeLink('https://citadelle-du-web.com', 'https://citadelle-du-web.com');
            break;
        case 'date':
            const now = new Date();
            const str = getDay(now.getDay()) + ' ' + now.getDate() + ' ' + getMonth(now.getMonth()) + ' ' + (now.getYear() + 1900) + ' ' + now.toLocaleTimeString() + ' CET';
            writeLine(str);
            break;
        case 'user-agent':
            writeLine(navigator.userAgent);
            break;
        case 'htop':
            writeLine('Device memory: ' + navigator.deviceMemory + ' Go');
            break;
        case 'ls':
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200)
                    for (const url of this.responseXML.documentElement.children)
                        writeLink(url.getElementsByTagName('loc')[0].childNodes[0], url.getElementsByTagName('loc')[0].childNodes[0]);
            };
            xhttp.open("GET", "/sitemap.xml", true);
            xhttp.send();
            break;
        case 'cd':
            if (args[0])
                location.href = args[0];
            else
                writeLine('400 Invalid Argument');
            break;
        case 'exit':
        case 'shutdown':
            location.href = 'https://citadelle-du-web.com';
            break;
        case 'reboot':
            location.reload();
            break;
        default:
            writeLine('400 Bad Request');
    }
}

function getDay(nbr) {
    switch (nbr) {
        case 0: return 'Sun';
        case 1: return 'Mon';
        case 2: return 'Tue';
        case 3: return 'Wed';
        case 4: return 'Thu';
        case 5: return 'Fri';
        case 6: return 'Sat';
    }
}

function getMonth(nbr) {
    switch (nbr) {
        case 0: return 'jan';
        case 1: return 'feb';
        case 2: return 'mar';
        case 3: return 'apr';
        case 4: return 'may';
        case 5: return 'jun';
        case 6: return 'jul';
        case 7: return 'aug';
        case 8: return 'sep';
        case 9: return 'oct';
        case 10: return 'nov';
        case 11: return 'dec';
    }
}
