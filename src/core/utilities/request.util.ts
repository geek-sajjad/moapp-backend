/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RequestUtil {
  constructor(private readonly httpService: HttpService) {}

  async post<T>(
    url: string,
    body: any,
    headers: any,
    errorMessage?: string,
  ): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<T>(url, body, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error(`Request failed for url:${url}`, error.message);

      throw new HttpException(
        errorMessage ?? 'message.ERRORS.REQUEST_FAILED',
        400,
      );
    }
  }
}
