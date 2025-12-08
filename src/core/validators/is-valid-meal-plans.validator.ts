import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidMealPlans', async: false })
export class IsValidMealPlansConstraint
  implements ValidatorConstraintInterface
{
  validate(mealPlans: Record<string, unknown[]>, args: ValidationArguments) {
    if (
      !mealPlans ||
      typeof mealPlans !== 'object' ||
      Array.isArray(mealPlans)
    ) {
      return false;
    }

    const keys = Object.keys(mealPlans);

    // Check if all keys are valid date strings (YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const allKeysValid = keys.every((key) => {
      // First check format
      if (!dateRegex.test(key)) {
        return false;
      }

      // Parse date components
      const [yearStr, monthStr, dayStr] = key.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);

      // Validate year, month, and day ranges
      if (
        isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        year < 1900 ||
        year > 2100 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
      ) {
        return false;
      }

      // Validate that it's a valid calendar date
      // Using UTC to avoid timezone issues
      const date = new Date(Date.UTC(year, month - 1, day));
      if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
      ) {
        return false;
      }

      // Additional validation: ensure the date string format is preserved
      // This catches invalid dates like 2024-02-30 which would roll over
      const reconstructedDate = `${year.toString().padStart(4, '0')}-${month
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      return reconstructedDate === key;
    });
    if (!allKeysValid) {
      return false;
    }

    // Check if all values are arrays
    const allValuesArrays = Object.values(mealPlans).every((value) =>
      Array.isArray(value),
    );
    if (!allValuesArrays) {
      return false;
    }

    // Check if each array contains valid objects with mealId and mealCategoryId
    const allItemsValid = Object.values(mealPlans).every((dayMeals) =>
      dayMeals.every(
        (meal) =>
          meal &&
          typeof meal === 'object' &&
          'mealId' in meal &&
          'mealCategoryId' in meal &&
          typeof meal.mealId === 'string' &&
          typeof meal.mealCategoryId === 'string',
      ),
    );

    return allItemsValid;
  }

  defaultMessage(args: ValidationArguments) {
    return 'mealPlans must be a valid object with date strings (YYYY-MM-DD) as keys and arrays of meal items as values';
  }
}

export function IsValidMealPlans(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidMealPlansConstraint,
    });
  };
}
