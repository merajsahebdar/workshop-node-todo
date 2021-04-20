import { ICommand } from '@nestjs/cqrs';

/**
 * Create Casbin Policies Command
 */
export class CreateCasbinPoliciesCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {string} ptype
   * @param {string[][]} policies
   */
  constructor(
    public readonly ptype: string,
    public readonly policies: string[][],
  ) {}
}
