import ts from 'typescript';
import { Node } from './types.js';
export declare function loadTSProgram(entryPath: string): {
    program: ts.Program;
    checker: ts.TypeChecker;
};
export declare function analyze(entryPath: string): {
    entryPoints: string[];
    modules: {};
    nodes: Record<string, Node>;
};
