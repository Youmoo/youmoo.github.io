/**
 * 备份博客中的图片，以免图片cdn挂掉时图片丢失
 */
const { once } = require("events");
const {
  createReadStream,
  createWriteStream,
  promises: { readdir, access },
} = require("fs");
const { createInterface } = require("readline");
const https = require("https");
const { join } = require("path");

const { posts_dir, posts_images_dir } = require("../config");

(async function backup() {
  for (const file of await readdir(posts_dir)) {
    if (!file.endsWith(".html")) {
      console.log("不支持的文件: ", file);
      continue;
    }

    const rl = createInterface({
      input: createReadStream(join(posts_dir, file)),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const image = resolveImageUrl(line);
      if (image) {
        await loadAndSave(image, posts_images_dir);
      }
    }
  }

  console.log("所有文件处理完成!");
})();

/**
 * 加载并保存图片文件
 *
 * @param {String} remoteImage 远程文件地址
 * @param {String} dest 本地保存路径
 */
async function loadAndSave(remoteImage, dest) {
  const { hostname, pathname } = new URL(remoteImage);
  const filename = hostname + "@" + pathname.slice(1);
  const target = join(dest, filename);
  if (await exists(target)) {
    return console.log("文件已存在: ", { remoteImage, target });
  }

  const writer = createWriteStream(target);
  https.get(remoteImage, (res) => res.pipe(writer));
  await once(writer, "finish");
  console.log("文件备份完成: ", { remoteImage, target });
}

function exists(file) {
  return access(file)
    .then(() => true)
    .catch(() => false);
}

const imgRegexp = /<img src="([^"]+?)".+>/;
function resolveImageUrl(line) {
  const res = imgRegexp.exec(line);
  return res && res[1];
}
