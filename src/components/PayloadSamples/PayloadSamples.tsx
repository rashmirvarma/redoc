import { observer } from 'mobx-react';
import * as React from 'react';
import { MediaTypeSamples } from './MediaTypeSamples';

import { MediaContentModel } from '../../services/models';
import { DropdownOrLabel } from '../DropdownOrLabel/DropdownOrLabel';
import { MediaTypesSwitch } from '../MediaTypeSwitch/MediaTypesSwitch';
import { InvertedSimpleDropdown, MimeLabel } from './styled.elements';
import { JsonViewer } from '../JsonViewer/JsonViewer';

const defaultJSON = JSON.parse(`{\"your\" : \"customJSON\"}`);
export interface PayloadSamplesProps {
  content?: MediaContentModel;
  editable?: boolean;
  customData?: any;
  handleRequestBodyChange?: (string) => void;
}

@observer
export class PayloadSamples extends React.Component<PayloadSamplesProps> {
  render() {
    const mimeContent = this.props.content;
    const editable = this.props.editable;
    const customData = this.props.customData;
    const handleRequestBodyChange = this.props.handleRequestBodyChange;
    
    if (customData) {
      return <JsonViewer data={customData} editable={editable} handleRequestBodyChange={handleRequestBodyChange}/>
    }
    
    if (mimeContent === undefined) {
      return <JsonViewer data={defaultJSON} editable={editable} handleRequestBodyChange={handleRequestBodyChange}/>
    }

    return (
      <MediaTypesSwitch content={mimeContent} renderDropdown={this.renderDropdown} withLabel={true}>
        {mediaType => (
          <MediaTypeSamples
            key="samples"
            mediaType={mediaType}
            renderDropdown={this.renderDropdown}
            editable={editable}
            handleRequestBodyChange={handleRequestBodyChange}
          />
        )}
      </MediaTypesSwitch>
    );
  }

  private renderDropdown = props => {
    return <DropdownOrLabel Label={MimeLabel} Dropdown={InvertedSimpleDropdown} {...props} />;
  };
}
