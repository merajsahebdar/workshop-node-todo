import { Module, Provider } from '@nestjs/common';
import {
  CookieService,
  DatabaseService,
  HashService,
  JwtService,
  SignedParamsService,
} from './services';
import { IsUniqueValidatorConstraint } from './validators';

// Services
const services: Provider[] = [
  DatabaseService,
  JwtService,
  HashService,
  CookieService,
  SignedParamsService,
  IsUniqueValidatorConstraint,
];

/**
 * Common Module
 */
@Module({
  providers: [
    // Services
    ...services,
  ],
  exports: [
    // Services
    ...services,
  ],
})
export class CommonModule {}
