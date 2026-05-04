import { TreeNode } from "./TreeNode";

export function printTree(root: TreeNode | null): void {
    if (!root) {
        console.log("(empty tree)");
        return;
    }
    render(root).lines.forEach(l => console.log(l));
}

interface Block {
    lines: string[];
    root: number;  // center x of root within the block
    width: number; // total width of the block
}

function render(node: TreeNode | null): Block {
    if (!node) return { lines: [], root: 0, width: 0 };

    const lbl = `(${node.val})`;
    const half = Math.floor(lbl.length / 2);

    if (!node.left && !node.right) {
        return { lines: [lbl], root: half, width: lbl.length };
    }

    const L = render(node.left);
    const R = render(node.right);
    const SEP = 2;

    if (!node.left) {
        const nodeRoot = half;
        const rStart = nodeRoot + 2;
        const width = Math.max(lbl.length, rStart + R.width);
        return {
            lines: [
                lbl.padEnd(width),
                (' '.repeat(nodeRoot + 1) + '\\').padEnd(width),
                ...R.lines.map(l => (' '.repeat(rStart) + l).padEnd(width)),
            ],
            root: nodeRoot,
            width,
        };
    }

    if (!node.right) {
        const nodeRoot = L.root + 2;
        const nodeStart = nodeRoot - half;
        const width = Math.max(nodeStart + lbl.length, L.width);
        const conn = Array(width).fill(' ');
        conn[L.root + 1] = '/';
        return {
            lines: [
                (' '.repeat(nodeStart) + lbl).padEnd(width),
                conn.join(''),
                ...L.lines.map(l => l.padEnd(width)),
            ],
            root: nodeRoot,
            width,
        };
    }

    // Both children
    const rOffset = L.width + SEP;
    const lRoot = L.root;
    const rRoot = rOffset + R.root;
    const nodeRoot = Math.floor((lRoot + rRoot) / 2);
    const nodeStart = nodeRoot - half;
    const width = Math.max(rOffset + R.width, nodeStart + lbl.length);

    const conn = Array(width).fill(' ');
    for (let i = lRoot + 1; i < nodeRoot; i++) conn[i] = '/';
    for (let i = nodeRoot + 1; i <= rRoot - 1; i++) conn[i] = '\\';
    // ensure at least one connector character on each side
    if (conn[nodeRoot - 1] === ' ') conn[nodeRoot - 1] = '/';
    if (conn[nodeRoot + 1] === ' ') conn[nodeRoot + 1] = '\\';

    const maxSub = Math.max(L.lines.length, R.lines.length);
    const subs: string[] = [];
    for (let i = 0; i < maxSub; i++) {
        const ll = (i < L.lines.length ? L.lines[i] : '').padEnd(L.width);
        const rl = i < R.lines.length ? R.lines[i] : '';
        subs.push((ll + ' '.repeat(SEP) + rl).padEnd(width));
    }

    return {
        lines: [
            (' '.repeat(Math.max(0, nodeStart)) + lbl).padEnd(width),
            conn.join(''),
            ...subs,
        ],
        root: nodeRoot,
        width,
    };
}
