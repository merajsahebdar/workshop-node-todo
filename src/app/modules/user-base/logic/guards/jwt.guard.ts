import { JwtStrategy } from '../strategies/jwt.strategy';
import { BaseGuard } from './base.guard';

/**
 * JWT Guard
 */
export class JwtGuard extends BaseGuard(JwtStrategy) {}
