//Error counter
window.oncontextmenu = function () {
  setTimeout(highlightToText, 1); //1 millisecond delay, doesnt work without

}


var j = 0;
const mistakes = [];
highlightToText = function () {
  if (typeof window.getSelection != "undefined") {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var node = sel.getRangeAt(0).commonAncestorContainer;
      containerElement = node.nodeType == 1 ? node : node.parentNode;

      var text = sel.toString();

      for (var i = 0; i < text.length; i++) {
        if (text.charAt(i) === " ") {
          text = undefined;
          break
        }
      }

      if (text != undefined && text.length > 0) {
        mistakes[j] = text;
        console.log(mistakes[j]);
        j++;
        document.getElementById("mistakes").innerHTML = j;
      }
    }
  }
}

var errors = "None!"

infoToggle = function () {
  document.getElementById("errors").innerHTML = "Click me to display corrected errors!";
  document.getElementById("changeHeight").style.height = "400px";

  document.querySelector(".fullscreen").classList.toggle("hidden");
  let res = [];
  let str = textbox.value.replace(/[\t\n\r\.\?\!]/gm, " ").split(" ");
  str.map((s) => {
    let trimStr = s.trim();
    if (trimStr.length > 0) {
      res.push(trimStr);
    }
  });
  wordCountElement.innerHTML = res.length;
}

const wordCountElement = document.getElementById("wordcount");


textInformation = function () {
  //Displays mistakes corrected
  
  if(j>0){
    var height = 400+ 20*(j-1)
    document.getElementById("changeHeight").style.height = height+"px";

    errors = "";
    for (i = 0; i < j; i++) {
      errors = errors + mistakes[i] + "<br>";
      
    }
  }
  document.getElementById("errors").innerHTML = errors;
}



//Font size
var fontSize = 12;

async function enter() {
  await waitingKeypress();
  var input = document.getElementById('fontSize').value;
  if (!isNaN(input)) {
    if (input < 6) {
      input = 6;
    }
    else if (input > 150) {
      input = 150;
    }
    fontSize = input;
  }
  document.getElementById("textbox").style.fontSize = fontSize + 'px';
  document.getElementById('fontSize').value = fontSize;
}

function waitingKeypress() {
  return new Promise((resolve) => {

    document.addEventListener('click', onClickHandler);
    function onClickHandler(event) {
      if (!event.target.matches('#fontSize')) {
        document.getElementById('fontSize').value = fontSize;

        document.removeEventListener('keydown', onKeyHandler);
        document.removeEventListener('click', onClickHandler);
        resolve();
      }
    }

    document.addEventListener('keydown', onKeyHandler);
    function onKeyHandler(e) {
      if (e.keyCode === 13) {
        document.getElementById('fontSize').blur();
        document.removeEventListener('keydown', onKeyHandler);
        document.removeEventListener('click', onClickHandler);
        resolve();
      }
    }
  });
}


//Special effects
var textbox = document.getElementById('textbox');
var effect = document.getElementById("specialeffects");
var effect2 = document.getElementById("overlay");

function autoheight(element) {
  var el = document.getElementById(element);
  el.style.height = (el.scrollHeight) + "px";
}

var properties = [
  'boxSizing',
  'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY',  // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',  // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing'
];
var isFirefox = !(window.mozInnerScreenX == null);


var getCaretCoordinates = function (element, position) {
  // mirrored div
  mirrorDiv = document.getElementById(element.nodeName + '--mirror-div');
  if (!mirrorDiv) {
    mirrorDiv = document.createElement('div');
    mirrorDiv.id = element.nodeName + '--mirror-div';
    document.body.appendChild(mirrorDiv);
  }

  style = mirrorDiv.style;
  computed = getComputedStyle(element);

  // default textarea styles
  style.whiteSpace = 'pre-wrap';
  if (element.nodeName !== 'INPUT')
    style.wordWrap = 'break-word';  // only for textarea-s

  // position off-screen
  style.position = 'absolute';  // required to return coordinates properly
  style.top = element.offsetTop + parseInt(computed.borderTopWidth) + 'px';
  style.left = "10000px";

  // transfer the element's properties to the div
  properties.forEach(function (prop) {
    style[prop] = computed[prop];
  });

  if (isFirefox) {
    style.width = parseInt(computed.width) - 2 + 'px'  // Firefox adds 2 pixels to the padding - https://bugzilla.mozilla.org/show_bug.cgi?id=753662
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (element.scrollHeight > parseInt(computed.height))
      style.overflowY = 'scroll';
  } else {
    style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  }

  mirrorDiv.textContent = element.value.substring(0, position);
  // the second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (element.nodeName === 'INPUT')
    mirrorDiv.textContent = mirrorDiv.textContent.replace(/\s/g, "\u00a0");

  var span = document.createElement('span');
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // for inputs, just '.' would be enough, but why bother?
  span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
  span.style.backgroundColor = "lightgrey";
  mirrorDiv.appendChild(span);

  var coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
  };

  return coordinates;
}
var op = 1;
var timer = setInterval(function () {
  if (op >= 0.1) {
    effect.style.opacity = op;
    effect.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op -= 0.1;
  }
}, 100);

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

var audio = [new Audio('sound1.mp3'), new Audio('sound2.mp3'), new Audio('sound3.mp3'), new Audio('sound4.mp3')];

var animating = false;
effect2.addEventListener("animationstart", function () { animating = true; }, false);
effect2.addEventListener("animationend", function () { animating = false; }, false);

function SpecialEffects(e) {
  if (e.keyCode === 17) {
    if (animating === false) {
      e.preventDefault();
      effect2.classList.remove("specialeffects2");
      void effect2.offsetWidth;
      effect2.classList.add("specialeffects2");
    }
  } else {
    var coords = getCaretCoordinates(textbox, textbox.selectionEnd);
    effect.style.top = coords.top + textbox.offsetTop + "px";
    effect.style.left = textbox.offsetLeft + "px";
    effect.style.height = window.getComputedStyle(textbox, null).getPropertyValue('font-size');
    effect.style.opacity = "1.0";
    op = 1;
    effect.style.filter = 'alpha(opacity=100)';
    var num = randomRange(0, audio.length);
    audio[num].play();
  }
}

if (textbox.addEventListener) {
  textbox.addEventListener('keydown', SpecialEffects, false);
  textbox.addEventListener('click', SpecialEffects, false);
} else {
  alert("Your browser doesn't support the keydown event listener.");
}


