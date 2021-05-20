import * as React from 'react';
import { ResponseModel } from '../../services/models';
import styled from '../../styled-components';
import { ResponseView } from './Response';

const ResponsesHeader = styled.h3`
color: #58585B;
font-weight: bold;
background: transparent;
font-size:14px;
margin: 10% 0% 0% 0%;
`;

export interface ResponseListProps {
  responses: ResponseModel[];
  isCallback?: boolean;
}

export class ResponsesList extends React.PureComponent<ResponseListProps> {
  render() {
    const { responses, isCallback } = this.props;

    if (!responses || responses.length === 0) {
      return null;
    }

    return (
      <div>
        <ResponsesHeader>{isCallback ? 'Callback responses' : 'Responses'}</ResponsesHeader>
        {responses.map(response => {
          return <ResponseView key={response.code} response={response} />;
        })}
      </div>
    );
  }
}
