/** 
 * transforms given data into a proper sql form depending on the mode
 * @param query - Object with the data keys and values
 * @param {boolean} mode - Sets the output query depending on whether it is true or false/undefined, if true then it adjusts the query for updating, else it adjusts the query for search
 */
export const queryParser = <T>(query: T, mode?: boolean) => {
    if (Object.keys(query).length === 0) {
        return null
    }
    let vals: string[] = []
    Object.entries(query).forEach((entry, i) => {
        const [key, value] = entry
        if (value !== undefined)
            if (typeof value === 'string')
                vals.push(`${key} = '${value}'`)
            else
                vals.push(`${key} = ${value}`)
    })
    // if mode is falsy, then it is in the default search mode
    if (!mode)
        return vals.join(' AND ')
    // if mode is truthy, then it is in the update mode
    return vals.join(', ')
}