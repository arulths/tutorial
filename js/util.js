app.util = {};

app.util.getParam = function (param) {
  var regex = new RegExp(param + '=([^&]+)');
  var query = window.location.search.replace(/\+|%20/g, ' ');
  return ((query.match(regex) || [])[1] || '');
};

app.util.arrayFrom = function (arrayLike) {
  return Array.prototype.slice.call(arrayLike);
};

app.util.resize = {
  editorLock: null,
  toolbarLock: null,
  throttler: function () {
    clearTimeout(app.util.resize.toolbarLock);
    app.util.resize.toolbarLock = setTimeout(app.services.refreshSplit, 100);

    if (!app.util.resize.editorLock) {
      app.util.resize.editorLock = setTimeout(function () {
        app.util.resize.editorLock = null;
        app.util.resize.editorResize();
      }, 50);
    }
  },
  editorResize: function () {
    app.editors.js.resize();
    app.editors.html.resize();
  }
};

app.util.format = function (code) {
  var indentation = app.util.extract(code, /([\t ]*)\S/);
  code = code.trim();

  if (indentation) {
    code = code.replace(new RegExp('^' + indentation, 'gm'), '');
  }

  return code;
};

app.util.extract = function (string, regex) {
  return ((string.match(regex) || [])[1] || '');
};

app.util.toDash = function (string) {
  return string.replace(/([A-Z])/g, function ($1) {
    return "-" + $1.toLowerCase(); });
};

app.util.request = function (url) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        request.status === 200 ? resolve(request.responseText) : reject(new Error(request.statusText));
      }
    };

    request.open('get', url);
    request.send();
  });
};

app.util.flattenJSLibs = function (object) {
  var result = [];

  Object.keys(object).forEach(function (key1) {
    Object.keys(object[key1]).forEach(function (key2) {
      if (key2.lastIndexOf('/css') === -1) {
        result = result.concat(object[key1][key2]);
      }
    });
  });

  return result;
}

app.util.addEntry = function (packageJSON, key, dep, first) {
  var regExp = new RegExp(`("${key}": \\{\\n(?:.|[\\r\\n])*?)(\\n\\s+\\})`);
  return packageJSON.replace(regExp, '$1' + (first ? '' : ',\n') + '    ' + dep + '$2')
};

app.util.parseId = function (string) {
  return string.replace(/\s+/g, '_');
};

app.util.simulatePanelDrag = function (gutter, position, value) {
  var mousedown = new CustomEvent('mousedown');
  var mousemove = new CustomEvent('mousemove', { bubbles: true });
  var mouseup = new CustomEvent('mouseup', { bubbles: true });

  mousemove['client' + position.toUpperCase()] = value;

  gutter.dispatchEvent(mousedown);
  gutter.dispatchEvent(mousemove);
  gutter.dispatchEvent(mouseup);
};
