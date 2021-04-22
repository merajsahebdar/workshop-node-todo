import { Repository } from 'typeorm';
import { EmailEntity } from '../entities';

/**
 * Emails Repository
 */
export type EmailsRepository = Repository<EmailEntity>;
