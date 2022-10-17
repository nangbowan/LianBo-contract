import {
  my,
  Storage,
  JSON,
  DRC721_draft,
} from "@antchain/myassembly";
import {
  Address,
  Attribute,
  WEB3,
  CARBON,
  ANTCHAIN,
  DEFAULT,
} from "./types";

export default class LianBoContract extends DRC721_draft {
  //定义私人白名单
  private whiteList: string[] = [
    "7754b61ac8eadadee3740d2327a4e1a6aeb55ac78b78dda77b77d570821c5b40",
  ];

  //定义大使身份总量：一百万份
  public totalSupply: u32 = 1000000;
  //相当于Counter中的tokenid
  public count: Storage<number> = new Storage<number>("count", 0);
  // 链波标准symbol
  public standard: string = "LianboAmbassador";
  // 每个地址可以铸造的限制数量
  public perIdentityLimit: u8;

  // 合约拥有者
  private owner: Storage<Address>;

  //随机种子Map
  public ambassadorRandomMap: Map<Address, u32> = new Map<string, u32>();
  //定义大使身份:初始只有三个web3推广官，蚂蚁链教育官，碳中和生活官
  public ambassadorsList: Map<string, u32> = new Map<
    string,
    u32
  >();

  //定义组件顺序
  private attributeOrder: Attribute[] = [
    "background",
    "hat",
    "hair",
    "clothes",
    "accessories",
  ];

  constructor() {
    super({
      //发布者的账户地址
      issuer:
        "7754b61ac8eadadee3740d2327a4e1a6aeb55ac78b78dda77b77d570821c5b40",
      // 资产描述，通常描述了资产属性与规则等
      description: "[Lian Bo]:a new world for the young",
      // 资产链接的前面部分
      baseUri: "https://gateway.pinata.cloud/ipfs/",
    });

    //初始化合约拥有者
    this.owner = new Storage(
      "owner",
      "7754b61ac8eadadee3740d2327a4e1a6aeb55ac78b78dda77b77d570821c5b40"
    );
    //每个钱包只可以铸造一个身份
    this.perIdentityLimit = 1;

    //初始化基本大使身份以及对应随机粒子
    this.ambassadorsList.set(WEB3, 0);
    this.ambassadorsList.set(CARBON, 121);
    this.ambassadorsList.set(ANTCHAIN, 242);
  }

  //测试合约部署
  @EXPORT
  public onContractDeploy(): void {
    // 记录合约拥有者
    const ownerAddress = this.owner.getData();

    this.log(`contract created by: ${ownerAddress}`);

    //合约部署者将首先获得身份WEB3概念官身份
  }
  /**
   * 初始化随机形象
   * @param uniqueRandom 传入随机粒子
   * @param ambassadorUri ipfs图片Url
   * @returns 
   */
  @EXPORT
  public initMint(uniqueRandom: u32, ambassadorUri: string): string {
    //获取当前tokenId
    const currentCount = this.count.getData();
    //定义铸造者
    const owner = my.getSender().str;

    //判断随机种子是否合理
    if (!this.isRandomVaild) {
      this.log(`your uniqueRandom is unvaild!`);
      return "null";
    }
    //查看是否超过总铸造值
    if (currentCount > this.totalSupply) {
      this.log(`Total supply is ${this.totalSupply}`);
      return "null";
    }

    //判断是否超过地址限量
    if (this.AssetCount(owner) >= this.perIdentityLimit) {
      this.log("per identity can only own one ambassador");
      return "null";
    }

    // 发放资产
    const assetObj = JSON.Value.Object();

    //铸造
    assetObj.set("assetInfo", uniqueRandom.toString());
    assetObj.set("assetUri", ambassadorUri);

    this.issue(owner, assetObj.toString());

    this.count.setData(currentCount + 1);

    this.setRandom3(owner, uniqueRandom);

    // 返回所有资产
    return this.GetAssets(owner);
  }

  /**
   * 白名单铸造，暂时用不到
   * @param ambassadorChoice 大使身份选择》0:WEB3,1:ANTCHAIN,2:CARBON
   * @param ambassadorUri ipfs图片Url
   */
  @EXPORT
  public whiteListMint(ambassadorChoice: u32, ambassadorUri: string): string {
    //获取当前tokenId
    const currentCount = this.count.getData();
    //定义铸造者
    const owner = my.getSender().str;

    //要求选择区间
    if (!(ambassadorChoice >= 0 && ambassadorChoice <= 2)) {
      this.log("unvalid choice");
      return "null";
    }

    //查看是否超过总铸造值
    if (currentCount >= this.totalSupply) {
      this.log(`Total supply is ${this.totalSupply}`);
      return "null";
    }

    //判断是否超过地址限量
    if (this.AssetCount(owner) >= this.perIdentityLimit) {
      this.log("per identity can only own one ambassador");
      return "null";
    }

    // 仅白名单账户可以 mint
    const whiteList = this.whiteList;

    if (!(whiteList.indexOf(owner) != -1)) {
      this.log("You are not in the white list");
      return "null";
    }

    const assetObj = JSON.Value.Object();

    let ambassadorChoiceStr: string = "DEFAULT";
    if (ambassadorChoice == 0) {
      ambassadorChoiceStr = WEB3;
    } else if (ambassadorChoice == 1) {
      ambassadorChoiceStr = CARBON;
    } else {
      ambassadorChoiceStr = ANTCHAIN;
    }
    //直接通过数字选择确定身份随机粒子
    const identityRandom: u32 = this.ambassadorsList.get(ambassadorChoiceStr);

    //铸造
    assetObj.set("assetInfo", ambassadorChoiceStr);
    assetObj.set("assetUri", ambassadorUri);

    //铸造
    this.issue(owner, assetObj.toString());

    this.count.setData(currentCount + 1);

    //存储map
    this.setRandom3(owner, identityRandom);

    // 返回所有资产
    return this.GetAssets(owner);
  }

  /**
   * 交换部件铸造接口
   * @param uniqueRandom 修改的随机粒子
   * @param ambassadorUri ipfs图片Url
   * @returns 颠覆数字资产上链即不可改变的事实
   */
  @EXPORT
  public exchangeMint(uniqueRandom: u32, ambassadorUri: string): string {

    //获取当前tokenId
    const currentCount = this.count.getData();
    //定义铸造者
    const owner = my.getSender().str;

    //判断随机种子是否合理
    if (!this.isRandomVaild) {
      this.log(`your uniqueRandom is unvaild!`);
      return "null";
    }

    //查看是否超过总铸造值
    if (currentCount > this.totalSupply) {
      this.log(`Total supply is ${this.totalSupply}`);
      return "null";
    }

    //判断是否超过地址限量
    if (this.AssetCount(owner) >= this.perIdentityLimit) {
      this.log("per identity can only own one ambassador");
      return "null";
    }

    //不是第一次铸造才可以调用交换铸造
    if(!this.ambassadorRandomMap.has(owner)){
      this.log("this is your first mint!");
      return "null";
    }

    let ambassadorChoiceStr: string = DEFAULT;

    //确定交换身份
    ambassadorChoiceStr =
      uniqueRandom == 0
        ? WEB3
        : uniqueRandom == 121
        ? CARBON
        : uniqueRandom == 242
        ? ANTCHAIN
        : DEFAULT;

    this.log(ambassadorChoiceStr);

    if (ambassadorChoiceStr != DEFAULT) {
      // 发放资产
      const assetObj = JSON.Value.Object();

      //发放身份
      assetObj.set("assetInfo", ambassadorChoiceStr);
      assetObj.set("assetUri", ambassadorUri);

      this.replaceIssue(owner,assetObj.toString());

      //这里不加
      this.count.setData(currentCount);

      this.changeRandom3(owner, uniqueRandom);

      // 返回所有资产
      return this.GetAssets(owner);
    } else {
      // 发放资产
      const assetObj = JSON.Value.Object();

      //铸造普通粒子身份
      assetObj.set("assetInfo", uniqueRandom.toString());
      assetObj.set("assetUri", ambassadorUri);

      this.replaceIssue(owner,assetObj.toString());

      //这里不加
      this.count.setData(currentCount);

      this.changeRandom3(owner, uniqueRandom);

      // 返回所有资产
      return this.GetAssets(owner);
    }
  }



  @EXPORT
  public print():string{
    //定义铸造者
    const owner = my.getSender().str;

    return this.GetAssets(owner)
  }

  /**
   *
   * @param string 大使类型
   * @param identityRandom 定义大使类型的身份例子
   * @returns
   */
  @EXPORT
  public addAmbassadorType(
    ambassadorType: string,
    identityRandom: u32
  ): bool {
    if (!this.isOwner()) {
      this.log("only contract owner can manage!");
      return false;
    }
    this.ambassadorsList.set(ambassadorType, identityRandom);
    return true;
  }

  /**
   * 设置地址随机种子
   * @param owner 调用地址
   * @param uniqueRandom 随机种子
   * @returns
   */
  private setRandom3(owner: string, uniqueRandom: u32): bool {
    //存储地址身份随机种子
    this.ambassadorRandomMap.set(owner, uniqueRandom);

    return true;
  }

  /**
   * 更改地址随机种子
   * @param owner 调用地址
   * @param changeRandom3 随机种子
   * @returns
   */
  private changeRandom3(owner: string, changeRandom3: u32): bool {
    if (!this.ambassadorRandomMap.has(owner)) {
      this.log("your random msg not exsits");
      return false;
    }

    this.ambassadorRandomMap.set(owner, changeRandom3);

    return true;
  }

  /**
   *
   * @param uniqueRandom 随机种子
   */
  private isRandomVaild(uniqueRandom: u32): bool {
    return uniqueRandom <= 242 && uniqueRandom >= 0;
  }

  /**
   *
   * @returns true or false
   */
  private isOwner(): bool {
    return this.owner.getData() == my.getSender().toString();
  }

  /**
   *
   * @param message input msg
   */
  private log(message: string): void {
    my.log(`[lianboambassador] ${message}`, []);
  }
}
