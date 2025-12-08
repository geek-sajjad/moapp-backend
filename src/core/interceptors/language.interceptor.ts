import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Language as LanguageEnum } from '../enums';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    let lang =
      'lang' in request.headers ? request.headers.lang : LanguageEnum.ENGLISH;

    if (!Object.values(LanguageEnum).includes(lang as LanguageEnum)) {
      lang = LanguageEnum.ENGLISH;
    }

    request.lang = lang;
    return next.handle();
  }
}
