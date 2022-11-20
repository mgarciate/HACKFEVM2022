const util = require("util");
const request = util.promisify(require("request"));

task("create-request", "Create a new request in the Oracle")
  .addParam("contractaddress", "The Oracle address")
  .addParam("urltoquery", "Url to query")
  .addParam("attributetofetch", "Attribute to fetch")
  .setAction(async (taskArgs) => {
    const contractAddr = taskArgs.contractaddress
    const _urlToQuery = taskArgs.urltoquery
    const _attributeToFetch = taskArgs.attributetofetch
    const Oracle = await ethers.getContractFactory("Oracle")
    //Get signer information
    const accounts = await ethers.getSigners()
    const signer = accounts[0]
    const priorityFee = await callRpc("eth_maxPriorityFeePerGas")

    async function callRpc(method, params) {
      var options = {
        method: "POST",
        url: network.config.url,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: method,
          params: params,
          id: 1,
        }),
      };
      const res = await request(options);
      return JSON.parse(res.body).result;
    }

    const oracleContract = new ethers.Contract(contractAddr, Oracle.interface, signer)
    console.log("Requesting:", _urlToQuery, "to Oracle with", _attributeToFetch)
    await oracleContract.createRequest(_urlToQuery, _attributeToFetch, {
      gasLimit: 1000000000,
      maxPriorityFeePerGas: priorityFee
    })
    let result = await oracleContract.getCurrentId()
    console.log("New request at Oracle is:", BigInt(result).toString())
  })

module.exports = {}
