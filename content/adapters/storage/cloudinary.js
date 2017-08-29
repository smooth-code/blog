'use strict';

var Promise = require('bluebird');
var cloudinary = require('cloudinary');
var path = require('path');
var fs = require('fs');
var util = require('util');
var request = require('request');
var BaseAdapter = require('ghost-storage-base');

class CloudinaryAdapter extends BaseAdapter{
  constructor(options) {
    super(options);
    this.config = options || {};
    cloudinary.config(options);
  }

  exists(filename) {
    return new Promise(function(resolve) {
      if (cloudinary.image(filename, { })) {
          resolve(true);
      } else {
          resolve(false);
      }
    });
  }

  save(image, targetDir) {
    var cloudinaryImageSetting = this.config.configuration;

    return new Promise(function(resolve) {
      cloudinary.uploader.upload(image.path, function(result) {
        resolve(cloudinary.url(result.public_id.concat(".", result.format), cloudinaryImageSetting ).replace('http://', 'https://'));
      });
    });
  }

  serve() {
    return function customServe(req, res, next) {
      next();
    }
  }

  delete(image) {
    return new Promise(function(resolve) {
      cloudinary.uploader.destroy(image.path, function(result) {
        resolve(result)
      });
    });
  }

  /**
   * Reads bytes from disk for a target image
   * - path of target image (without content path!)
   *
   * @param options
   */
  read(options) {
    options = options || {};

    return new Promise(function (resolve, reject) {
      request(options.path, function (err, response, buffer) {
        if (err) reject(err)
        else resolve(buffer)
      })
    });
  }
}

module.exports = CloudinaryAdapter;
