const { join } = require("path");

const workdir = __dirname;

module.exports = {
  workdir,
  images_dir: join(workdir, "images"),
  posts_images_dir: join(workdir, "images", "posts"),
  posts_dir: join(workdir, "wx"),
};
