import { JwtStrategy } from '../strategies';
import { BaseGuard } from './base.guard';

/**
 * JWT Guard
 */
export class JwtGuard extends BaseGuard(JwtStrategy) {}
