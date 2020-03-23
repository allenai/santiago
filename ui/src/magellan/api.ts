import { Query } from './Query';
import { Paper } from './models';

// Note: there's a number of additional fields that aren't modeled.
interface SearchResult<T> {
    _id: string;
    _source: T;
}

// Note: there's a number of additional fields that aren't modeled.
interface SearchResponse<T> {
    took: number;
    hits: {
        total: {
            value: number;
            relation: string
        };
        hits: SearchResult<T>[];
    };
}

export interface SearchResults<T> {
    items: T[];
    total_results: number;
    took_ms: number;
    query: Query;
}

export async function searchForPapers(query: Query): Promise<SearchResults<Paper>> {
    const resp = await fetch(`/api/papers/search?${query.toQueryString()}`);
    const data: SearchResponse<Paper> = await resp.json();
    // We change the shape of the data a bit as to not couple things too tightly to
    // Elasticsearch
    return {
        items: data.hits.hits.map(d => d._source),
        total_results: data.hits.total.value,
        took_ms: data.took,
        query: query
    };
}
