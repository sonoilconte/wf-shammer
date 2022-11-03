const axios = require('axios');
const BASE_URL = 'https://nodes-on-nodes-challenge.herokuapp.com/nodes/';

const requestNodes = async (nodeIds, nodesHash) => {

    console.log(nodesHash);
    console.log('Number of keys', Object.keys(nodesHash).length);

    const nodesString = nodeIds.join(',');

    let data;

    let childNodeIds = [];
    try {
        ({ data } = await axios.get(`${BASE_URL}${nodesString}`));
    } catch (err) {
        console.log("error");
        return nodesHash;
    }
    
    if (data) {
        data.forEach(node => {
            childNodeIds = childNodeIds.concat(node.child_node_ids);
        });
    }
    // console.log({ childNodeIds });

    let newNodeFound = false;
    nodeIds.forEach(nodeId => {
        if (nodesHash[nodeId] === undefined) {
            nodesHash[nodeId] = 1;
            newNodeFound = true;
        } else {
            nodesHash[nodeId] += 1;
        }
    });

    if (newNodeFound) {
        requestNodes(childNodeIds, nodesHash);
    }

    return nodesHash;
}

// requestNodes(['ada97092-5d66-4eb3-a266-eea90d738da2','684e2b62-d710-4e05-9530-d9408a442e7e']);


const summarizeGraph = async () => {

    const nodesHash = await requestNodes(['089ef556-dfff-4ff2-9733-654645be56fe'], {});

    return nodesHash;
}


(async function() {
    const result = await summarizeGraph();
    console.log({ result });
})();