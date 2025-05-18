import ts from 'typescript';
import path from 'node:path';
import { customAlphabet } from 'nanoid';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 8);
export function loadTSProgram(entryPath) {
    const entryAbs = path.resolve(entryPath);
    const entryDir = path.dirname(entryAbs);
    const configPath = ts.findConfigFile(entryDir, ts.sys.fileExists, 'tsconfig.json');
    if (!configPath)
        throw new Error('No tsconfig.json found');
    const configJson = ts.readConfigFile(configPath, ts.sys.readFile);
    if (configJson.error)
        throw new Error('Invalid tsconfig.json');
    const parsed = ts.parseJsonConfigFileContent(configJson.config, ts.sys, path.dirname(configPath));
    const fileNames = parsed.fileNames.includes(entryAbs)
        ? parsed.fileNames
        : [...parsed.fileNames, entryAbs];
    const program = ts.createProgram(fileNames, parsed.options);
    const checker = program.getTypeChecker();
    return { program, checker };
}
export function analyze(entryPath) {
    var _a;
    const { program, checker } = loadTSProgram(entryPath);
    const sourceFile = program.getSourceFile(entryPath);
    if (!sourceFile)
        throw new Error('Could not read source file...');
    /**
     * TODO: We need to self-implement this without using `checker.getFullyQualifiedName` to ensure that we can get the result we want.
     */
    function getFullyQualifiedName(inputSymbol) {
        var _a;
        const symbol = getOriginalSymbol(inputSymbol);
        const decl = (_a = symbol.getDeclarations()) === null || _a === void 0 ? void 0 : _a[0];
        if ((decl === null || decl === void 0 ? void 0 : decl.kind) === ts.SyntaxKind.Parameter) {
            const functionDecl = decl.parent;
            if (!ts.isFunctionDeclaration(functionDecl)) {
                // throw new Error('Not possible? Parent of parameter is not a function declaration. Ok possible. ts.isArrowFunction(functionDecl).');
                return decl.getText() + '-' + checker.getFullyQualifiedName(symbol);
            }
            const fnName = functionDecl.name;
            if (!fnName) {
                throw new Error('Functions with no name are not supported.');
            }
            const fn = checker.getSymbolAtLocation(fnName);
            if (!fn) {
                throw new Error('Could not find function symbol.');
            }
            return `${getFullyQualifiedName(fn)}.${symbol.name}`;
        }
        return checker.getFullyQualifiedName(symbol);
    }
    const symbolFullyQualifiedNameToNanoId = new Map();
    const symbolIdToNanoId = new Map();
    function getSymbolNanoId(symbol) {
        const s = getOriginalSymbol(symbol);
        // const sId = (s as any).id // HACKY!
        // if (symbolIdToNanoId.has(sId)) {
        //   return symbolIdToNanoId.get(sId)!;
        // }
        const symbolFullyQualifiedName = getFullyQualifiedName(symbol);
        if (symbolFullyQualifiedNameToNanoId.has(symbolFullyQualifiedName)) {
            const nanoId = symbolFullyQualifiedNameToNanoId.get(symbolFullyQualifiedName);
            // symbolIdToNanoId.set(sId, nanoId);
            return nanoId;
        }
        const name = s.name;
        const id = [name, nanoid()].filter(s => !!s).join('-');
        // symbolIdToNanoId.set(sId, id);
        symbolFullyQualifiedNameToNanoId.set(symbolFullyQualifiedName, id);
        return id;
    }
    /**
     * A symbol can be an alias for another symbol, for example, `symbol.getDeclarations()[0].kind` is `ImportSpecifier` (`276`). This function returns the original symbol.
     */
    function getOriginalSymbol(symbol) {
        try {
            return checker.getAliasedSymbol(symbol);
        }
        catch (_a) {
            // Possible "Error: Debug Failure. False expression: Should only get Alias here" if symbol is not an alias.
            return symbol;
        }
    }
    const nodes = {};
    const traversedSymbols = new WeakSet();
    function traverse(inputSymbol) {
        const symbol = getOriginalSymbol(inputSymbol);
        if (traversedSymbols.has(symbol))
            return;
        traversedSymbols.add(symbol);
        const id = getSymbolNanoId(symbol);
        const functionDeclaration = getFunctionDeclaration(symbol);
        if (functionDeclaration) {
            const params = functionDeclaration.parameters.flatMap(p => {
                const pn = p.name;
                if (ts.isObjectBindingPattern(pn) || ts.isArrayBindingElement(pn)) {
                    const ns = destructBindingPattern(pn);
                    return ns.map(n => {
                        const s = checker.getSymbolAtLocation(n);
                        if (!s) {
                            throw new Error('Could not find symbol for parameter.');
                        }
                        return getSymbolNanoId(s);
                    });
                }
                const s = checker.getSymbolAtLocation(pn);
                if (!s) {
                    throw new Error('Could not find symbol for parameter.');
                }
                return [getSymbolNanoId(s)];
            });
            const calls = (functionDeclaration.body ? findCallsInNode(functionDeclaration.body) : []).map(callExpr => {
                const calledFnSymbol = checker.getSymbolAtLocation(callExpr.expression);
                if (!calledFnSymbol) {
                    console.warn(`Could not find symbol for called function: ${callExpr.expression.getText()}`);
                    return null;
                }
                traverse(calledFnSymbol);
                return {
                    fn: getSymbolNanoId(calledFnSymbol),
                    args: [], // TODO
                    assigns: [], // TODO
                };
            }).filter((c) => !!c);
            const fnNode = {
                id,
                type: 'function',
                name: symbol.name,
                // scope: scopeId,
                // scope_type: 'module',
                params,
                calls,
                returns: [], // TODO
            };
            nodes[id] = fnNode;
            return;
        }
    }
    const sourceSymbol = checker.getSymbolAtLocation(sourceFile);
    const exports = sourceSymbol === null || sourceSymbol === void 0 ? void 0 : sourceSymbol.exports;
    const entryPoints = [];
    for (const [_exportName, exportSymbol] of (_a = exports === null || exports === void 0 ? void 0 : exports.entries()) !== null && _a !== void 0 ? _a : []) {
        // const fnId = ensureFunctionAnalyzed(exportSymbol);
        traverse(exportSymbol);
        entryPoints.push(getSymbolNanoId(exportSymbol));
    }
    return {
        entryPoints,
        modules: {
        // [moduleId]: moduleNode,
        },
        nodes,
    };
}
function getFunctionDeclaration(symbol) {
    var _a;
    const decls = (_a = symbol.getDeclarations()) !== null && _a !== void 0 ? _a : [];
    for (const decl of decls) {
        if (ts.isFunctionDeclaration(decl)) {
            return decl;
        }
    }
    return undefined;
}
function findCallsInNode(node) {
    const calls = [];
    function walk(n) {
        if (ts.isCallExpression(n))
            calls.push(n);
        ts.forEachChild(n, walk);
    }
    ts.forEachChild(node, walk);
    return calls;
}
function destructBindingPattern(bindingPattern) {
    return bindingPattern.elements.flatMap(e => {
        if (ts.isBindingElement(e)) {
            return e.name;
        }
        return e;
    });
}
// function ensureFunctionAnalyzed(inputSymbol: ts.Symbol): string | undefined {
//   const symbol = getOriginalSymbol(inputSymbol);
//   const symbolKey = checker.getFullyQualifiedName(symbol);
//   if (symbolFullyQualifiedNameToNanoId.has(symbolKey)) return symbolFullyQualifiedNameToNanoId.get(symbolKey);
//   const decls = symbol.getDeclarations() ?? [];
//   for (const decl of decls) {
//     if (ts.isFunctionDeclaration(decl)) {
//       analyzeFunction(decl, moduleId);
//       return symbolFullyQualifiedNameToNanoId.get(symbolKey);
//     }
//   }
//   return undefined;
// }
// function analyzeFunction(fnDecl: ts.FunctionDeclaration, scopeId: string) {
//   const fnName = fnDecl.name?.text ?? '<anonymous>';
//   const fnSymbol = fnDecl.name && checker.getSymbolAtLocation(fnDecl.name);
//   if (!fnSymbol) return;
//   const symbolKey = checker.getFullyQualifiedName(fnSymbol);
//   if (symbolFullyQualifiedNameToNanoId.has(symbolKey)) return;
//   const fnId = createId(fnName);
//   symbolFullyQualifiedNameToNanoId.set(symbolKey, fnId);
//   const params: string[] = [];
//   for (const param of fnDecl.parameters) {
//     if (ts.isIdentifier(param.name)) {
//       const paramId = createId(param.name.text);
//       variables[paramId] = {
//         id: paramId,
//         type: 'constant',
//         name: param.name.text,
//         scope: fnId,
//         scope_type: 'function',
//       };
//       params.push(paramId);
//     }
//   }
//   const fnNode: FunctionNode = {
//     id: fnId,
//     type: 'function',
//     name: fnName,
//     scope: scopeId,
//     scope_type: 'module',
//     params,
//     calls: [],
//     returns: [],
//   };
//   functions[fnId] = fnNode;
//   moduleNode.declarations.push(fnId);
//   if (!fnDecl.body) return;
//   const localVarMap = new Map<string, string>();
//   ts.forEachChild(fnDecl.body, function walk(node) {
//     if (ts.isVariableStatement(node)) {
//       for (const decl of node.declarationList.declarations) {
//         if (
//           ts.isIdentifier(decl.name) &&
//           decl.initializer &&
//           ts.isCallExpression(decl.initializer)
//         ) {
//           const varName = decl.name.text;
//           const varId = createId(varName);
//           localVarMap.set(varName, varId);
//           const callExpr = decl.initializer;
//           const calledSymbol = checker.getSymbolAtLocation(callExpr.expression);
//           if (!calledSymbol) continue;
//           const calledFnId = ensureFunctionAnalyzed(calledSymbol);
//           const argIds: string[] = [];
//           for (const arg of callExpr.arguments) {
//             if (ts.isIdentifier(arg)) {
//               const localId = localVarMap.get(arg.text);
//               if (localId) argIds.push(localId);
//             }
//           }
//           if (calledFnId) {
//             fnNode.calls.push({ fn: calledFnId, args: argIds, assigns: [varId] });
//             variables[varId] = {
//               id: varId,
//               type: 'constant',
//               name: varName,
//               scope: fnId,
//               scope_type: 'function',
//             };
//           }
//         }
//       }
//     }
//     if (ts.isReturnStatement(node)) {
//       const expr = node.expression;
//       if (expr && ts.isIdentifier(expr)) {
//         const returnVar = expr.text;
//         const varId = localVarMap.get(returnVar);
//         if (varId) {
//           const retId = createId();
//           fnNode.returns.push(retId);
//           variables[retId] = {
//             id: retId,
//             type: 'constant',
//             scope: fnId,
//             scope_type: 'function',
//             dependencies: [varId],
//           };
//         }
//       } else if (expr && ts.isCallExpression(expr)) {
//         const callExpr = expr;
//         const calledSymbol = checker.getSymbolAtLocation(callExpr.expression);
//         if (!calledSymbol) return;
//         const calledFnId = ensureFunctionAnalyzed(calledSymbol);
//         const argIds: string[] = [];
//         for (const arg of callExpr.arguments) {
//           if (ts.isIdentifier(arg)) {
//             const localId = localVarMap.get(arg.text);
//             if (localId) argIds.push(localId);
//           }
//         }
//         if (calledFnId) {
//           const retId = createId();
//           fnNode.calls.push({ fn: calledFnId, args: argIds, assigns: [retId] });
//           fnNode.returns.push(retId);
//           variables[retId] = {
//             id: retId,
//             type: 'constant',
//             scope: fnId,
//             scope_type: 'function',
//             dependencies: argIds,
//           };
//         }
//       }
//     }
//     ts.forEachChild(node, walk);
//   });
// }
//# sourceMappingURL=analyze.js.map