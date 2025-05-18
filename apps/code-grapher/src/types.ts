export type BaseNode = {
  id: string;
  type: string;
  name?: string;
};

export type ScopeType = 'module' | 'function';

export type ModuleNode = BaseNode & {
  type: 'module';
  name: string;
  path?: string;
  declarations: string[];
};

export type ConstantNode = BaseNode & {
  type: 'constant';
  /** The name of the constant. Can be undefined if the constant is not named (e.g. the return value which isn't assigned to a variable before returned). */
  name?: string;
  scope?: string;
  scope_type?: ScopeType;
  dependencies?: string[];
};

export type FunctionNode = BaseNode & {
  type: 'function';
  name?: string;
  scope?: string;
  scope_type?: ScopeType;
  params: string[];
  calls: FunctionCall[];
  returns: string[];
};

export type FunctionCall = {
  /** The id of the called function. */
  fn: string;
  /** Arguments passed to the function. */
  args: string[];
  /** The id of the variable that receives the return value. */
  assigns: string[];
};

export type Node = ConstantNode | FunctionNode
