/*
    This was inspired by the PF2e system
*/

export class Predicate extends Array {
    constructor(statements, rollOptions) {
        super();
        this.statements = statements;
        this.rollOptions = rollOptions;
    }

    get comparitors() {
        return ['eq', 'ne', 'lt', 'lte', 'gt', 'gte', 'not'];
    }

    validate() {
        return this.statements.every((statement) => this.validateStatement(statement));
    }

    validateStatement(statement) {
        if (typeof statement === 'string') {
            return this.rollOptions.includes(statement);
        } else if (typeof statement === 'object') {
            if (Object.keys(statement).length > 1) return false;

            if ('or' in statement) {
                return this.validateOrStatement(statement['or']);
            } else if ('and' in statement) {
                return this.validateAndStatement(statement['and']);
            } else if (this.comparitors.includes(Object.keys(statement)[0])) {
                return this.validateComparitors(statement);
            }
        }
        return false;
    }

    validateOrStatement(statements) {
        if (Array.isArray(statements)) {
            return statements.some((statement) => this.validateStatement(statement));
        }
        return false;
    }

    validateAndStatement(statements) {
        if (Array.isArray(statements)) {
            return statements.every((statement) => this.validateStatement(statement));
        }
        return false;
    }

    validateNotStatement(statements) {
        if (Array.isArray(statements)) {
            return statements.includes;
        }
    }

    validateComparitors(statements) {
        const [key, value] = Object.entries(statements)[0];
        const rollOptionPrefix = value[0];
        const testValue = value[1];
        const rollOption = this.rollOptions.find((option) => {
            const regex = new RegExp(`${rollOptionPrefix}:\\d+`);
            return regex.test(option);
        });
        if (!rollOption && key !== 'not') return false;

        const rollOptionValue = rollOption?.split(`${rollOptionPrefix}:`)[1];
        const isNumeric = Number.isNumeric(testValue);
        if (key === 'eq') return rollOptionValue === testValue;
        else if (key === 'ne') return rollOptionValue !== testValue;
        else if (key === 'lt' && isNumeric) return rollOptionValue < testValue;
        else if (key === 'lte' && isNumeric) return rollOptionValue <= testValue;
        else if (key === 'gt' && isNumeric) return rollOptionValue > testValue;
        else if (key === 'gte' && isNumeric) return rollOptionValue >= testValue;
        else if (key === 'not') {
            return !this.rollOptions.includes(`${rollOptionPrefix}:${testValue}`);
        } else return false;
    }
}
