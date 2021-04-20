import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCasbinPoliciesCommand } from '../commands/create-casbin-policies.command';
import { CasbinPoliciesService } from '../services/casbin-policies.service';

/**
 * Create Casbin Policies Command Handler
 */
@CommandHandler(CreateCasbinPoliciesCommand)
export class CreateCasbinPoliciesCommandHandler
  implements ICommandHandler<CreateCasbinPoliciesCommand> {
  /**
   * Constructor
   *
   * @param {CasbinPoliciesService} casbinPoliciesService
   */
  constructor(private casbinPoliciesService: CasbinPoliciesService) {}

  /**
   * Execute
   *
   * @param {CreateCasbinPoliciesCommand} command
   * @returns
   */
  async execute(command: CreateCasbinPoliciesCommand): Promise<void> {
    await this.casbinPoliciesService.createPolicies(
      command.ptype,
      command.policies,
    );
  }
}
