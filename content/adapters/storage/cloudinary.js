const cloudinary = require('cloudinary');
const BaseAdapter = require('ghost-storage-base');

class CloudinaryStore extends BaseAdapter {
  constructor(config = {}) {
    super();
    this.config = config;
    cloudinary.config(config);
  }

  save(image) {
    const secure = this.config.secure || false;

    return new Promise(function(resolve) {
      cloudinary.uploader.upload(image.path, function(result) {
        resolve(secure ? result.secure_url : result.url);
      });
    });
  }

  delete(image) {
    return new Promise(function(resolve) {
      cloudinary.uploader.destroy('zombie', function(result) {
        resolve(result)
      });
    });
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

  serve() {
    return function (req, res, next) {
      next();
    };
  }
}

module.exports = CloudinaryStore;
