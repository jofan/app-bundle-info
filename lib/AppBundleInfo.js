// Generated by CoffeeScript 1.10.0
(function() {
  var AdmZip, AndroidAppBundleInfo, Lock, fs, fstream, glob, stream, streamToBuffer, tmp, unzip;

  unzip = require('unzip');

  fs = require('fs-extra');

  stream = require('stream');

  streamToBuffer = require('stream-to-buffer');

  tmp = require('tmp');

  glob = require('glob');

  Lock = require('lock');

  fstream = require('fstream');

  AdmZip = require('adm-zip');

  AndroidAppBundleInfo = (function() {
    function AndroidAppBundleInfo(pathOrStream) {
      this.pathOrStream = pathOrStream;
      this.extracted = false;
      this.lock = new Lock();
      this.type = 'general';
    }

    AndroidAppBundleInfo.prototype.clearContents = function(callback) {
      callback = callback || function() {};
      if (this.extracted) {
        return fs.remove(this.extractPath, (function(_this) {
          return function(err) {
            if (err) {
              return callback(err);
            }
            _this.extracted = false;
            return callback();
          };
        })(this));
      } else {
        return callback();
      }
    };

    AndroidAppBundleInfo.prototype._extractContents = function(callback) {
      if (this.extracted) {
        return callback();
      }
      return this.lock('extract', (function(_this) {
        return function(release) {
          var zip;
          callback = release(callback);
          zip = new AdmZip(_this.pathOrStream);
          return tmp.dir(function(err, extractPath) {
            if (err) {
              return callback(err);
            }
            _this.extractPath = extractPath;
            zip.extractAllTo(extractPath, true);
            _this.extracted = true;
            return callback();
          });
        };
      })(this));
    };

    AndroidAppBundleInfo.prototype._getFileStream = function(callback) {
      if (this.pathOrStream instanceof stream.Readable) {
        return callback(null, this.pathOrStream);
      } else {
        return callback(null, fs.createReadStream(this.pathOrStream));
      }
    };

    AndroidAppBundleInfo.prototype.findFileStream = function(matchFile, callback) {
      return this._extractContents((function(_this) {
        return function(err) {
          var searchPattern;
          if (err) {
            return callback(err);
          }
          searchPattern = _this.extractPath + '/' + matchFile;
          return glob(searchPattern, function(err, files) {
            if (err) {
              return callback(err);
            }
            if (files.length === 0) {
              return callback(new Error('no file found for \'' + matchFile + '\''));
            }
            return callback(null, fs.createReadStream(files[0]));
          });
        };
      })(this));
    };

    return AndroidAppBundleInfo;

  })();

  module.exports = AndroidAppBundleInfo;

}).call(this);
