/* eslint-disable camelcase */

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
    location: Location;
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

export interface MetadataEntry {
    id: string;
    cord_uid: string;
    paper_ids: string[];
    source_x: string;
    title: string;
    doi: string;
    pmcid: string;
    pubmed_id: string;
    license: string;
    abstract: string;
    publish_time: string;
    authors: string[];
    journal: string;
    msft_academic_paper_id: string;
    who_covidence_number: string;
    has_pdf_parse: boolean;
    has_pmc_xml_parse: boolean;
    full_text_file: string;
    url: string;
}
