import React, { useState } from 'react';
import { useAntchain, WasmContract } from '@antchain/jssdk/react';
import { Spin, Button, Descriptions } from 'antd';
// 这里要替换为你想要调用的合约的 ABI
import abi from '@/abis/myfish-demo.json';
import styles from './styles.less';


export default () => {
  const {
    loading,
    isInstalled,
    antchain,
    data: {
      chainId,
      accounts: [account],
    },
  } = useAntchain();

  const [callContractLoading, setCallContractLoading] = useState(false);
  const [callContractResult, setCallContractResult] = useState('');

  if (loading) {
    return (
      <div className={styles.wrap}>
        <Spin />
      </div>
    );
  }

  if (!isInstalled) {
    return (
      <div className={styles.wrap}>
        <a href="https://docs.antchain.antgroup.com/" target="_blank">
          <Button type="primary">去下载蚂蚁链连接器</Button>
        </a>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {chainId ? (
        <Descriptions
          title="上链就上蚂蚁链"
          size="small"
          column={1}
          bordered
          style={{ marginBottom: 30 }}
        >
          <Descriptions.Item label="当前连接的链">{chainId}</Descriptions.Item>
          {account ? (
            <>
              <Descriptions.Item label="账户名称">{account.accountName}</Descriptions.Item>
              <Descriptions.Item label="账户地址">{account.accountAddress}</Descriptions.Item>
            </>
          ) : null}
        </Descriptions>
      ) : null}
      {account ? (
        <>
          <Button
            type="primary"
            onClick={async () => {
              setCallContractLoading(true);
              const contractName = abi.contract_git_id;
              // abi 要替换为你想要调用的合约的 abi
              const contract = new WasmContract({ contractName, abi: JSON.stringify(abi) }, antchain);
              try {
                const res = await contract.call<number>({ methodName: 'GetName' });
                setCallContractResult(res.returnValue.toString());
              } catch (e) {
                console.error('合约调用失败 error:', e);
              }
              setCallContractLoading(false);
            }}
          >
            调用合约
          </Button>
          <div style={{ marginTop: 20 }}>
            {callContractLoading ? <Spin /> : null}
            {callContractResult ? `调用结果：${callContractResult}` : null}
          </div>
        </>
      ) : (
        <Button
          type="primary"
          onClick={() => {
            antchain.requestAccounts().catch((err: any) => {
              console.error('requestAccounts error:', err);
            });
          }}
        >
          连接区块链
        </Button>
      )}
    </div>
  );
};
