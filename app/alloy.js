// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Alloy.Globals.displayHeight = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.displayWidth = Ti.Platform.displayCaps.platformWidth;
Alloy.Globals.button3Width = (Alloy.Globals.displayWidth - 40)/3;
Alloy.Globals.button3Dbl = (Alloy.Globals.button3Width * 2) + 10;
//Alloy.Globals.button4 = (Alloy.Globals.displayWidth - 50)/4;
//Alloy.Globals.button5 = (Alloy.Globals.displayWidth - 60)/5;
var iphone4 = (Alloy.Globals.displayHeight == 480 && Alloy.Globals.displayWidth == 320 &&  Ti.Platform.osname =='iphone') ? true : false;
if (iphone4) {
    Alloy.Globals.button3Height = Alloy.Globals.button3Width - 12;
} else {
    Alloy.Globals.button3Height = Alloy.Globals.button3Width;
}
