
export default class Utils<T> {
 
/**
 * checks if last x elements in an array are equal
 * @param arr - array to check
 * @param x - number of elements from end to compare
 * @returns - true if last x elements of array (arr) are equal to each other
 */
public areLastXValuesEqual(arr: any[], x: number): boolean {
    if (arr.length < x) {
        return false;
    }

    const lastXValues = arr.slice(arr.length - x);

    // Check if all values in the lastXValues array are equal
    return lastXValues.every((value, index, array) => value === array[0]);
}
  
    // Add more generic functions as needed...
  }

