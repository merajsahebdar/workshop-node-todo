import { Module, Provider } from '@nestjs/common';
import {
  CookieService,
  HashService,
  JwtService,
  SignedParamsService,
} from './services';
import { IsUniqueConstraint } from './validators';

// Services
const services: Provider[] = [
  JwtService,
  HashService,
  CookieService,
  SignedParamsService,
  IsUniqueConstraint,
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
