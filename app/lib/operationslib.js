exports.add2Numbers = function (prev, last) {
    // local variable to hold all units
    var total = { M: '', D: '', C: '', L: '', X: '', V: '', I: '', CM: '', CD: '', XC: '', XL: '', IX: '', IV: '', arabic: 0, MStore: '' };
    // add up each roman numeral
    // first convert subtractive combinations to full count numerals
    if (prev.CM == 'CM') { total.D += 'D'; total.C =+ 'CCCC';}
    if (last.CM == 'CM') { total.D += 'D'; total.C =+ 'CCCC';}
    if (prev.CD == 'CD') { total.C =+ 'CCCC';}
    if (last.CD == 'CD') { total.C =+ 'CCCC';}
    if (prev.XC == 'XC') { total.L += 'L'; total.X =+ 'XXXX';}
    if (last.XC == 'XC') { total.L += 'L'; total.X =+ 'XXXX';}
    if (prev.XL == 'XL') { total.X =+ 'XXXX';}
    if (last.XL == 'XL') { total.X =+ 'XXXX';}
    if (prev.IX == 'IX') { total.V += 'V'; total.I =+ 'IIII';}
    if (last.IX == 'IX') { total.V += 'V'; total.I =+ 'IIII';}
    if (prev.IV == 'IV') { total.I =+ 'IIII';}
    if (last.IV == 'IV') { total.I =+ 'IIII';}
    if (prev.MStore.length > 1 && prev.MStore.length < 6) {
        for (var i=0; i < (prev.MStore.length-1); i++) {
            prev.M += 'M';
        }
    } else if (prev.MStore.length > 6 && prev.MStore.length < 11) {
        for (var i=0; i < (prev.MStore.length-2); i++) {
            prev.M += 'M';
        }
    }
    // then add in each numeral
    total.M += prev.M; 
    total.M += last.M;
    total.D += prev.D;
    total.D += last.D;
    total.C += prev.C;
    total.C += last.C;
    total.L += prev.L;
    total.L += last.L;
    total.X += prev.X;
    total.X += last.X;
    total.V += prev.V;
    total.V += last.V;
    total.I += prev.I;
    total.I += last.I;
    // add arabic version too
    total.arabic = prev.arabic + last.arabic;

    // now adjust all accumulators to make them valid numbers
    // max I from 2 numbers could be IIIIIIIIIII; adjust .I and .X
    if (total.I == 'IIIIIIIIIII') { total.I = 'I'; total.X += 'X'; }
    // if IIIIIIIIII, adjust .I and .X
    else if (total.I == 'IIIIIIIIII') { total.I = ''; total.X += 'X'; }
    // if IIIIIIIII, adjust .I and .IX
    else if (total.I == 'IIIIIIIII') { total.I = ''; total.IX += 'IX'; }
    // if IIIIIIII, adjust .I and .V
    else if (total.I == 'IIIIIIII') { total.I = 'III'; total.V += 'V'; }
    // if IIIIIII, adjust .I and .V
    else if (total.I == 'IIIIIII') { total.I = 'II'; total.V += 'V'; }
    // if IIIIII, adjust .I and .V
    else if (total.I == 'IIIIII') { total.I = 'I'; total.V += 'V'; }
    // if IIIII, move that to .V
    else if (total.I == 'IIIII') { total.I = ''; total.V += 'V'; }
    // if IIII, zero out .I and flag .IV (note: if .V == V or VVV, this will convert to IX)
    else if (total.I == 'IIII') { total.I = ''; total.IV += 'IV'; }
    // III or less simply remain in total.I

    // max V from 2 numbers is VVV; adjust .V and .X
    if (total.V == 'VVVV') { total.V = ''; total.X += 'XX';}
    // if VVV, move VV to .X
    else if (total.V == 'VVV') { total.V = 'V'; total.X += 'X';}
    // if VV, move that to .X
    else if (total.V == 'VV') { total.V = ''; total.X += 'X';}
    // leave V and '' alone but account for IX -- a new if clause not an else if
    if (total.V == 'V' && total.IV != '') { total.V = ''; total.IV = ''; total.IX = 'IX'; }

    // max X from 2 numbers could be XXXXXXXXX; adjust .X and .C if 12
    if (total.X == 'XXXXXXXXXXXX') { total.X = 'XX'; total.C = 'C'; }
    // adjust .X and .C if 11
    else if (total.X == 'XXXXXXXXXXX') { total.X = 'X'; total.C = 'C'; }
    // adjust .X and .C if 10
    else if (total.X == 'XXXXXXXXXX') { total.X = ''; total.C = 'C'; }
    // adjust .X and .XC if 9
    else if (total.X == 'XXXXXXXXX') { total.X = ''; total.XC = 'XC'; }
    // adjust .X and .L if 8
    else if (total.X == 'XXXXXXXX') { total.X = 'XXX'; total.L += 'L'; }
    // adjust .X and .L if 7
    else if (total.X == 'XXXXXXX') { total.X = 'XX'; total.L += 'L'; }
    // adjust .X and .L if 6
    else if (total.X == 'XXXXXX') { total.X = 'X'; total.L += 'L'; }
    // adjust .X and .L if 5
    else if (total.X == 'XXXXX') { total.X = ''; total.L += 'L'; }
    // adjust .X and .XL if 4
    else if (total.X == 'XXXX') { total.X = ''; total.XL += 'XL'; }
    // XXX or less simply remain in total.X

    // max L from 2 numbers is LLL; adjust .L and .C
    if (total.L == 'LLLL') { total.L = ''; total.C += 'CC';}
    // if LLL, move LL to .C
    if (total.L == 'LLL') { total.L = 'L'; total.C += 'C';}
    // if LL, move that to .C
    else if (total.L == 'LL') { total.L = ''; total.C += 'C';}
    // leave L and '' alone but account for XC -- a new if clause not an else if
    if (total.L == 'L' && total.XL != '') { total.L = ''; total.XL = ''; total.XC = 'XC'; }

    // max C from 2 numbers could be CCCCCCCC; adjust .C and .M if 11
    if (total.C == 'CCCCCCCCCCC') { total.C = 'C'; total.M += 'M'; }
    // adjust .C and .M if 10
    else if (total.C == 'CCCCCCCCCC') { total.C = ''; total.M += 'M'; }
    // adjust .C and .CM if 9
    else if (total.C == 'CCCCCCCCC') { total.C = ''; total.CM += 'CM'; }
    // adjust .C and .D if 8
    else if (total.C == 'CCCCCCCC') { total.C = 'CCC'; total.D += 'D'; }
    // adjust .C and .D if 7
    else if (total.C == 'CCCCCCC') { total.C = 'CC'; total.D += 'D'; }
    // adjust .C and .D if 6
    else if (total.C == 'CCCCCC') { total.C = 'C'; total.D += 'D'; }
    // adjust .C and .D if 5
    else if (total.C == 'CCCCC') { total.C = ''; total.D += 'D'; }
    // adjust .C and .CD if 4
    else if (total.C == 'CCCC') { total.C = ''; total.CD += 'CD'; }
    // CCC or less simply remain in total.C

    // max D from 2 numbers is DDDD; adjust .D and .M
    if (total.D == 'DDDD') { total.D = ''; total.M += 'MM';}
    // if DD, move that to .C
    else if (total.D == 'DDD') { total.D = 'D'; total.M += 'M';}
    // if DD, move that to .C
    else if (total.D == 'DD') { total.D = ''; total.M += 'M';}
    // leave D and '' alone but account for CM -- a new if clause not an else if
    if (total.D == 'D' && total.CD != '') { total.D = ''; total.CD = ''; total.CM = 'CM'; }

    // max M from 2 numbers is MMMMMMMMMMMM; MMMM is largest permissible; store extra M's
    if (total.M == 'MMMMMMMMMMMMMM') { total.M = 'MMMM'; total.MStore += '+MMMM+MMMM+MM'; }
    // adjust .M and .MStore if 13
    else if (total.M == 'MMMMMMMMMMMMM') { total.M = 'MMMM'; total.MStore += '+MMMM+MMMM+M'; }
    // adjust .M and .MStore if 12
    else if (total.M == 'MMMMMMMMMMMM') { total.M = 'MMMM'; total.MStore += '+MMMM+MMMM'; }
    // adjust .M and .MStore if 11
    else if (total.M == 'MMMMMMMMMMM') { total.M = 'MMMM'; total.MStore += '+MMMM+MMM'; }
    // adjust .M and .MStore if 10
    else if (total.M == 'MMMMMMMMMM') { total.M = 'MMMM'; total.MStore += '+MMMM+MM'; }
    // adjust .M and .MStore if 9
    else if (total.M == 'MMMMMMMMM') { total.M = 'MMMM'; total.MStore += '+MMMM+M'; }
    // adjust .M and .MStore if 8
    else if (total.M == 'MMMMMMMM') { total.M = 'MMMM'; total.MStore += '+MMMM'; }
    // adjust .M and .MStore if 7
    else if (total.M == 'MMMMMMM') { total.M = 'MMMM'; total.MStore += '+MMM'; }
    // adjust .M and .MStore if 6
    else if (total.M == 'MMMMMM') { total.M = 'MMMM'; total.MStore += '+MM'; }
    // adjust .M and .MStore if 5
    else if (total.M == 'MMMMM') { total.M = 'MMMM'; total.MStore += '+M'; }
    // no need to adjust .M if 4 or less

    Ti.API.info('total adds up to: '+JSON.stringify(total));
    Ti.API.info('-- that is: '+total.arabic);
    return total;
};

/*
 * adds accumulation of each roman numeral, returns total
 */
exports.makeDisplayStringFromArray = function(total) {
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
    newDisplayTotal += total.MStore;

    return newDisplayTotal;
};

