import { Module } from '@nestjs/common';
import {
  createParseUUIDPipe,
  createParseUUIDArrayPipe,
} from '../factories/pipes.factory';

@Module({
  providers: [
    {
      provide: 'UUID_PIPE',
      useFactory: createParseUUIDPipe,
    },
    {
      provide: 'UUID_ARRAY_PIPE',
      useFactory: createParseUUIDArrayPipe,
    },
  ],
  exports: ['UUID_PIPE', 'UUID_ARRAY_PIPE'],
})
export class PipesModule {}
