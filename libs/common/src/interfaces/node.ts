/**
 * Node Type Interface
 */
export interface INodeType {
  id: string;
  createdAt: string;
  updatedAt: string;
  removedAt?: string;
}

/**
 * Node Entity Interface
 */
export type INodeEntity = INodeType;
