import { printTree } from "./printTree";
import { TreeNode } from "./TreeNode";

const root = new TreeNode(
    3, 
    new TreeNode(9, new TreeNode(5)), 
    new TreeNode(20, 
        new TreeNode(15), 
        new TreeNode(7)));
printTree(root)

const markedNode: TreeNode[] = []
const listedPerLevel: number[][] = []
markedNode.push(root)

while(markedNode.length > 0){
    const length = markedNode.length
    const currentLevel = [] 

    for(let i =0; i < length; i++){
        const node = markedNode.shift()
        if (!node) continue
        currentLevel.push(node.val)
        if(node.left) markedNode.push(node.left)
        if(node.right) markedNode.push(node.right)
    }
    listedPerLevel.push(currentLevel)
}
console.log(listedPerLevel)