import { TreeNode } from "./TreeNode"

 
const root = new TreeNode(2, new TreeNode(1), new TreeNode(3))
const preOrderQueue: number[]= []
function preOrderSearch(node: TreeNode| null){
    if(!node) return
    preOrderQueue.push(node.val)
    preOrderSearch(node.left)
    preOrderSearch(node.right)
}
preOrderSearch(root)
console.log(preOrderQueue)

const inOrderQueue: number[]= []
function inOrderSearch(node: TreeNode| null){
    if(!node) return
    inOrderSearch(node.left)
    inOrderQueue.push(node.val)
    inOrderSearch(node.right)
}
inOrderSearch(root)
console.log(inOrderQueue)

const postOrderQueue: number[]= []
function postOrderSearch(node: TreeNode| null){
    if(!node) return
    postOrderSearch(node.left)
    postOrderSearch(node.right)
    postOrderQueue.push(node.val)
}
postOrderSearch(root)
console.log(postOrderQueue)