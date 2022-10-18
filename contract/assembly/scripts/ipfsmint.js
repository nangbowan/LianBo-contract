const api = require('../../../web/utils/export.js');
const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(api.APIKEY, api.APISECRET);

//将图片通过pinata api上传至IPFS网络并返回图片url
function pinFileToIPFS(j) {
  return new Promise(function (resolve, reject) {
    //读取nft图片文件
    const readableStreamForFile = fs.createReadStream(`../img/${j}.png`);
    //调用pinata中的pinFileToIPFS方法并获取返回值，url
    pinata.pinFileToIPFS(readableStreamForFile).then((result) => {
      resolve(`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`)
    }).catch((err) => {
      console.log(err);
    });
  })
}





function getJsonFile(imgUrl, k) {

  for (a = 0; a < 2; a++) {
    let json = JSON.parse(fs.readFile(`../json/${a}.json`));
    let idenitityRandom = json.idenitity;
    console.log(idenitityRandom)
    if (idenitityRandom == k) {
      json.imgUri = imgUrl;
      fs.writeFile(`../json/${a}.json`, json);
      return true;
    } else {
      continue;
    }
  }
}

async function main() {
  for (i = 0; i <= 1; i++) {
    let imgUrl = print(i);
    console.log(`imgURL:${imgUrl.toString()}`)

  }
}

main();

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}




function manage(j) {
  return new Promise(async () => {
    //获取图片url
    let imageUrl = await pinFileToIPFS(j)
    console.log(imageUrl)
    let res = getJsonFile(imageUrl, j);
    if (res == true) {
      console.log("写入成功！");
      await sleep(1000);
    } else {
      console.log("写入出错！");
      await sleep(1000);
    }

  })
}






//初始化nft元数据并将元数据通过pinata api上传至IPFS网络并返回元数据rulS
function pinJSONToIPFS(j) {
  return new Promise(async function (resolve, reject) {
    //获取图片url
    let imageUrl = await pinFileToIPFS(j)
    //初始化nft元数据
    //name: nft的名字
    //description: nft的描述
    //image: nft在IPFS网络上的url
    const body = {
      name: "岚链粉丝勋章",
      description: "Lanlian粉丝勋章",
      image: imageUrl
    }

    // console.log(imageUrl)
    //通过pinata的pinJSONToIPFS方法将元数据上传至IPFS网络
    pinata.pinJSONToIPFS(body).then((result) => {
      //handle results here
      resolve(`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    }).catch((err) => {
      console.log(err);
    });
  })
}