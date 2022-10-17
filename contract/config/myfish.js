// 配置说明请参考 https://opendocs.antchain.antgroup.com/myfish/myfish-config
module.exports = {
  // 合约相关配置
  contract: {
    type: 'assemblyscript',
    name: 'LianBo-Dapp0.7',
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


//最新交易hash：0x3f7bbd80188f8b7e04469f9162a0c6608812ab037c89e9f59e66269c1721d506


