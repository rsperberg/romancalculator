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
    if (totalDisplayed == true) {
        clearDisplay();
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
            Ti.API.info('in accum, last0_char is I');
            current_num.I += 'I';
            current_num.arabic += 1;
    }
    Ti.API.info ('current_num is: '+JSON.stringify(current_num));
    Ti.API.info ('current_num.arabic is: '+current_num.arabic);
}
/*
 * call when + is pressed
 */
function addPress(e) {
    // keep total in display until a number is pressed
    totalDisplayed = true;
    // put numbers into accumulators
    // if we haven't done any adding yet, last1_num is not yet changed
    // if (last1_num.arabic == 0) {
        // last1_num = last0_num;
    // } else {
        // // if we've started summing, then use last1_num to hold the everything up to now
        // last1_num = total_num;
    // }
    last1_num = total_num;
    // put the number just entered into last0_num
    last0_num = current_num;
    Ti.API.info('last0_num is: '+JSON.stringify(last0_num));
    Ti.API.info('last1_num is: '+JSON.stringify(last1_num));
    // clear out current_num
    // if (last1_num.arabic == 0) {
        // // if only one number has been entered, then it's the total already
        // total_num = last0_num;
    // } else {
        // // add the current number to (a) the last number entered or (b) the running total
        // total_num = add2Numbers(last1_num, last0_num);
    // }
    total_num = add2Numbers(last1_num, current_num);
    resetCurrentNum();
    displayFromArray();
    // remove number from display // will put total on screen, not clear display till number pressed
    //clearDisplay();
}
function totalPress(e) {
    // remove number from display
    clearDisplay();
}
/*
 * adds accumulation of each roman numeral, returns total
 */
function add2Numbers(prev, last) {
    // local variable to hold all units
    var total = { M: '', D: '', C: '', L: '', X: '', V: '', I: '', CM: '', CD: '', XC: '', XL: '', IX: '', IV: '', arabic: 0, MStore: '' };
    // add up each roman numeral
    total.M = prev.M + last.M;
    total.D = prev.D + last.D;
    total.C = prev.C + last.C;
    total.L = prev.L + last.L;
    total.X = prev.X + last.X;
    total.V = prev.V + last.V;
    total.I = prev.I + last.I;
    // add arabic version too
    total.arabic = prev.arabic + last.arabic;

    // now adjust all accumulators to make them valid numbers
    // max I from 2 numbers is IIIIII; adjust .I and .V
    if (total.I == 'IIIIII') { total.I = 'I'; total.V += 'V'; }
    // if IIIII, move that to .V
    else if (total.I == 'IIIII') { total.I = ''; total.V += 'V'; }
    // if IIII, zero out .I and flag .IV (note: if .V == V or VVV, this will convert to IX)
    else if (total.I == 'IIII') { total.I = ''; total.IV += 'IV'; }
    // III or less simply remain in total.I

    // max V from 2 numbers is VVV; adjust .V and .X
    if (total.V == 'VVV') { total.V = 'V'; total.X += 'X';}
    // if VV, move that to .X
    else if (total.V == 'VV') { total.V = ''; total.X += 'X';}
    // leave V and '' alone but account for IX -- a new if clause not an else if
    if (total.V == 'V' && total.IV != '') { total.V = ''; total.IV = ''; total.IX = 'IX'; }

    // max X from 2 numbers is XXXXXXX; adjust .X and .L if 7
    if (total.X == 'XXXXXXX') { total.X = 'XX'; total.L += 'L'; }
    // adjust .X and .L if 6
    else if (total.X == 'XXXXXX') { total.X = 'X'; total.L += 'L'; }
    // adjust .X and .L if 5
    else if (total.X == 'XXXXX') { total.X = ''; total.L += 'L'; }
    // adjust .X and .XL if 4
    else if (total.X == 'XXXX') { total.X = ''; total.XL += 'XL'; }
    // XXX or less simply remain in total.X

    // max L from 2 numbers is LLL; adjust .L and .C
    if (total.L == 'LLL') { total.L = 'L'; total.C += 'C';}
    // if LL, move that to .C
    else if (total.L == 'LL') { total.L = ''; total.C += 'C';}
    // leave L and '' alone but account for XC -- a new if clause not an else if
    if (total.L == 'L' && total.XL != '') { total.L = ''; total.XL = ''; total.XC = 'XC'; }

    // max C from 2 numbers is CCCCCCC; adjust .C and .D if 7
    if (total.C == 'CCCCCCC') { total.C = 'CC'; total.D += 'D'; }
    // adjust .C and .D if 6
    else if (total.C == 'CCCCCC') { total.C = 'C'; total.D += 'D'; }
    // adjust .C and .D if 5
    else if (total.C == 'CCCCC') { total.C = ''; total.D += 'D'; }
    // adjust .C and .CD if 4
    else if (total.C == 'CCCC') { total.C = ''; total.CD += 'CD'; }
    // CCC or less simply remain in total.C

    // max D from 2 numbers is DDD; adjust .D and .M
    if (total.D == 'DDD') { total.D = 'D'; total.M += 'M';}
    // if DD, move that to .C
    else if (total.D == 'DD') { total.D = ''; total.M += 'M';}
    // leave D and '' alone but account for CM -- a new if clause not an else if
    if (total.D == 'D' && total.CD != '') { total.D = ''; total.CD = ''; total.CM = 'CM'; }

    // max M from 2 numbers is MMMMMMMMM; MMMM is largest permissible; store extra M's
    if (total.M == 'MMMMMMMMM') { total.M = 'MMMM'; total.MStore += '+MMMM+M'; }
    // adjust .M and .MStore if 8
    else if (total.M == 'MMMMMMMM') { total.M = 'MMMM'; total.MStore += '+MMMM'; }
    // adjust .M and .MStore if 7
    else if (total.M == 'MMMMMMM') { total.M = 'MMMM'; total.MStore += '+MMM'; }
    // adjust .M and .MStore if 6
    else if (total.M == 'MMMMMM') { total.M = 'MMMM'; total.MStore += '+MM'; }
    // adjust .M and .MStore if 5
    else if (total.M == 'MMMMM') { total.M = 'MMMM'; total.MStore += '+M'; }
    // no need to adjust .M if 4 or less

    Ti.API.info('total is: '+JSON.stringify(total));
    var newDisplayTotal = '';
    newDisplayTotal += total.M;
    newDisplayTotal += total.CM;
    newDisplayTotal += total.D;
    newDisplayTotal += total.CD;
    newDisplayTotal += total.C;
    newDisplayTotal += total.XC;
    newDisplayTotal += total.L;
    newDisplayTotal += total.XL;
    newDisplayTotal += total.X;
    newDisplayTotal += total.IX;
    newDisplayTotal += total.V;
    newDisplayTotal += total.IV;
    newDisplayTotal += total.I;

    $.lbl_display.text = newDisplayTotal;
    return total;
}

function displayFromArray() {
    var newDisplayTotal = '';
    newDisplayTotal += total_num.M;
    newDisplayTotal += total_num.CM;
    newDisplayTotal += total_num.D;
    newDisplayTotal += total_num.CD;
    newDisplayTotal += total_num.C;
    newDisplayTotal += total_num.XC;
    newDisplayTotal += total_num.L;
    newDisplayTotal += total_num.XL;
    newDisplayTotal += total_num.X;
    newDisplayTotal += total_num.IX;
    newDisplayTotal += total_num.V;
    newDisplayTotal += total_num.IV;
    newDisplayTotal += total_num.I;

//    $.lbl_display.text = newDisplayTotal;
    $.lbl_display.setText(newDisplayTotal);

}

/*
 * Call this when 'clr' is pressed and when operators are pressed
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
    resetCurrentNum();
}
function resetCurrentNum() {
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
    Ti.API.info('after reset, current_num is: '+JSON.stringify(current_num));
    dimChars(null);
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
    // Ti.API.info('in setActive, idx is: '+idx);
    // Ti.API.info('in setActive, key_state[idx] is: '+JSON.stringify(key_state[idx]));
    // Ti.API.info('in setActive, key_state[idx].active is: '+JSON.stringify(key_state[idx].active));
}
function setInactive(element, index, array) {
    var idx = element;
    key_state[idx].active = false;
    key_state[idx].opacity = 0.3;
    // Ti.API.info('in setInactive, idx is: '+idx);
    // Ti.API.info('in setInactive, key_state[idx] is: '+JSON.stringify(key_state[idx]));
    // Ti.API.info('in setInactive, key_state[idx].active is: '+JSON.stringify(key_state[idx].active));
    // Ti.API.info('in setInactive, key_state[idx].opacity is: '+JSON.stringify(key_state[idx].opacity));
    // Ti.API.info('in setInactive, key_state[idx].id is: '+JSON.stringify(key_state[idx].id));
    // var thisLabel = key_state[idx].id;
    // Ti.API.info('thisLabel is: '+thisLabel);
// //    thisLabel.setOpacity(0.7);
    // key_state[idx].id.opacity = 0.7;
    // thisLabel.setTouchEnabled(false);
// //    Ti.API.info('$.lbl_m touch is: '+ touchOK);
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
$.lbl_plus.addEventListener('click',addPress);
$.index.open();
