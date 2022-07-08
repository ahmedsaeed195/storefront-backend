/** 
 * ensures that the id is always a number
 * @param {number | string} id - the id which needs to be checked and parsed back as a number
 */
export const idParser = (id: number | string): number => {
    return (id as unknown) as number
}

