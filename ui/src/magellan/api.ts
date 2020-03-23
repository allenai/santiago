import { Query } from './Query';
import { Paper } from './models';

// Note: there's a number of additional fields that aren't modeled.
interface EsDoc<T> {
    _id: string;
    _source: T;
}

// Note: there's a number of additional fields that aren't modeled.
interface EsSearchResponse<T> {
    took: number;
    hits: {
        total: {
            value: number;
            relation: string;
        };
        hits: EsDoc<T>[];
    };
}

export interface SearchResults<T> {
    items: T[];
    total_results: number;
    took_ms: number;
    query: Query;
}

export async function searchForPapers(query: Query): Promise<SearchResults<Paper>> {
    const resp = await fetch(`/api/paper/search?${query.toQueryString()}`);
    const data: EsSearchResponse<Paper> = await resp.json();
    // We change the shape of the data a bit as to not couple things too tightly to
    // Elasticsearch
    return {
        items: data.hits.hits.map(d => d._source),
        total_results: data.hits.total.value,
        took_ms: data.took,
        query: query
    };
}

class NoPaperFoundError extends Error {
    constructor(paper_id: string) {
        super(`No paper found with id: ${paper_id}`);
    }
}

export async function getPaperById(id: string): Promise<Paper> {
    const resp = await fetch(`/api/paper/${id}`);
    if (resp.status === 404) {
        throw new NoPaperFoundError(id);
    }
    const doc: EsDoc<Paper> = await resp.json();
    return doc._source;
}
