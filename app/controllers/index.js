// set up the accumulators
var m_accum, d_accum, c_accum, l_accum, x_accum, v_accum, i_accum;

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
}
function numPress(e) {
//    Ti.API.info('e info is: '+JSON.stringify(e));
    // add value of key pressed to end of display
    $.lbl_display.text = $.lbl_display.text + e.source.text;
    // send last character entered to function keeping track
    lastPressed(e.source.text);
//    Ti.API.info('$.lbl_display.text: '+$.lbl_display.text);
    Ti.API.info('in numPress, e.source.text: '+e.source.text);
}
function addPress(e) {
    // remove number from display
    clearDisplay();
}
function totalPress(e) {
    // remove number from display
    clearDisplay();
}
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
    Ti.API.info('in dimChars, last2, last1 & last0: '+ last2 + last1 + last0);
    if (last0 == null || last0 == '') {
        Ti.API.info('in dimChars, auto-setting everything to Go');
        roman_array.forEach(setActive);
        updateScreen();
    } else {
        switch (last0) {
            case 'M':
                Ti.API.info('in switch, last0_char is M');
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
                Ti.API.info('in switch, last0_char is D');
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
                Ti.API.info('in switch, last0_char is C');
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
                Ti.API.info('in switch, last0_char is L');
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
                Ti.API.info('in switch, last0_char is X');
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
                Ti.API.info('in switch, last0_char is V');
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
                Ti.API.info('in switch, last0_char is I');
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
$.index.open();
