const inputValidation = (input, regex) => {
    return input.match(regex) !== null
}


export {
    inputValidation
};