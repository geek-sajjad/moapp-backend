import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { ResponseDto } from '../dtos/responses';

/**
 * Custom decorator to document API responses with a generic ResponseDto
 * @param model - The type of the data inside ResponseDto
 * @param description - The description of the response
 * @param status - The HTTP status code (default: 200)
 */
export function ApiResponseWithModel<T>(
  model: Type<T> | [Type<T>], // Supports single type or array type
  description: string,
  status = 200,
) {
  const isArray = Array.isArray(model); // Detect if the model is an array
  const modelType = isArray ? (model[0] as Type<T>) : (model as Type<T>); // Extract the type if array

  return applyDecorators(
    ApiExtraModels(ResponseDto, modelType), // Register models
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: isArray
                ? { type: 'array', items: { $ref: getSchemaPath(modelType) } }
                : { $ref: getSchemaPath(modelType) },
              meta: {
                type: 'object',
                properties: {
                  timestamp: {
                    type: 'number',
                    description: 'Timestamp of the response',
                    default: '1737733273126',
                  },
                  date: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Date of the response',
                    default: '2025-01-24 19:12:00',
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
}
