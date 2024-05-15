export function registerCustomHandlebarHelpers() {
    Handlebars.registerHelper('includes', function (object, value) {
        if (Array.isArray(object)) return object.includes(value);
        else if (object instanceof Map) return object.has(value);
        else if (typeof object === 'object') return value in object;
        else return false;
    });

    Handlebars.registerHelper('stringify', function (object) {
        return JSON.stringify(object, null, '  ');
    });

    Handlebars.registerHelper('add', function (...numbers) {
        return numbers.reduce((accumulator, current) => {
            if (Number.isNumeric(current)) accumulator += Number(current);

            return accumulator;
        }, 0);
    });
}
