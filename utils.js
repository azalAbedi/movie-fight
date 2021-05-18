// This 'debounce' function is a refactor to make the debouncer more re-useable
const debounce = (func, delay = 1000) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
                // This magic piece of code will always reset the setTimeout as a user keeps pressing their keys on the search input!
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args); // .apply() takes the array of arguments from the return above and places them as separate arguments here!
        }, delay);
    };
};