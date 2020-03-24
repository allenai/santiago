import qs from 'querystring';
import { Location } from 'history';

export class Query {
    constructor(
        // The query text
        readonly q: string,
        // The query offset
        readonly o: number = Query.defaults.OFFSET,
        // The number of results to display
        readonly sz: number = Query.defaults.PAGE_SIZE
    ) {}

    equals(query: Query): boolean {
        return this.toQueryString() === query.toQueryString();
    }

    toQueryString() {
        return qs.stringify(this);
    }

    static fromLocation(loc: Location): Query {
        const query = qs.parse(loc.search.replace(/^[?]{1}/, ''));
        const q = first(query.q, '');
        const o = parseInt(first(query.o, '0'));
        const sz = parseInt(first(query.sz, '10'));
        return new Query(q, o, sz);
    }

    static defaults = {
        PAGE_SIZE: 10,
        OFFSET: 0
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
