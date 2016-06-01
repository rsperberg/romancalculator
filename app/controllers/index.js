// set up the accumulators
var m_accum, d_accum, c_accum, l_accum, x_accum, v_accum, i_accum;

var key_state = {
    m :  { active: true, opacity: 1.0, label: '$.lbl_m' },
    d : { active: true, opacity: 1.0, label: '$.lbl_d' },
    c : { active: true, opacity: 1.0, label: '$.lbl_c' },
    l : { active: true, opacity: 1.0, label: '$.lbl_l' },
    x : { active: true, opacity: 1.0, label: '$.lbl_x' },
    v : { active: true, opacity: 1.0, label: '$.lbl_v' },
    i :{ active: true, opacity: 1.0, label: '$.lbl_i' },
};

var roman_array = ['m', 'd', 'c', 'l', 'x', 'v', 'i'];
var last_char = '',
    prev_char = '',
    last_2_chars = '';

$.lbl_display.text = '';

function lastPressed(char_entered) {
    // keep track of last two characters entered
    prev_char = last_char;
    last_char = char_entered;
    // combine these to faciltate switch in dimChars()
    last_2_chars = prev_char + last_char;
    // chain to function that enables/disables number keys
    dimChars(prev_char, last_char);
}
function numPress(e) {
//    Ti.API.info('e info is: '+JSON.stringify(e));
    // add value of key pressed to end of display
    $.lbl_display.text = $.lbl_display.text + e.source.text;
    // send last character entered to function keeping track
    lastPressed(e.source.text);
//    Ti.API.info('$.lbl_display.text: '+$.lbl_display.text);
    Ti.API.info('e.source.text: '+e.source.text);
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
    prev_char = '';
    last_char = '';
    last_2_chars = '';
    dimChars(null);
}
function deleteLeft() {
    // use slice method to remove last character of display
    var displayText =  $.lbl_display.text;
    var charCount = displayText.length;
    $.lbl_display.text = displayText.slice(0, -1);
    // reset the characters pressed variables to earlier characters
    // this allows backspace to be pressed several times without throwing off logic
    last_char = displayText.charAt(charCount-2);
    prev_char = displayText.charAt(charCount-3);
    last_2_chars = prev_char + last_char;
}
function dimChars(last, prev) {
    if (last == null) {
        roman_array.forEach(setActive);
    } else {
        switch (last_char) {
            case M:
                if (prev_char == 'C') {
                    ['M','D','C'].forEach(setInactive);
                [break;]

    }
}
function setActive(element, index, array) {
    key_state.element.active = true;
    key_state.element.opacity = 1.0;
}
function setInactive(element, index, array) {
    key_state.element.active = false;
    key_state.element.opacity = 0.6;
}
$.lbl_m.addEventListener(pressNum);
$.index.open();
