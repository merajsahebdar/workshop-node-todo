import { Module, Provider } from '@nestjs/common';
import {
  CookieService,
  HashService,
  JwtService,
  SignedParamsService,
} from './services';

// Services
const services: Provider[] = [
  JwtService,
  HashService,
  CookieService,
  SignedParamsService,
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
