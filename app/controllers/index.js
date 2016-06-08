// use functions placed in library
var lib = require("operationslib");
// set up the accumulators
var m_accum, d_accum, c_accum, l_accum, x_accum, v_accum, i_accum;

var current_num = { M: '', D: '', C: '', L: '', X: '', V: '', I: '', CM: '', CD: '', XC: '', XL: '', IX: '', IV: '', arabic: 0, MStore: '' };
var last0_num   = { M: '', D: '', C: '', L: '', X: '', V: '', I: '', CM: '', CD: '', XC: '', XL: '', IX: '', IV: '', arabic: 0, MStore: '' };
var last1_num   = { M: '', D: '', C: '', L: '', X: '', V: '', I: '', CM: '', CD: '', XC: '', XL: '', IX: '', IV: '', arabic: 0, MStore: '' };
var total_num   = { M: '', D: '', C: '', L: '', X: '', V: '', I: '', CM: '', CD: '', XC: '', XL: '', IX: '', IV: '', arabic: 0, MStore: '' };
var totalDisplayed = false;
var key_state = {
    M : { active: true, opacity: 1.0, id: '$.lbl_m' },
    D : { active: true, opacity: 1.0, id: '$.lbl_d' },
    C : { active: true, opacity: 1.0, id: '$.lbl_c' },
    L : { active: true, opacity: 1.0, id: '$.lbl_l' },
    X : { active: true, opacity: 1.0, id: '$.lbl_x' },
    V : { active: true, opacity: 1.0, id: '$.lbl_v' },
    I : { active: true, opacity: 1.0, id: '$.lbl_i' },
};

var roman_array = ['M', 'D', 'C', 'L', 'X', 'V', 'I'];
//var roman_array = ['m', 'd', 'c', 'l', 'x', 'v', 'i'];
var last0_char = '',
    last1_char = '',
    last2_char = '',
    last_3_chars = '';

$.lbl_display.text = '';

function lastPressed(char_entered) {
    // keep track of last three characters entered
    last2_char = last1_char;
    last1_char = last0_char;
    last0_char = char_entered;
    // combine these to faciltate switch in dimChars()
    last_3_chars = last2_char + last1_char +  last0_char;
    // chain to function that enables/disables number keys
    dimChars(last2_char, last1_char, last0_char);
    accumulate(last1_char, last0_char);
}
function numPress(e) {
    // using + as a 'total' key means we have to clear the display when we start a new number
    if (totalDisplayed == true) {
        clearDisplay();
        resetCurrentNum();
        totalDisplayed = false;
    }
//    Ti.API.info('e info is: '+JSON.stringify(e));
    // add value of key pressed to end of display
    $.lbl_display.text += e.source.text;
    // send last character entered to function keeping track
    lastPressed(e.source.text);
//    Ti.API.info('$.lbl_display.text: '+$.lbl_display.text);
    Ti.API.info('in numPress, e.source.text: '+e.source.text);
}
function accumulate(last1, last0) {
    switch (last0) {
        case 'M':
//            Ti.API.info('in accum, last0_char is M');
            if (last1 == 'C') {
                current_num.C += 'CCC';
                current_num.D += 'D';
                current_num.arabic += 800;
            } else {
                current_num.M += 'M';
                current_num.arabic += 1000;
            }
            break;
        case 'D':
//            Ti.API.info('in accum, last0_char is D');
            if (last1 == 'C') {
                current_num.C += 'CCC';
                current_num.arabic += 300;
            } else {
                current_num.D += 'D';
                current_num.arabic += 500;
            }
            break;
        case 'C':
//            Ti.API.info('in accum, last0_char is C');
            if (last1 == 'X') {
                current_num.X += 'XXX';
                current_num.L += 'L';
                current_num.arabic += 80;
            } else {
                current_num.C += 'C';
                current_num.arabic += 100;
            }
            break;
        case 'L':
//            Ti.API.info('in accum, last0_char is L');
            if (last1 == 'X') {
                current_num.X += 'XXX';
                current_num.arabic += 30;
            } else {
                current_num.L += 'L';
                current_num.arabic += 50;
            }
            break;
        case 'X':
//            Ti.API.info('in accum, last0_char is X');
            if (last1 == 'I') {
                current_num.I += 'III';
                current_num.V += 'V';
                current_num.arabic += 8;
            } else {
                current_num.X += 'X';
                current_num.arabic += 10;
            }
            break;
        case 'V':
//            Ti.API.info('in accum, last0_char is V');
            if (last1 == 'I') {
                current_num.I += 'III';
                current_num.arabic += 3;
            } else {
                current_num.V += 'V';
                current_num.arabic += 5;
            }
            break;
        case 'I':
//            Ti.API.info('in accum, last0_char is I');
            current_num.I += 'I';
            current_num.arabic += 1;
    }
    Ti.API.info ('current_num is: '+JSON.stringify(current_num));
    Ti.API.info ('in accum, current_num.arabic is: '+current_num.arabic);
}
/*
 * call when + is pressed
 */
function addPress(e) {
    Ti.API.info('<--------------------');
    Ti.API.info('just entered addPress; last0_num is: '+last0_num.arabic);
    Ti.API.info('last1_num is: '+last1_num.arabic);
    Ti.API.info('total_num is: '+total_num.arabic);
    Ti.API.info('  ----------------');
    // Ti.API.info('just entered addPress; last0_num is: '+JSON.stringify(last0_num));
    // Ti.API.info('last1_num is: '+JSON.stringify(last1_num));
    // keep total in display until a number is pressed
    totalDisplayed = true;
    // put numbers into accumulators
    // if we haven't done any adding yet, last1_num is not yet changed
    if (last1_num.arabic == 0 && total_num.arabic == 0) {
        last1_num = last0_num;
    } else {
        // if we've started summing, then use last1_num to hold the everything up to now
        last1_num = total_num;
    }
//    last1_num = total_num;
    // put the number just entered into last0_num
    last0_num = current_num;
    Ti.API.info('after testing, last0_num is: '+last0_num.arabic);
    Ti.API.info('last1_num is: '+last1_num.arabic);
    // Ti.API.info('last0_num is: '+JSON.stringify(last0_num));
    // Ti.API.info('last1_num is: '+JSON.stringify(last1_num));
    total_num = lib.add2Numbers(last1_num, current_num);
    Ti.API.info('after addition, total_num is: '+total_num.arabic);
    Ti.API.info('-- total_num is: '+JSON.stringify(total_num));
    Ti.API.info('before calling resetCurrentNum, it is: '+current_num.arabic);
    resetCurrentNum();
    Ti.API.info('after calling resetCurrentNum, it is: '+current_num.arabic);
    $.lbl_display.text = lib.makeDisplayStringFromArray(total_num);
    Ti.API.info('just changed display to show total, now done with addPress');
    // remove number from display // will put total on screen, not clear display till number pressed
    //clearDisplay();
}

/*
 * Call this when N (aka 'clear') is pressed and when operators are pressed
 */
function clearDisplay() {
    // set the display to empty string
    $.lbl_display.text = '';
    // reset the characters pressed variables to empty string
    last0_char = '',
    last1_char = '',
    last2_char = '',
    last_3_chars = '';
    dimChars(null);
}
function resetCurrentNum() {
    Ti.API.info('--- entered resetCurrentNum');
    // set every value to empty string in current_num
    current_num.M = '';
    current_num.CM = '';
    current_num.D = '';
    current_num.CD = '';
    current_num.C = '';
    current_num.XC = '';
    current_num.L = '';
    current_num.XL = '';
    current_num.X = '';
    current_num.IX = '';
    current_num.V = '';
    current_num.IV = '';
    current_num.I = '';
    current_num.MStore = '';
    current_num.arabic = 0;
    Ti.API.info('--- after resetCurrentNum, current_num is: '+current_num.arabic);
    // Ti.API.info('after resetCurrentNum, current_num is: '+JSON.stringify(current_num));
    dimChars(null);
}
/*
 * Use this function to clear the display and all values: start over
 */
function resetAccumulators() {
    // set every value to empty string in current_num
    resetCurrentNum();
    // set each other accumulator to equal the empty current_num
    last0_num = current_num;
    last1_num = current_num;
    total_num = current_num;
    Ti.API.info('after reset, last0_num is: '+last0_num.arabic);
    Ti.API.info('after reset, last1_num is: '+last1_num.arabic);
    Ti.API.info('after reset, total_num is: '+total_num.arabic);
    // Ti.API.info('after reset, last0_num is: '+JSON.stringify(last0_num));
    // Ti.API.info('after reset, last1_num is: '+JSON.stringify(last1_num));
    // Ti.API.info('after reset, total_num is: '+JSON.stringify(total_num));
}
function clearAll() {
    clearDisplay();
    resetAccumulators();
}
function deleteLeft() {
    // use slice method to remove last character of display
    var displayText =  $.lbl_display.text;
    var charCount = displayText.length;
    (charCount > 0) ? $.lbl_display.text = displayText.slice(0, -1) : '';
    // reset the characters pressed variables to earlier characters
    // this allows backspace to be pressed several times without throwing off logic
    last0_char = (charCount > 1) ? displayText.charAt(charCount-2) : '';
    last1_char = (charCount > 2) ? displayText.charAt(charCount-3) : '';
    last2_char = (charCount > 3) ? displayText.charAt(charCount-4) : '';
    last_3_chars = last2_char + last1_char + last0_char;
    dimChars(last2_char, last1_char, last0_char);
    updateScreen();
}

function dimChars(last2, last1, last0) {
//    Ti.API.info('in dimChars, last2, last1 & last0: '+ last2 + last1 + last0);
    if (last0 == null || last0 == '') {
//        Ti.API.info('in dimChars, auto-setting everything to Go');
        roman_array.forEach(setActive);
        updateScreen();
    } else {
        switch (last0) {
            case 'M':
//                Ti.API.info('in switch, last0_char is M');
                if (last1 == 'C') {
                    ['M','D','C'].forEach(setInactive);
                    ['L','X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else if (last1 == 'M' && last2 == 'M') {
                    ['M'].forEach(setInactive);
                    ['D','C','L','X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else {
                    roman_array.forEach(setActive);
                    updateScreen();
                    break;
                }
            case 'D':
//                Ti.API.info('in switch, last0_char is D');
                if (last1 == 'C') {
                    ['M','D','C'].forEach(setInactive);
                    ['L','X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else {
                    ['M','D'].forEach(setInactive);
                    ['C','L','X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                }
            case 'C':
//                Ti.API.info('in switch, last0_char is C');
                if (last1 == 'C' && last2 == 'C') {
                    ['M','D','C'].forEach(setInactive);
                    ['L','X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else if (last1 == 'M' || last1 == '') {
                    roman_array.forEach(setActive);
                    updateScreen();
                    break;
                } else if (last1 == 'D' || last1 == '') {
                    ['M','D'].forEach(setInactive);
                    ['C','L','X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else if (last1 == 'X') {
                    ['M','D','C','L'].forEach(setInactive);
                    ['X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else {
                    ['M','D'].forEach(setInactive);
                    ['C','L','X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                }
            case 'L':
//                Ti.API.info('in switch, last0_char is L');
                if (last1 == 'X') {
                    ['M','D','C','L','X'].forEach(setInactive);
                    ['V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else {
                    ['M','D','C','L'].forEach(setInactive);
                    ['X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                }
            case 'X':
//                Ti.API.info('in switch, last0_char is X');
                if (last1 == 'X' && last2 == 'X') {
                    ['M','D','C','L','X'].forEach(setInactive);
                    ['V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else if (last1 == 'C' || last1 == '') {
                    ['M','D'].forEach(setInactive);
                    ['C','L','X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else if (last1 == 'L') {
                    ['M','D','C','L'].forEach(setInactive);
                    ['X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else if (last1 == 'X') {
                    ['M','D','C','L'].forEach(setInactive);
                    ['X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else if (last1 == 'D') {
                    ['M','D','C'].forEach(setInactive);
                    ['L','X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else if (last1 == 'I') {
                    roman_array.forEach(setInactive);
                    updateScreen();
                    break;
                } else {
                    ['M','D'].forEach(setInactive);
                    ['C','L','X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                }
            case 'V':
//                Ti.API.info('in switch, last0_char is V');
                if (last1 == 'I') {
                    roman_array.forEach(setInactive);
                    updateScreen();
                    break;
                } else {
                    ['M','D','C','L','X','V'].forEach(setInactive);
                    ['I'].forEach(setActive);
                    updateScreen();
                    break;
                }
            case 'I':
//                Ti.API.info('in switch, last0_char is I');
                if (last1 == 'I' && last2 == 'I') {
                    roman_array.forEach(setInactive);
                    updateScreen();
                    break;
                } else if (last1 == 'X' || last1 == 'M' || last1 == 'D' || last1 == 'C' || last1 == 'L' || last1 == '') {
                    ['M','D','C','L'].forEach(setInactive);
                    ['X','V','I'].forEach(setActive);
                    updateScreen();
                    break;
                } else if (last1 == 'I' || last1 =='V') {
                    ['M','D','C','L','X','V'].forEach(setInactive);
                    ['I'].forEach(setActive);
                    updateScreen();
                    break;
                } else {
                    ['M','D','C','L','X','V'].forEach(setInactive);
                    ['I'].forEach(setActive);
                    updateScreen();
                    break;
                }
        }
    }
}
function setActive(element, index, array) {
    var idx = element;
    key_state[idx].active = true;
    key_state[idx].opacity = 1.0;
}
function setInactive(element, index, array) {
    var idx = element;
    key_state[idx].active = false;
    key_state[idx].opacity = 0.3;
}
function updateScreen() {
    $.lbl_m.opacity = key_state["M"].opacity;
    $.lbl_m.touchEnabled = key_state["M"].active;
    $.lbl_d.opacity = key_state["D"].opacity;
    $.lbl_d.touchEnabled = key_state["D"].active;
    $.lbl_c.opacity = key_state["C"].opacity;
    $.lbl_c.touchEnabled = key_state["C"].active;
    $.lbl_l.opacity = key_state["L"].opacity;
    $.lbl_l.touchEnabled = key_state["L"].active;
    $.lbl_x.opacity = key_state["X"].opacity;
    $.lbl_x.touchEnabled = key_state["X"].active;
    $.lbl_v.opacity = key_state["V"].opacity;
    $.lbl_v.touchEnabled = key_state["V"].active;
    $.lbl_i.opacity = key_state["I"].opacity;
    $.lbl_i.touchEnabled = key_state["I"].active;
}
$.lbl_m.addEventListener('click', numPress);
$.lbl_d.addEventListener('click', numPress);
$.lbl_c.addEventListener('click', numPress);
$.lbl_l.addEventListener('click', numPress);
$.lbl_x.addEventListener('click', numPress);
$.lbl_v.addEventListener('click', numPress);
$.lbl_i.addEventListener('click', numPress);
$.lbl_clear.addEventListener('click', clearAll);
$.lbl_delete.addEventListener('click', deleteLeft);
$.lbl_plus.addEventListener('click', addPress);
$.lbl_equals.addEventListener('click', addPress);
$.index.open();
