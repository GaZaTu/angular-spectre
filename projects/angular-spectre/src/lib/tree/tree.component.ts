import { Component, AfterContentInit, OnChanges, Input, Output, EventEmitter, ContentChild, TemplateRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { TreeBranchDirective, TreeLeafDirective } from './tree.directives';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

export interface TreeNode<TBranch = any, TLeaf = any> {
  key: any
  branch?: TBranch
  leaf?: TLeaf
  children?: TreeNode<TBranch, TLeaf>[]
}

export interface FlatTreeNode<TBranch = any, TLeaf = any> extends TreeNode<TBranch, TLeaf> {
  level: number
  parent?: TreeNode<TBranch, TLeaf>
}

export interface TreeNodeMoveEvent<TBranch = any, TLeaf = any> {
  node: TBranch | TLeaf
  nodeIsLeaf: boolean
  prevParent?: TBranch
  nextParent?: TBranch
  prevIndex: number
  nextIndex: number
}

interface BranchMetadata {
  expanded?: boolean
  selected?: boolean
}

interface LeafMetadata {
  selected?: boolean
}

function newMapWithDefaultGet<K, V>(defaultValue: () => V) {
  return new Proxy(new Map<K, V>(), {
    get: (map, p) => {
      if (p === 'get') {
        return (key: any) => {
          const oldData = map.get(key)

          if (oldData) {
            return oldData
          } else {
            const newData = defaultValue()
            map.set(key, newData)
            return newData
          }
        }
      } else {
        return (typeof map[p] === 'function') ? map[p].bind(map) : map[p]
      }
    },
  })
}

@Component({
  selector: 'spectre-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent<TBranch = any, TLeaf = any> implements AfterContentInit, OnChanges {
  @Input()
  trackBranchBy: (branch: TBranch) => any
  @Input()
  set trackBranchByKey(key: string) {
    this.trackBranchBy = branch => branch[key]
  }
  @Input()
  trackLeafBy: (leaf: TLeaf) => any
  @Input()
  set trackLeafByKey(key: string) {
    this.trackLeafBy = leaf => leaf[key]
  }
  @Input()
  trackNodeParentBy = (node: TBranch | TLeaf, isLeaf: boolean) => this.trackBranchBy(node as any)
  @Input()
  set trackNodeParentByKey(key: string) {
    this.trackNodeParentBy = node => node[key]
  }
  @Input()
  trackNodeIndexBy = (node: TBranch | TLeaf, isLeaf: boolean) => 0
  @Input()
  set trackNodeIndexByKey(key: string) {
    this.trackNodeIndexBy = node => node[key]
  }
  @Input()
  trackNodeIsRootBy = (node: TBranch | TLeaf, isLeaf: boolean) => !this.trackNodeParentBy(node, isLeaf)
  @Input()
  set trackNodeIsRootByKey(key: string) {
    this.trackNodeIsRootBy = node => node[key]
  }
  @Input()
  trackNodeIsLeafBy = (node: TBranch | TLeaf): node is TLeaf => !!this.leafMap.get(this.trackLeafBy(node as any))
  @Input()
  set trackNodeIsLeafByKey(key: string) {
    this.trackNodeIsLeafBy = (node): node is TLeaf => node[key]
  }

  // @Input()
  // trackNodeDraggableBy = (subject: { node: TBranch | TLeaf, isLeaf: boolean }, from: { branch: TBranch }) => false
  // @Input()
  // trackNodeDroppableBy = (subject: { node: TBranch | TLeaf, isLeaf: boolean }, from: { branch: TBranch }, to: { branch: TBranch }) => false

  @Input()
  set branches(branches: TBranch[] | undefined) {
    branches = branches || []
    this.branchMap.clear()

    for (const branch of branches) {
      this.branchMap.set(this.trackBranchBy(branch), branch)
    }
  }
  @Input()
  set leafs(leafs: TLeaf[] | undefined) {
    leafs = leafs || []
    this.leafMap.clear()

    for (const leaf of leafs) {
      this.leafMap.set(this.trackLeafBy(leaf), leaf)
    }
  }

  @Input()
  set selectedBranches(branches: TBranch[] | undefined) {
    branches = branches || []

    for (const metadata of this.branchMetadata.values()) {
      metadata.selected = false
    }

    for (const branch of branches) {
      const key = this.trackBranchBy(branch)
      const metadata = this.branchMetadata.get(key)

      metadata.selected = true
    }
  }
  get selectedBranches() {
    return [...this.branchMetadata.entries()]
      .filter(([_, metadata]) => metadata.selected)
      .map(([key, _]) => this.branchMap.get(key))
  }

  @Input()
  set selectedLeafs(leafs: TLeaf[] | undefined) {
    leafs = leafs || []

    for (const metadata of this.leafMetadata.values()) {
      metadata.selected = false
    }

    for (const leaf of leafs) {
      const key = this.trackLeafBy(leaf)
      const metadata = this.leafMetadata.get(key)

      metadata.selected = true
    }
  }
  get selectedLeafs() {
    return [...this.leafMetadata.entries()]
      .filter(([_, metadata]) => metadata.selected)
      .map(([key, _]) => this.leafMap.get(key))
  }

  @Input()
  flat = true

  @Output()
  selectedBranchesChange = new EventEmitter<TBranch[]>()
  @Output()
  selectedLeafsChange = new EventEmitter<TLeaf[]>()

  @Output()
  nodeMove = new EventEmitter<TreeNodeMoveEvent<TBranch, TLeaf>>()

  @ContentChild(TreeBranchDirective, { read: TemplateRef })
  branchTemplate?: TemplateRef<any>
  @ContentChild(TreeLeafDirective, { read: TemplateRef })
  leafTemplate?: TemplateRef<any>

  rootTreeNodes = [] as TreeNode<TBranch, TLeaf>[]
  flatTreeNodes = [] as FlatTreeNode<TBranch, TLeaf>[]

  branchNodeMap = new Map<any, TreeNode<TBranch, TLeaf>>()
  leafNodeMap = new Map<any, TreeNode<TBranch, TLeaf>>()

  branchMap = new Map<any, TBranch>()
  leafMap = new Map<any, TLeaf>()

  branchMetadata = newMapWithDefaultGet<any, BranchMetadata>(() => ({}))
  leafMetadata = newMapWithDefaultGet<any, LeafMetadata>(() => ({}))

  unselectable = false

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    this.changeDetectorRef.detach()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  ngOnChanges() {
    this.updateRootTreeNodes()
    this.changeDetectorRef.detectChanges()
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  onWindowKeydownAndUp(event: KeyboardEvent) {
    if (event.shiftKey !== this.unselectable) {
      this.unselectable = event.shiftKey
      this.changeDetectorRef.detectChanges()
    }
  }

  trackNodeBy(index: number, node: TreeNode<TBranch, TLeaf>) {
    return node.key
  }

  updateRootTreeNodes() {
    const rootTreeNodes = [] as TreeNode<TBranch, TLeaf>[]
    const branchNodeMap = new Map<any, TreeNode<TBranch, TLeaf>>()
    const leafNodeMap = new Map<any, TreeNode<TBranch, TLeaf>>()

    for (const [key, branch] of this.branchMap) {
      branchNodeMap.set(key, { key, branch, children: [] })
    }

    for (const [key, leaf] of this.leafMap) {
      leafNodeMap.set(key, { key, leaf })
    }

    for (const branchNode of branchNodeMap.values()) {
      const parentKey = this.trackNodeParentBy(branchNode.branch, false)
      const parentNode = branchNodeMap.get(parentKey)

      if (parentNode) {
        parentNode.children.push(branchNode)
      }

      if (this.trackNodeIsRootBy(branchNode.branch, false)) {
        rootTreeNodes.push(branchNode)
      }
    }

    for (const leafNode of leafNodeMap.values()) {
      const parentKey = this.trackNodeParentBy(leafNode.leaf, true)
      const parentNode = branchNodeMap.get(parentKey)

      if (parentNode) {
        parentNode.children.push(leafNode)
      }

      if (this.trackNodeIsRootBy(leafNode.leaf, true)) {
        rootTreeNodes.push(leafNode)
      }
    }

    for (const branchNode of branchNodeMap.values()) {
      branchNode.children = branchNode.children.sort((a, b) => {
        const aIdx = this.trackNodeIndexBy(a.leaf ? a.leaf : a.branch, !!a.leaf)
        const bIdx = this.trackNodeIndexBy(b.leaf ? b.leaf : b.branch, !!b.leaf)

        if (aIdx < bIdx) {
          return -1
        } else if (aIdx > bIdx) {
          return 1
        } else {
          return 0
        }
      })
    }

    this.rootTreeNodes = rootTreeNodes
    this.branchNodeMap = branchNodeMap
    this.leafNodeMap = leafNodeMap
    this.changeDetectorRef.detectChanges()

    if (this.flat) {
      this.updateFlatTreeNodes()
    }
  }

  updateFlatTreeNodes() {
    const flatTreeNodes = [] as FlatTreeNode<TBranch, TLeaf>[]
    const addNodes = (nodes: TreeNode<TBranch, TLeaf>[], parent: TreeNode<TBranch, TLeaf> | undefined, level: number) => {
      for (const node of nodes) {
        flatTreeNodes.push(Object.assign(node, { level, parent }))

        if (node.children) {
          addNodes(node.children, node, level + 1)
        }
      }
    }

    addNodes(this.rootTreeNodes, undefined, 0)

    this.flatTreeNodes = flatTreeNodes
    this.changeDetectorRef.detectChanges()
  }

  toggleBranchExpanded(branch: TBranch) {
    const metadata = this.branchMetadata.get(this.trackBranchBy(branch))

    metadata.expanded = !metadata.expanded
    this.changeDetectorRef.detectChanges()
  }

  toggleNodeSelected(node: TBranch | TLeaf) {
    const isLeaf = this.trackNodeIsLeafBy(node)
    const nodeKey = isLeaf ? this.trackLeafBy(node as any) : this.trackBranchBy(node as any)
    const metadata = isLeaf ? this.leafMetadata.get(nodeKey) : this.branchMetadata.get(nodeKey)

    metadata.selected = !metadata.selected && (isLeaf || !(metadata as any).expanded)
    this.changeDetectorRef.detectChanges()
  }

  handleNodeSelectionClick(node: TBranch | TLeaf, event: MouseEvent) {
    const isLeaf = this.trackNodeIsLeafBy(node)
    const trackNodeBy = (isLeaf ? this.trackLeafBy : this.trackBranchBy)
    const nodeKey = trackNodeBy(node as any)
    const metadata = (isLeaf ? this.leafMetadata.get(nodeKey) : this.branchMetadata.get(nodeKey))
    const prevSelection = [...this.selectedBranches, ...this.selectedLeafs]

    let nextSelection = [] as (TBranch | TLeaf)[]

    if (metadata.selected && (isLeaf || (metadata as any).expanded)) {
      if (event.ctrlKey) {
        nextSelection = prevSelection.filter(node => trackNodeBy(node as any) !== nodeKey)
      } else if (event.shiftKey) {
      } else {
        if (prevSelection.length === 1) {
          nextSelection = []
        } else {
          nextSelection = [node]
        }
      }
    } else {
      if (event.ctrlKey) {
        nextSelection = [...prevSelection, node]
      } else if (event.shiftKey) {
        if (prevSelection.length === 0) {
          nextSelection = [node]
        } else {
          const parentNodeKey = this.trackNodeParentBy(node, isLeaf)
          const parentNode = parentNodeKey && this.branchNodeMap.get(parentNodeKey)
          const parentChildren = parentNode ? parentNode.children! : this.rootTreeNodes
          const prevSelectionFirstNodeKey = this.trackNodeIsLeafBy(prevSelection[0]) ? this.trackLeafBy(prevSelection[0] as any) : this.trackBranchBy(prevSelection[0] as any)
          const prevIndex = parentChildren.findIndex(node => node.key === prevSelectionFirstNodeKey)
          const nextIndex = parentChildren.findIndex(node => node.key === nodeKey)
          const slice = (nextIndex > prevIndex) ? parentChildren.slice(prevIndex, nextIndex + 1) : parentChildren.slice(nextIndex, prevIndex + 1)

          nextSelection = slice.map(node => node.branch || node.leaf)
        }
      } else {
        nextSelection = [node]
      }
    }

    const selectedBranches = [] as TBranch[]
    const selectedLeafs = [] as TLeaf[]

    for (const node of nextSelection) {
      if (this.trackNodeIsLeafBy(node)) {
        selectedLeafs.push(node)
      } else {
        selectedBranches.push(node)
      }
    }

    this.selectedBranchesChange.emit(selectedBranches)
    this.selectedLeafsChange.emit(selectedLeafs)
  }

  getNodeMetadata(node: TBranch | TLeaf) {
    if (this.trackNodeIsLeafBy(node)) {
      return this.leafMetadata.get(this.trackLeafBy(node))
    } else {
      return this.branchMetadata.get(this.trackBranchBy(node))
    }
  }

  getDropListId(key: any) {
    return `nodelist-${key}`
  }

  getConnectedDropListIds(key: any) {
    return [...this.branchMap.keys()]
      .filter(otherKey => otherKey !== key)
      .map(otherKey => this.getDropListId(otherKey))
  }

  getNodePath(node: TBranch | TLeaf) {
    const getNodePath = (baseNode: TBranch | TLeaf, isLeaf: boolean, path: TBranch[]): TBranch[] => {
      const parentKey = this.trackNodeParentBy(baseNode, isLeaf)

      if (parentKey) {
        const parent = this.branchMap.get(parentKey)

        return getNodePath(parent, false, [parent, ...path])
      } else {
        return path
      }
    }

    return getNodePath(node, this.trackNodeIsLeafBy(node), [])
  }

  nodePathToString(path: (TBranch | TLeaf)[], extractNodeName: ((node: TBranch | TLeaf, isLeaf: boolean) => string) | string) {
    if (typeof extractNodeName !== 'function') {
      const extractNodeNameKey = extractNodeName

      extractNodeName = node => node[extractNodeNameKey]
    }

    return path.reduce((p, n) => `${p}${(extractNodeName as any)(n)}/`, '/')
  }

  isNodeInPath(nodeToFind: TBranch | TLeaf, path: (TBranch | TLeaf)[]) {
    const nodeKeyToFind = this.trackNodeIsLeafBy(nodeToFind) ? this.trackLeafBy(nodeToFind) : this.trackBranchBy(nodeToFind)

    for (const node of path) {
      const nodeKey = this.trackNodeIsLeafBy(node) ? this.trackLeafBy(node) : this.trackBranchBy(node)

      if (nodeKey === nodeKeyToFind) {
        return true
      }
    }

    return false
  }

  isNodeInPathOf(nodeToFind: TBranch | TLeaf, node: TBranch | TLeaf) {
    return this.isNodeInPath(nodeToFind, [...this.getNodePath(node), node])
  }

  onNodeDropped(event: CdkDragDrop<undefined>) {
    const draggedNode = this.flatTreeNodes[event.previousIndex]
    const targetNode = this.flatTreeNodes[event.currentIndex]

    if (this.isNodeInPathOf(draggedNode.branch || draggedNode.leaf, targetNode.branch || targetNode.leaf)) {
      return
    }

    this.nodeMove.emit({
      node: draggedNode.branch || draggedNode.leaf,
      nodeIsLeaf: !!draggedNode.leaf,
      prevParent: draggedNode.parent && draggedNode.parent.branch,
      nextParent: targetNode.parent && targetNode.parent.branch,
      prevIndex: (draggedNode.parent ? draggedNode.parent.children : this.rootTreeNodes).indexOf(draggedNode),
      nextIndex: (targetNode.parent ? targetNode.parent.children : this.rootTreeNodes).indexOf(targetNode),
    })
  }

  dragging = false

  onNodeDragStarted(event: any) {
    this.dragging = true
    this.changeDetectorRef.detectChanges()
  }

  onNodeDragEnded(event: any) {
    this.dragging = false
    this.changeDetectorRef.detectChanges()
  }
}
