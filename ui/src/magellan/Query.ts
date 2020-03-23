import qs from 'querystring';
import { Location } from 'history';

export class Query {
    constructor(readonly q: string) {}

    equals(query: Query): boolean {
        return this.toQueryString() === query.toQueryString();
    }

    toQueryString() {
        return qs.stringify(this);
    }

    static fromLocation(loc: Location): Query {
        const query = qs.parse(loc.search.replace(/^[?]{1}/, ''));
        const q = first(query.q, '');
        return new Query(q);
    }
}

function first<T>(maybeArr: T[] | T | undefined, defaultValue: T): T {
    if (maybeArr === undefined) {
        return defaultValue;
    }
    if (Array.isArray(maybeArr)) {
        const firstValue = maybeArr.shift();
        if (firstValue !== undefined) {
            return firstValue;
        }
        return defaultValue;
    }
    return maybeArr;
}
