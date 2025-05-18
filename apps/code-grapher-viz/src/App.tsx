import Dagre from "@dagrejs/dagre";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import type { ConstantNode, FunctionNode } from "./types";

const initialNodes: Array<Node> = [];
const initialEdges: Array<Edge> = [];

const getLayoutedElements = (
  nodes: Array<Node>,
  edges: Array<Edge>,
  options: { direction: string },
) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const LayoutFlow = () => {
  const [dataJson, setDataJson] = React.useState("");
  const data = useMemo(() => {
    console.log("update data");
    try {
      return JSON.parse(dataJson);
    } catch (e) {
      return e;
    }
  }, [dataJson]);

  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    try {
      console.log("convertToReactFlow");
      const { nodes, edges } = convertToReactFlow(data);
      setNodes(nodes);
      setEdges(edges);
    } catch (e) {}
  }, [data]);

  const onLayout = useCallback(
    (direction: string) => {
      console.log(nodes);
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      fitView();
    },
    [nodes, edges],
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div style={{ width: "100%", height: "90%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Panel position="top-right">
            <button onClick={() => onLayout("TB")}>vertical layout</button>
            <button onClick={() => onLayout("LR")}>horizontal layout</button>
          </Panel>
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      <div style={{ width: "100%", height: "10%" }}>
        <textarea
          placeholder="Paste your JSON here..."
          value={dataJson}
          onChange={(e) => {
            setDataJson(e.target.value);
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default function () {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}

export function convertToReactFlow(data: {
  entryPoints: Array<string>;
  modules: Record<string, any>;
  nodes: Record<string, any>;
}): { nodes: Node[]; edges: Edge[] } {
  const nodeMap = new Map<string, Node>();
  function createNode(dataNode: ConstantNode | FunctionNode): Node {
    if (nodeMap.has(dataNode.id)) {
      return nodeMap.get(dataNode.id)!;
    }

    const n: Node = {
      id: dataNode.id,
      data: {
        label: `${dataNode.type === "function" ? "ƒ " : ""}${dataNode.name}`,
      },
      position: { x: 0, y: 0 },
      type: "default",
    };

    nodeMap.set(dataNode.id, n);
    return n;
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function run(node: ConstantNode | FunctionNode) {
    console.log("rrrrr");
    if (node.type === "constant") {
      nodes.push(createNode(node));
    } else if (node.type === "function") {
      nodes.push(createNode(node));

      for (const call of node.calls) {
        const calledFnId = call.fn;
        const calledFn = data.nodes[calledFnId];
        if (calledFn) {
          run(calledFn);
          edges.push({
            id: `call-${node.id}-${calledFnId}`,
            source: node.id,
            target: calledFnId,
            label: "calls",
            type: "default",
          });
        } else {
          debugger;
        }
      }
    }
  }

  data.entryPoints.forEach((entryPoint) => {
    console.log("entryPoint", entryPoint);
    const entryPointNode = data.nodes[entryPoint];
    if (entryPointNode) {
      run(entryPointNode);
    }
  });

  console.log({ nodes, edges });
  return { nodes, edges };
}
