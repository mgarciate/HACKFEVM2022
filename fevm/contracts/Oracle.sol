// SPDX-License-Identifier: MIT
// Source: https://github.com/pedroduartecosta/blockchain-oracle
pragma solidity 0.8.17;

contract Oracle {
    Request[] requests; //list of requests made to the contract
    uint256 currentId = 0; //increasing request id

    // defines a general api request
    struct Request {
        uint256 id; //request id
        string urlToQuery; //API url
        string attributeToFetch; //json attribute (key) to retrieve in the response
        string agreedValue; //value from key
        mapping(uint256 => string) anwers; //answers provided by the oracles
        mapping(address => uint256) quorum; //oracles which will query the answer (1=oracle hasn't voted, 2=oracle has voted)
    }

    //event that triggers oracle outside of the blockchain
    event NewRequest(uint256 id, string urlToQuery, string attributeToFetch);

    //triggered when there's a consensus on the final result
    event UpdatedRequest(
        uint256 id,
        string urlToQuery,
        string attributeToFetch,
        string agreedValue
    );

    function createRequest(string memory _urlToQuery, string memory _attributeToFetch) public {
        currentId++;
        Request storage newRequest = requests[currentId];
        newRequest.id = currentId;
        newRequest.urlToQuery = _urlToQuery;
        newRequest.attributeToFetch = _attributeToFetch;
        newRequest.agreedValue = "";

        // launch an event to be detected by oracle outside of blockchain
        emit NewRequest(currentId, _urlToQuery, _attributeToFetch);

        // increase request id
    }

    //called by the oracle to record its answer
    function updateRequest(uint256 _id, string memory _valueRetrieved) public {
        Request storage currRequest = requests[_id];

        //check if oracle is in the list of trusted oracles
        //and if the oracle hasn't voted yet
        if (currRequest.quorum[address(msg.sender)] == 1) {
            //marking that this address has voted
            currRequest.quorum[msg.sender] = 2;

            //iterate through "array" of answers until a position if free and save the retrieved value
            uint256 tmpI = 0;
            bool found = false;
            while (!found) {
                //find first empty slot
                if (bytes(currRequest.anwers[tmpI]).length == 0) {
                    found = true;
                    currRequest.anwers[tmpI] = _valueRetrieved;
                }
                tmpI++;
            }

            currRequest.agreedValue = _valueRetrieved;
            emit UpdatedRequest(
                currRequest.id,
                currRequest.urlToQuery,
                currRequest.attributeToFetch,
                currRequest.agreedValue
            );
        }
    }
}
