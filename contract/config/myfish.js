// 配置说明请参考 https://opendocs.antchain.antgroup.com/myfish/myfish-config
module.exports = {
  // 合约相关配置
  contract: {
    type: 'assemblyscript',
    name: 'LianBo-Dapp1.1',
    version: 1,
  },
  // rest 链接链相关配置
  // 请获取你的链的相关 AK/SK 等信息填入配置
  // 参考文档 https://opendocs.antchain.antgroup.com/myfish/connect
  rest: {
    bizid: '0b06e2744ad341538b7a3b3cc5ad9e57', // 链的 ID，这里默认是实验链的 ID
    restUrl: 'https://rest.baas.alipay.com',
    accessId: 'LABaRlo5pdA2088042772711852',
    accessSecret: './certs/access.key',
    account: '77Brother',
    accountPrivateKey: './certs/user.key',
    accountPrivateKeyPassword: 'coolSWJ7327!',
  },
};


//最新交易hash：0xe17688d933145001eb9fabb9a32f382b3a01989c5b554c0fddf69759901b3f94


