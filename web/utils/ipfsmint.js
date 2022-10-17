const api = require('./export.js');
const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(api.APIKEY, api.APISECRET);

//将图片通过pinata api上传至IPFS网络并返回图片url
function pinFileToIPFS() {
  return new Promise(function (resolve, reject) {
    //读取nft图片文件
    const readableStreamForFile = fs.createReadStream('./BG.png');
    //调用pinata中的pinFileToIPFS方法并获取返回值，url
    pinata.pinFileToIPFS(readableStreamForFile).then((result) => {
      resolve(`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`)
  }).catch((err) => {
      console.log(err);
  });
  })
}


//初始化nft元数据并将元数据通过pinata api上传至IPFS网络并返回元数据rulS
function pinJSONToIPFS() {
  return new Promise(async function (resolve, reject) {
    //获取图片url
    let imageUrl = await pinFileToIPFS()
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

//将以上两个方法封装成mint方法并导出
exports.mint = async function(res, req) {
  const url = await pinJSONToIPFS()
  console.log(url)
}

