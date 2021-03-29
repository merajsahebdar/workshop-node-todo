import { Injectable } from '@nestjs/common';
import { ICommand, IEvent, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SendUserVerificationEmailCommand } from '../commands/send-user-verification-email.command';
import { UserSignedUpEvent } from '../events/user-signed-up.event';

/**
 * User Saga
 */
@Injectable()
export class UserSaga {
  /**
   * Send the verification email when a new user registered successfully.
   *
   * @param {Observable<IEvent>} events$
   * @returns
   */
  @Saga()
  sendVerificationEmail(events$: Observable<IEvent>): Observable<ICommand> {
    return events$.pipe(
      ofType(UserSignedUpEvent),
      map((event) => {
        return new SendUserVerificationEmailCommand(event.user);
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
