export function registerCustomHandlebarHelpers() {
    Handlebars.registerHelper('includes', function (object, value) {
        if (Array.isArray(object)) return object.includes(value);
        else if (object instanceof Map) return object.has(value);
        else if (typeof object === 'object') return value in object;
        else return false;
    });

    Handlebars.registerHelper('stringify', function (object) {
        return JSON.stringify(object);
    });
}
