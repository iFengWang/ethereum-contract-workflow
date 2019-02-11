const fs = require('fs-extra');
const path = require('path');
const config = require('config');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

// 1. 拿到bytecode
// const contractPath = path.resolve(__dirname, '../compiled/Car.json');
const contractPath = path.resolve(__dirname, '../compiled/ProjectList.json');
const {interface, bytecode} = require(contractPath);
// 2. 配置 provider
const provider = new HDWalletProvider(
  config.get('hdwallet'),
  config.get('infuraUrl'),
);
// 3. 初始化web3实例
const web3 = new Web3(provider);
(async ()=>{
  // 4. 获取钱包里的帐户
  const accounts = await web3.eth.getAccounts();
  console.log('部署合约的帐户:', accounts[0]);

  // 5. 创建合约实例并且部署
  console.time('contract-deploy....1');
  const result = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({
    data:bytecode 
    // arguments: [web3.utils.asciiToHex('AUDI')]
  })
  .send({from:accounts[0], gas:'5000000'});
  console.timeEnd('contract-deploy....2');

  console.log('合约部署成功:', result);
  const contractAddress = result.options.address;

  // 6. 合约地址写入文件系统
  const addressFile = path.resolve(__dirname, '../address.json');
  fs.writeFileSync(addressFile, JSON.stringify(contractAddress));
  console.log('地址写入成功', addressFile);
  process.exit();
})();