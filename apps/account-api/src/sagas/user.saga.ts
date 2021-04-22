import { CreateCasbinPoliciesCommand } from '@app/auth';
import { Injectable } from '@nestjs/common';
import { ICommand, IEvent, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SendEmailVerificationMessageCommand } from '../commands';
import { RefreshTokenCreatedEvent, UserSignedUpEvent } from '../events';

/**
 * User Saga
 */
@Injectable()
export class UserSaga {
  /**
   * Create casbin policies belongs to the newly signed refresh token.
   *
   * @param {Observable<IEvent>} events$
   * @returns
   */
  @Saga()
  createRefreshTokenCasbinPolicies(
    events$: Observable<IEvent>,
  ): Observable<ICommand> {
    return events$.pipe(
      ofType(RefreshTokenCreatedEvent),
      map((event) => {
        return new CreateCasbinPoliciesCommand('p', [
          [
            `user:${event.user.id}`,
            `refresh_tokens:${event.refreshToken.id}`,
            '*',
          ],
        ]);
      }),
    );
  }

  /**
   * Send the verification email when a new user registered successfully.
   *
   * @param {Observable<IEvent>} events$
   * @returns
   */
  @Saga()
  sendEmailVerificationMessage(
    events$: Observable<IEvent>,
  ): Observable<ICommand> {
    return events$.pipe(
      ofType(UserSignedUpEvent),
      map((event) => {
        return new SendEmailVerificationMessageCommand(
          event.user,
          event.email,
          event.account,
        );
      }),
    );
  }

  /**
   * Create casbin policies belongs to the newly registered user.
   *
   * @param {Observable<IEvent>} events$
   * @returns
   */
  @Saga()
  createRegisteredUserCasbinPolicies(
    events$: Observable<IEvent>,
  ): Observable<ICommand> {
    return events$.pipe(
      ofType(UserSignedUpEvent),
      map((event) => {
        return new CreateCasbinPoliciesCommand('p', [
          // Registered user has all accesses to his own resource.
          [`user:${event.user.id}`, `users:${event.user.id}`, '*'],
          [`user:${event.user.id}`, `emails:${event.email.id}`, '*'],
          [`user:${event.user.id}`, `accounts:${event.account.id}`, '*'],
        ]);
      }),
    );
  }

  // TODO: Register refresh token on sign-in event.
  // SEE: https://github.com/nestjs/cqrs/pull/549
  // @Saga()
  // registerRefreshTokenCookie(
  //   events$: Observable<IEvent>,
  // ): Observable<ICommand> {
  //   return events$.pipe(
  //     ofType(UserSignedInEvent),
  //     map((event) => {
  //       return new RefreshTokenRegistererCommand(event.user);
  //     }),
  //   );
  // }
}
