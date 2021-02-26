import * as React from 'react';
import styled from '../../styled-components';

import { SampleControls } from '../../common-elements';
import { CopyButtonWrapper } from '../../common-elements/CopyButtonWrapper';
import { PrismDiv } from '../../common-elements/PrismDiv';
import { jsonToHTML } from '../../utils/jsonToHtml';
import { OptionsContext } from '../OptionsProvider';
import { jsonStyles } from './style';

export interface JsonProps {
  data: any;
  className?: string;
  editable?: boolean;
  handleRequestBodyChange?: (string) => void;
}

const JsonViewerWrap = styled.div`
  &:hover > ${SampleControls} {
    opacity: 1;
  }
`;

const StatusCodeSpan = styled.div<{ type: string }>`
  color: #FFFFFF;
  size: 10px;
  font-weight: bolder;
  height: 1.5em;
  border-radius: 10px;
  width: 2.5em;
  float: right;
  text-align: center;
  background-color: ${props => props.type === 'info' ? `#000000` : (props.type === 'success' ? `#00ab50` : (props.type === 'redirect' ? `#045077` : (props.type === `error` ? `#ab1400` : `#ff4565`)))};
`;

class Json extends React.PureComponent<JsonProps> {
  node: HTMLDivElement;

  constructor(props) {
    super(props);

    // workaround to update Operation state from here
    this.props.handleRequestBodyChange?.(JSON.stringify(this.props.data.content || this.props.data));
  }

  render() {
    return <CopyButtonWrapper data={this.props.data.content || this.props.data}>{this.renderInner}</CopyButtonWrapper>;
  }

  // TODO: Implement this differently, without code duplication,
  // in order to rerender this.renderInner from above with new props
  componentDidUpdate() {
    this.renderInner = ({ renderCopyButton }) => (
      <JsonViewerWrap>
        <SampleControls>
          {renderCopyButton()}
          {<button onClick={this.expandAll}> Expand all </button>}
          {<button onClick={this.collapseAll}> Collapse all </button>}
        </SampleControls>
        <OptionsContext.Consumer>
          {options => (
            <>
              {this.props.data.content && <StatusCodeSpan type={this.props.data.type}>{this.props.data.code}</StatusCodeSpan>}
              <PrismDiv
                className={this.props.className}
                // tslint:disable-next-line
                ref={node => (this.node = node!)}
                dangerouslySetInnerHTML={{
                  __html: jsonToHTML(this.props.data.content || this.props.data, options.jsonSampleExpandLevel),
                }}
                contentEditable={this.props.editable} // <-- TODO ref: this line right here
                onInput={(e) => this.props.handleRequestBodyChange?.(e.currentTarget.textContent)}
                spellCheck={false}
              />
            </>
          )}
        </OptionsContext.Consumer>
      </JsonViewerWrap>
    );
  }

  renderInner = ({ renderCopyButton }) => (
    <JsonViewerWrap>
      <SampleControls>
        {renderCopyButton()}
        {<button onClick={this.expandAll}> Expand all </button>}
        {<button onClick={this.collapseAll}> Collapse all </button>}
      </SampleControls>
      <OptionsContext.Consumer>
        {options => (
          <>
            {this.props.data.content && <StatusCodeSpan type={this.props.data.type}>{this.props.data.code}</StatusCodeSpan>}
            <PrismDiv
              className={this.props.className}
              // tslint:disable-next-line
              ref={node => (this.node = node!)}
              dangerouslySetInnerHTML={{
                __html: jsonToHTML(this.props.data.content || this.props.data, options.jsonSampleExpandLevel),
              }}
              contentEditable={this.props.editable}
              onInput={(e) => this.props.handleRequestBodyChange?.(e.currentTarget.textContent)}
              spellCheck={false}
            />
          </>
        )}
      </OptionsContext.Consumer>
    </JsonViewerWrap>
  );

  expandAll = () => {
    console.log(this.node)
    const elements = this.node.getElementsByClassName('collapsible');
    for (const collapsed of Array.prototype.slice.call(elements)) {
      (collapsed.parentNode as Element)!.classList.remove('collapsed');
    }
  };

  collapseAll = () => {
    const elements = this.node.getElementsByClassName('collapsible');
    // skip first item to avoid collapsing whole object/array
    const elementsArr = Array.prototype.slice.call(elements, 1);

    for (const expanded of elementsArr) {
      (expanded.parentNode as Element)!.classList.add('collapsed');
    }
  };

  clickListener = (event: MouseEvent) => {
    let collapsed;
    const target = event.target as HTMLElement;
    if (target.className === 'collapser') {
      collapsed = target.parentElement!.getElementsByClassName('collapsible')[0];
      if (collapsed.parentElement.classList.contains('collapsed')) {
        collapsed.parentElement.classList.remove('collapsed');
      } else {
        collapsed.parentElement.classList.add('collapsed');
      }
    }
  };

  componentDidMount() {
    this.node!.addEventListener('click', this.clickListener);
  }

  componentWillUnmount() {
    this.node!.removeEventListener('click', this.clickListener);
  }
}

export const JsonViewer = styled(Json)`
  ${jsonStyles};
`;
