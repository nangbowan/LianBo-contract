import { Identity, mock, my } from "@antchain/myassembly";
import Contract from ".";

const owner =
  "7754b61ac8eadadee3740d2327a4e1a6aeb55ac78b78dda77b77d570821c5b40";

function init(): Contract {
  const contract = new Contract();
  contract.onContractDeploy();
  return contract;
}
// Common log method, use [lianboambassador] as prefix
function log(message: string): void {
  my.log(`[lianboambassador] ${message}`, []);
}

describe("Contract test", () => {
  test("assetmeta", () => {
    const contract = init();
    expect(contract.AssetMeta()).toBe(
      `{"issuer":"${owner}","description":"[Lian Bo]:a new world for the young","baseUri":"https://gateway.pinata.cloud/ipfs/"}`
    );
    mock.my.getSender.returnValue(
      new Identity(
        "7754b61ac8eadadee3740d2327a4e1a6aeb55ac78b78dda77b77d570821c5b40"
      )
    );

    expect(contract.perIdentityLimit).toBe(3);
    log(contract.ambassadorsList.get("WEB3").toString());
    log(contract.ambassadorsList.get("ANTCHAIN").toString());
    log(contract.ambassadorsList.get("CARBON").toString());
  });

  test("initMint", () => {
    const contract = init();
    mock.my.getSender.returnValue(
      new Identity(
        "7754b61ac8eadadee3740d2327a4e1a6aeb55ac78b78dda77b77d570821c5b40"
      )
    );
    expect(contract.initMint(123, "123456")).toBe(
      '[{"assetInfo":"123","assetUri":"123456","assetId":"1"}]'
    );
  });

//   test("white Mint", () => {
//     const contract = init();
//     mock.my.getSender.returnValue(
//       new Identity(
//         "7754b61ac8eadadee3740d2327a4e1a6aeb55ac78b78dda77b77d570821c5b40"
//       )
//     );

//     log(my.getSender().str);
//     expect(contract.whiteListMint(1, "123456")).toBe(
//       '[{"assetInfo":123,"assetUri":"123456","assetId":"1"},{"assetInfo":"CARBON","assetUri":"123456","assetId":"2"}]'
//     );
//   });

//   test("Exchange Mint", () => {
//     const contract = init();
//     mock.my.getSender.returnValue(
//       new Identity(
//         "7754b61ac8eadadee3740d2327a4e1a6aeb55ac78b78dda77b77d570821c5b40"
//       )
//     );

//     log(my.getSender().str);
//     expect(contract.exchangeMint(12, "123456")).toBe(
//       '[{"assetInfo":123,"assetUri":"123456","assetId":"1"},{"assetInfo":"CARBON","assetUri":"123456","assetId":"2"}]'
//     );
//   });

  test("print", () => {
    const contract = init();
    mock.my.getSender.returnValue(
      new Identity(
        "7754b61ac8eadadee3740d2327a4e1a6aeb55ac78b78dda77b77d570821c5b40"
      )
    );

    log(contract.print());
  });


  test("exchange mint",()=>{
    const contract = init();
    mock.my.getSender.returnValue(
      new Identity(
        "7754b61ac8eadadee3740d2327a4e1a6aeb55ac78b78dda77b77d570821c5b40"
      )
    );

    expect(contract.exchangeMint(19,"https://fjskahjfkhjksahdf")).toBe(
      '[{"assetInfo":"19","assetUri":"https://fjskahjfkhjksahdf","assetId":"1"}]'
    )
    
  })
});
