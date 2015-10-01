// Generated by CoffeeScript 1.9.3
(function() {
  var AndroidAppBundleInfo, fs, plistParse, stream, streamToBuffer, unzip;

  unzip = require('unzip');

  fs = require('fs');

  plistParse = require('./plist-parse');

  stream = require('stream');

  streamToBuffer = require('stream-to-buffer');

  AndroidAppBundleInfo = (function() {
    function AndroidAppBundleInfo(filePathOrStream) {
      this.filePathOrStream = filePathOrStream;
    }

    AndroidAppBundleInfo.prototype._getFileStream = function(callback) {
      if (this.filePathOrStream instanceof stream.Readable) {
        return callback(null, this.filePathOrStream);
      } else {
        return callback(null, fs.createReadStream(this.filePathOrStream));
      }
    };

    AndroidAppBundleInfo.prototype._findFileStream = function(matchFile, callback) {
      return this._getFileStream((function(_this) {
        return function(err, fileStream) {
          var foundFile;
          if (err) {
            return callback(err);
          }
          foundFile = null;
          return fileStream.pipe(unzip.Parse()).on("entry", function(entry) {
            if (!foundFile && ((matchFile instanceof RegExp && matchFile.test(entry.path)) || matchFile === entry.path)) {
              foundFile = entry;
              return callback(null, entry);
            } else {
              return entry.autodrain();
            }
          }).on("error", callback).on('close', function() {
            if (foundFile) {
              return callback(null, foundFile);
            } else {
              return callback(new Error('no file found'));
            }
          });
        };
      })(this));
    };

    return AndroidAppBundleInfo;

  })();

  module.exports = AndroidAppBundleInfo;

}).call(this);