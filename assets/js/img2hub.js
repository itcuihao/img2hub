
function getFileExtensionFromUrl(url) {
  const parts = url.split(/[@?]/);
  const actualUrl = parts.length > 1 ? parts[0] : url;
  const extension = actualUrl.split('.').pop().toLowerCase();
  if (['jpg', 'png'].includes(extension)) {
    return extension;
  } 
  if (parts.length<=1) {
    return null
  }
  // 如果扩展名不是JPG或PNG，则继续查找查询参数中的扩展名
  const queryParams = new URLSearchParams(parts[1]);
  for (const [name, value] of queryParams.entries()) {
    if (['jpg', 'png'].includes(value.toLowerCase())) {
      return value.toLowerCase();
    }
  }
  return null;
}

function getImgByURL(imageUrl) {
  try{
    if (!(validateImageUrl(imageUrl))){
      throw new Error("Invalid image URL. Only JPG and PNG formats are supported."); // 抛出异常
      return null;
    }
    const parts = imageUrl.split(/[@?]/);
    const actualImageUrl = parts.length > 1 ? parts[0] : imageUrl;
    console.log("getImgByURL ",actualImageUrl)
    return actualImageUrl
  }catch (error) {
    console.log("getImgByURL ",error.message);
    return null; // 返回 null 值表示处理失败
  }
}

function validateImageUrl(imageUrl) {
  const supportedExtensions = ['.jpg', '.png'];
  try {
    const parts = imageUrl.split(/[@?]/);
    const truncatedUrl = parts.length > 1 ? parts[0] : imageUrl;
    console.log(truncatedUrl);
    if (supportedExtensions.some(ext => truncatedUrl.endsWith(ext))) {
      return true;
    }
    const url = new URL(imageUrl);
    const path = url.pathname.toLowerCase();
    console.log(path);
    const queryParams = new URLSearchParams(parts[1]);
    for (const [name, value] of queryParams.entries()) {
      if (['jpg', 'png'].includes(value.toLowerCase())) {
        return true;
      }
    }
  } catch (e) {
    console.log(e)
    return false;
  }
}

function convertImgToBase64(url, callback, outputFormat){
  var canvas = document.createElement('CANVAS'),
  ctx = canvas.getContext('2d'),
  img = new Image;
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img,0,0);
    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    var base64 = dataURL.replace(/^data:image\/(png|jpeg);base64,/, '');
    callback.call(this, base64);
    canvas = null; 
  };
  img.src = url;
}

function execImg2HubJob(){
  // 获取 background-item 元素
  const backgroundItemElement = document.querySelector('img');
  // 获取 img 元素的 src 属性值
  const imageUrl = backgroundItemElement.src;
  const imgUrl = getImgByURL(imageUrl);
  if (imgUrl == null) {
    return
  }
  console.log(imgUrl);
  const imgExt = getFileExtensionFromUrl(imgUrl);
  if (imgExt == null) {
    return
  }
  console.log(imgExt);
  // 转成base64
  convertImgToBase64(imgUrl, function(base64Img){
    //转化后的base64
    const imgObj = {
      imgUrl: imgUrl,
      imgExt: imgExt,
      imgBase64: base64Img,
    };
    chrome.runtime.sendMessage(JSON.stringify(imgObj), response => {
      console.log(response); // 输出响应消息
      alert("已经执行上传，请移步GitHub查看");
    });
    console.log("已发送上传消息");
   });
}

chrome.storage.sync.get(
  { img2hubExec: false },
  (item) => {
      console.log("img2hub storage get exec: ", item.img2hubExec);
      if (item.img2hubExec === false) {
          return;
      }
      execImg2HubJob();
      chrome.storage.sync.set(
        { img2hubExec: false },
        () => {
          console.log("img2hub storage set exec: false");
        }
      );
      // 上传
      return; // 退出

  }
);

