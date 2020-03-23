export interface Location {
    postCode: string;
    // In the US, this is the city.
    settlement: string;
    // In the US, this is the state.
    region: string;
    country: string;
}

export interface Affiliation {
    labratory: string;
    institution: string;
    // TODO: Fill this out, once I know it's shape.
    location: {};
}

export interface Author {
    first: string;
    middle: string[];
    last: string;
    suffix: string;
    affiliation: Affiliation;
}

export interface CitationSpan {
    start: number;
    end: number;
    text: string;
    ref_id: string;
}

export interface TextWithCitations {
    text: string;
    cite_spans: CitationSpan[];
    ref_spans: CitationSpan[];
    section: string;
}

export interface PaperMetadata {
    title: string;
    authors: Author[];
    journal: string;
}

export interface Paper {
    paper_id: string;
    metadata: PaperMetadata;
    abstract: TextWithCitations[];
    body_text: TextWithCitations[];
    collection: string;
}
