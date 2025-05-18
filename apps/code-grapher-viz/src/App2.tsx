import React, { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Edge,
  type Node,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import useAutoLayout from "./useAutoLayout";
import type { ConstantNode, FunctionNode } from "./types";

const initialNodes: Array<Node> = [];
const initialEdges: Array<Edge> = [];

function App() {
  const { fitView, addNodes } = useReactFlow();

  const [dataJson, setDataJson] = React.useState("");
  const data = useMemo(() => {
    console.log('update data')
    try {
      return JSON.parse(dataJson);
    } catch (e) {
      return e;
    }
  }, [dataJson]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    try {
      console.log('convertToReactFlow')
      const { nodes, edges } = convertToReactFlow(data);
      setNodes(nodes);
      setEdges(edges);
    } catch (e) {}
  }, [data]);

  useAutoLayout({ algorithm: "dagre", direction: "TB", spacing: [50, 50] });

  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   [setEdges],
  // );

  useEffect(() => {
    fitView();
  }, [nodes, fitView]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div style={{ width: "100%", height: "90%" }}>
        {(() => {
          if (data instanceof Error) {
            return <div>{data.message}</div>;
          }

          return (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              // onConnect={onConnect}
              nodesDraggable={false}
            >
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          );
        })()}
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
}

const ReactFlowWrapper = () => {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
};

export default ReactFlowWrapper;

export function convertToReactFlow(data: {
  entryPoints: Array<string>;
  modules: Record<string, any>;
  declarations: Record<string, any>;
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
    }

    nodeMap.set(dataNode.id, n);
    return n;
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function run(node: ConstantNode | FunctionNode) {
    console.log('rrrrr');
    if (node.type === "constant") {
      nodes.push(createNode(node));
    } else if (node.type === "function") {
      nodes.push(createNode(node));

      for (const call of node.calls) {
        const calledFnId = call.fn;
        const calledFn = data.declarations[calledFnId];
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
          debugger
        }
      }
    }
  }

  data.entryPoints.forEach((entryPoint) => {
    console.log('entryPoint', entryPoint);
    const entryPointNode = data.declarations[entryPoint];
    if (entryPointNode) {
      run(entryPointNode);
    }
  });

  console.log({ nodes, edges });
  return { nodes, edges };
}



