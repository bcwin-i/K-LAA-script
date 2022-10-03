console.log("KĀĀlĀĀ script initiated");
const axios = require('axios').default;

let images = [];

console.log("Meta: ", getMeta)

function existArray(data, array) {
  const index = array.findIndex((object) => {
    return object?.data?.src === data?.data?.src;
  });

  return index;
}

function createWrapper(img) {
  let htmlObject = document.createElement("div");
  htmlObject.className = "wrapper";

  const Icon = new Image();
  Icon.className = "imgIcon";
  Icon.src = "https://cdn-icons-png.flaticon.com/512/833/833655.png";

  let Row = document.createElement("p");
  Row.className = "row";
  Row.appendChild(Icon);

  let Timer = document.createElement("span");
  Timer.id = img.data.src + "?" + img.index;
  Timer.innerHTML = img.timer - 1 + " secs";
  Row.appendChild(Timer);

  let Overlay = document.createElement("div");
  Overlay.className = "overlay";
  Overlay.appendChild(Row);

  let image = new Image(img.data.width, img.data.height);
  image.src = img.data.src;
  image.alt = img.data.alt;

  htmlObject.appendChild(Overlay);
  htmlObject.appendChild(image);

  img.data.replaceWith(htmlObject);
}

setInterval(async () => {
  await images.forEach((img) => {
    const element = document.getElementById(img.data.src + "?" + img.index);
    const view = element
      ? elementInViewport(element)
      : elementInViewport(img.data);
    const existImages = existArray(img, images);
    console.log(img.index, view);
    if (view && existImages !== -1) {
      let currImg = [...images];
      currImg[existImages] = {
        ...img,
        timer: img.timer === 0 ? 0 : img.timer - 1,
      };
      images = currImg;

      const timer = document.getElementById(img.data.src + "?" + img.index);
      if (timer) {
        timer.innerHTML =
          images[existImages].timer === 0
            ? "Watched"
            : images[existImages].timer + " secs";
      } else {
        createWrapper(img);
      }
    }
  });

  console.log("Images: ", images);
}, 1000);

function handleClass(element, className, condition, timer) {
  const valid = element.classList.contains(className);
  if (condition) {
    if (!valid) {
      element.classList.add(className);
      element.setAttribute("timer", timer);
    }
  } else {
    if (valid) element.classList.remove(className);
  }
}

function addImage(img) {
  const exist = existArray(img, images);
  // console.log("New image: ", images.some(e => e.data.src === img.src))
  if (!images.some((e) => e.data.src === img.src) && img.src) {
    const size = `${img.width}x${img.height}`;
    // console.log("Size: ", size)
    if (size === "100x100") {
      const index = images.length + 1;
      images.push({ data: img, index, timer: 10 });
    }
  }
}

async function getAllImages() {
  await Array.prototype.map.call(document.images, function (i) {
    addImage(i);
  });
}

getAllImages();

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    getAllImages();
  }
};

window.onscroll = async function (e) {
  getAllImages();
};

function elementInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top >= window.pageYOffset &&
    left >= window.pageXOffset &&
    top + height <= window.pageYOffset + window.innerHeight &&
    left + width <= window.pageXOffset + window.innerWidth
  );
}

const getMeta = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    const meta = navigator.userAgent;
    // console.log("ip: ", res);
    return {
      ipaddress: res.data?.IPv4,
      useragent: meta,
    };
  }