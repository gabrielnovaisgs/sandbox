import { printTree } from "./printTree";
import { TreeNode } from "./TreeNode";

const root = new TreeNode(
    3, 
    new TreeNode(9, new TreeNode(5)), 
    new TreeNode(20, 
        new TreeNode(15), 
        new TreeNode(7)));
printTree(root)

const markedNode: TreeNode[][] = []
const listedPerLevel: number[][] = []

let level = 0
markedNode.push([root])
while(markedNode[level] && markedNode[level].length > 0){
    const node = markedNode[level].shift()
    if(!node) continue
    if(!listedPerLevel[level]) listedPerLevel[level] = []
    listedPerLevel[level].push(node.val)
    
    if(!markedNode[level+1]) markedNode[level+1] = []
    if(node.left) markedNode[level+1].push(node.left)
    if(node.right) markedNode[level+1].push(node.right)
   if(markedNode[level].length == 0) {
    level++
   }
   

}

console.log(listedPerLevel)