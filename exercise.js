const axios = require('axios');
const BASE_URL = 'https://nodes-on-nodes-challenge.herokuapp.com/nodes/';

const requestNodes = async (nodeIds, nodesHash) => {
    const nodesString = nodeIds.join(',');
    let data;
    let childNodeIds = [];
    try {
        ({ data } = await axios.get(`${BASE_URL}${nodesString}`));
    } catch (err) {
        console.log(err);
        return false;
    }
    
    if (data) {
        data.forEach(node => {
            childNodeIds = childNodeIds.concat(node.child_node_ids);
        });
    }

    const newNodeIdsFound = [];
    
    childNodeIds.forEach(nodeId => {
        if (nodesHash[nodeId] === undefined) {
            nodesHash[nodeId] = 1;
            newNodeIdsFound.push(nodeId);
        } else {
            nodesHash[nodeId] += 1;
        }
    });

    if (newNodeIdsFound.length) {
        return requestNodes(newNodeIdsFound, nodesHash);
    }
    return nodesHash;
};

const summarizeNodesHash = (nodesHash) => {
    let mostCommonNodes = [];
    let currentMaxOccurence = 0;
    for (key in nodesHash) {
        if (nodesHash[key] === currentMaxOccurence) { // multiple nodes could appear with same max number of occurences
            mostCommonNodes.push(key);
        }
        if (nodesHash[key] > currentMaxOccurence) {
            mostCommonNodes = [key];
            currentMaxOccurence = nodesHash[key];
        }
    }
    return [Object.keys(nodesHash).length, mostCommonNodes];
}

const summarizeGraph = async () => {
    const INITIAL_NODE_ID = '089ef556-dfff-4ff2-9733-654645be56fe';
    const initialNodesHash = {};
    initialNodesHash[INITIAL_NODE_ID] = 1;
    const nodesHash = await requestNodes([INITIAL_NODE_ID], initialNodesHash);
    const summary = summarizeNodesHash(nodesHash);
    return summary;
}

(async () => {
    const result = await summarizeGraph();
    console.log({ result });
})();