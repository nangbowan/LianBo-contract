const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')


//在这里设置白名单
let whitelist = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x1499b8312e6fe58b5d1164d4eccf795367c9e1d3",
    "0x55f510be6ab4c7e07ec6ee637aa83574975d6898",
    "0xcc2fe3615a45fcacc3534d53be41c6543a0a312d",
    "0xee226379db83cffc681495730c11fdde79ba4c0c",
    "0x55f510be6ab4c7e07ec6ee637aa83574975d6898",
    "0x18b2a687610328590bc8f2e5fedde3b582a49cda"
]

let leaf;
let rootHash;
let hexProof;
let verifyResult;


const leafNodes = whitelist.map(addr => keccak256(addr));
const merkletree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

function getRootHash() {
    rootHash = '0x' + merkletree.getRoot().toString('hex');

    return rootHash;
}

function getProof(address) {
    if (address.length <= 28) {
        return 'your address is fault!';
    }
    leaf = keccak256(address)

    hexProof = merkletree.getHexProof(leaf);
    return hexProof;
}



function getVerifyResult(hexProof, address, rootHash) {
    leaf = keccak256(address)
    verifyResult = merkletree.verify(hexProof, leaf, rootHash);
    return verifyResult;
}


//测试函数，请勿调用
function printDetails() {

    console.log(merkletree.toString() + '\n');
    rootHash = getRootHash();
    hexProof = getProof(whitelist[0]);
    verifyResult = getVerifyResult(hexProof, whitelist[0], rootHash);

    console.log('roothash is:' + rootHash + '\n');
    console.log('hexProof is:' + hexProof + '\n');
    console.log('VerifyResult is:' + verifyResult + '\n');

}


printDetails();




