import { TreeNode } from "./TreeNode";

const root = new TreeNode(
    1, 
    new TreeNode(2, 
        new TreeNode(4), 
        new TreeNode(5)), 
    new TreeNode(3, 
        new TreeNode(6), 
        new TreeNode(7)));

const nodeToSearch: TreeNode[] = []
const listedPerLevel: number[] = []
nodeToSearch.push(root)

while(nodeToSearch.length > 0){
    const node = nodeToSearch.shift()
    if(!node) continue
    listedPerLevel.push(node.val)
    if(node.left) nodeToSearch.push(node.left)
    if(node.right) nodeToSearch.push(node.right)
    console.log(listedPerLevel)
}
