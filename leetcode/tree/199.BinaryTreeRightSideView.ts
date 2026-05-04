import { printTree } from "./printTree";
import { TreeNode } from "./TreeNode";

const root = new TreeNode(1, new TreeNode(2, new TreeNode(4, new TreeNode(5))), new TreeNode(3))
printTree(root)
const markedNodes: TreeNode[] = []
const listedValules: number[] = []

markedNodes.push(root)
while(markedNodes.length>0){
    const length = markedNodes.length
    const currentLevel:number[] = []
    for(let i = 0; i< length; i++){
        const node = markedNodes.shift()
        if(!node) continue
    
        if(node.left) markedNodes.push(node.left)
        if(node.right) markedNodes.push(node.right)
        currentLevel.push(node.val)
    }
    const rightNode = currentLevel.pop() 
    if(rightNode){
        listedValules.push(rightNode)
    }
}

console.log(listedValules)