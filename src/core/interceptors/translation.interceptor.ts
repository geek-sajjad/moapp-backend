import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TranslationInterceptor implements NestInterceptor {
  constructor(private readonly i18n: I18nService<unknown>) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map(async (response) => {
        if (response && response.messageKey) {
          const message = await this.i18n.translate(
            response.messageKey as never,
            {
              lang: request.i18nLang,
            },
          );
          return {
            meta: response.meta,
            data: response.data,
            message,
          };
        }
        return response;
      }),
    );
  }
}
