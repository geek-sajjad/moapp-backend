/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

/**
 * Extracts properties from the provided model class.
 *
 * Iterates over the fields of the model class and generates a Swagger-compatible schema.
 *
 * @param Model - The DTO class to extract fields from.
 * @returns A schema object with the fields as properties.
 */
function extractModelProperties<T>(Model?: Type<T>): Record<string, any> {
  if (!Model) {
    return {};
  }

  const instance = new Model(); // Create an instance of the class
  const properties: Record<string, any> = {};

  for (const key of Object.keys(instance)) {
    properties[key] = {
      type: typeof instance[key], // Infer the type from the instance
      default: instance[key], // Use the default value
    };
  }

  return properties;
}

/**
 * Decorator for handling file uploads and generating Swagger documentation.
 *
 * - Extracts all fields from the provided DTO (model).
 * - Lists these fields along with the file input in the Swagger schema.
 *
 * @param model - The DTO class to extract fields from.
 */
export function FileUploadDecorator<T>(model?: Type<T>) {
  const schema = {
    type: 'object',
    properties: {
      ...extractModelProperties(model), // Extract properties from the provided model
      file: {
        type: 'string',
        format: 'binary', // Add file input
      },
    },
  };

  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({ schema }),
  );
}
