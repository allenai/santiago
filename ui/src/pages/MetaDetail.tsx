import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { Tabs } from '@allenai/varnish/components'
import { Icon } from 'antd';
import ReactJson from 'react-json-view'

import { Container, Gap, MetadataDetails, MetadataSummary, LoadingIndicator } from '../components';
import * as magellan from '../magellan';

interface MetadataEntryIdRouteParams {
    id: string;
}

const MetaDetail = (props: RouteComponentProps) => {
    const params = props.match.params as MetadataEntryIdRouteParams;
    const [meta, setMeta] = React.useState<magellan.MetadataEntry | undefined>();
    React.useEffect(() => {
        magellan.getMetaById(params.id).then(setMeta);
    }, [params.id]);

    return (
        <Container>
            {!meta ? (
                <LoadingIndicator />
            ) : (
                <>
                    <Gap position="below" size="lg">
                        <MetadataSummary meta={meta} disableLink />
                    </Gap>
                    <Tabs defaultActiveKey="details">
                        <Tabs.TabPane tab="Details" key="details">
                            <MetadataDetails meta={meta} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="JSON" key="json">
                            <Gap position="below" size="md">
                                <TextRight>
                                    <a href={`/api/meta/${meta.id}?download`}>
                                        <Icon type="download" />{" "}
                                        Download JSON
                                    </a>
                                </TextRight>
                            </Gap>
                            <ReactJson name={false} src={meta} />
                        </Tabs.TabPane>
                    </Tabs>
                </>
            )}
        </Container>
    );
};

const TextRight = styled.div`
    text-align: right;
`;

export default MetaDetail;
