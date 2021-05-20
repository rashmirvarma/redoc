import { observer } from 'mobx-react';
import * as React from 'react';

import { Badge, DarkRightPanel, H2, MiddlePanel, Row, Tab, TabList, TabPanel, Tabs } from '../../common-elements';
import { ShareLink } from '../../common-elements/linkify';
import { RequiredLabel } from '../../common-elements/fields';
import { OperationModel } from '../../services/models';
import styled from '../../styled-components';
import { CallbacksList } from '../Callbacks';
//import { CallbackSamples } from '../CallbackSamples/CallbackSamples';
import { Endpoint } from '../Endpoint/Endpoint';
import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { Extensions } from '../Fields/Extensions';
import { Markdown } from '../Markdown/Markdown';
import { OptionsContext } from '../OptionsProvider';
import { Parameters } from '../Parameters/Parameters';
import { RequestSamples } from '../RequestSamples/RequestSamples';
import { ResponsesList } from '../Responses/ResponsesList';
import { ResponseSamples } from '../ResponseSamples/ResponseSamples';
import { SecurityRequirements } from '../SecurityRequirement/SecurityRequirement';

const OperationRow = styled(Row)`
  backface-visibility: hidden;
  contain: content;
  overflow: hidden;
`;

const Description = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.unit * 6}px;
`;

export const RunButton = styled.button<{disabled: boolean}>`
  border-radius: 20px;
  line-height: 2.5em;
  width: 7em;
  background-color: ${props => props.disabled ? `#AEAEAE`: `#1E4F70`};
  color: #FFFFFF;
  font-weight: bolder;
  outline: none;
  float: right;
  cursor: pointer;
  margin-top: 10px;
`;


export const ActionOnArrayButton = styled.button<{disabled: boolean}>`
  border-radius: 20px;
  background-color: ${props => props.disabled ? `#AEAEAE`: `#1E4F70`};
  line-height: 1.5em;
  margin: 0 0.5em 0 0.5 em;
  width: 2em;
  color: #FFFFFF;
  font-weight: bolder;
  outline: none;
  float: right;
  cursor: pointer;
`;

const HorizontalLineWrapper = styled.div<{width?: string}>`
  margin: auto !important;
  width: ${props => `${props.width || `100%`};`}
`

const ItemTitle = styled.span`
  padding: 20px 20px 20px 0;
  margin-top: 40px;
  font-size: 1.2em;
  color: #58585B;
  font-weight: 600;
`;

const InputLabel = styled.label`
  color: #1e1e1e;
  font-weight: bolder;
  padding: 0.5em;
  margin: 0.5em 0.5em 0.5em 0;
  background: transparent;
`;
const Details = styled.div`
  color: #58585B;
  font-weight: 100;
  background: transparent;
  font-size:24px;
  border-bottom: 1px solid #DFDFDF;
  margin: 10% 0% 10% 0%;
  padding-bottom: 8%;

`;
const TryOutHeader = styled.div`
  color: #58585B;
  font-weight: bold;
  background: transparent;
  font-size:14px;
 
  margin: 10% 0% 0% 0%;

`;
const TryOutPanel = styled.div`

  background-color: #F2F2F2;
  display:flex;
  flex-direction:column;
  color: #59595C;
  font-weight: 100;
  font-size: 14px;
  padding: 25px 20px 25px 20px;
 

`;
export const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em 0.5em 0.5em 0;
  color: #1e1e1e;
  background: white;
  border: none;
  border-radius: 3px;
  ::placeholder {
    color: grey;
  }
`;

enum FormItemType {
  string = 'string',
  integer = 'integer',
  array = 'array',
  any = 'any',
  object = 'object',
}

export const FormItemTypesSwitch = ({item}) => {
  const {schema, name, example, description, required} = item;

  switch (schema.type) {
    case FormItemType.string:
    case FormItemType.integer:
      return <Input key={`${name}-input`} placeholder={`${example || description || ''}`} type="text" defaultValue={schema.default}/>
    case FormItemType.array: {
      const {schema: subSchema} = schema;
      return <ArrayInputs schema={subSchema} required={required}/>;
    }
    // case FormItemType.any: {
    //   console.log(item);
    //   const {schema: subSchema} = item;
    //   const hasDiscriminator = subSchema!.oneOf;

    //   if (hasDiscriminator) {
    //     const activeOption = subSchema!.oneOf![subSchema!.activeOneOf!];
    //     const hasDiscriminatorRecursive = activeOption!.oneOf;
    //     if (hasDiscriminatorRecursive) {
    //       const activeOptionRecursive = activeOption!.oneOf![activeOption!.activeOneOf!];
    //       const hasOwnFieldsRecursive = activeOptionRecursive!.fields && activeOptionRecursive!.fields.length !== 0;
    //       const hasOwnItemsRecursive = activeOptionRecursive!.items && activeOptionRecursive!.items.length !== 0;

    //       const fieldsRecursive = hasOwnFieldsRecursive 
    //       ? activeOptionRecursive!.fields
    //       : (hasOwnItemsRecursive ? activeOptionRecursive!.items.fields : []);
    //       console.log("Recursive:", fieldsRecursive);
    //     }
    //     const hasOwnFields = activeOption!.fields && activeOption!.fields.length !== 0;
    //     const hasOwnItems = activeOption!.items && activeOption!.items.length !== 0;
  
    //     const fields = hasOwnFields 
    //     ? activeOption!.fields
    //     : (hasOwnItems ? activeOption!.items.fields : []);
    //     console.log(fields);
  
    //     if (!fields || fields.length === 0) {
    //       return null;
    //     }
    //   }
    //   return null;
    // }

    default: {
      return <> {`Could not find an item type for this item`} </>
    }
  }
}

export const ArrayInputs = ({schema, required}) => {
  const {minItems, maxItems /*items*/} = schema;
  // const {type: itemsType} = items;
  const [minLength] = React.useState(minItems || required ? 1 : 0);
  const [maxLength] = React.useState(maxItems);
  const [length] = React.useState(minLength || 0);
  const arr: any[] = [];
  for (let i = 0; i < length; i++) {
    arr.push(<Input key={`input-${i}-${new Date().getTime()}`}/>);
  }
  const [array, setArray] = React.useState<any>(arr);

  enum ArrayAction {
    remove = `remove`,
    add = `add`
  } 

  const handleButtonClick = (action: ArrayAction) => {
    switch (action) {
      case ArrayAction.remove: {
        if (array.length - 1 >= minLength) {
          const newArr = [...array]
          newArr.pop();
          setArray(newArr);
        }
        break;
      }
      case ArrayAction.add: {
        if (maxLength && array.length + 1 <= maxLength || !maxLength) {
          const newArr = [...array];
          newArr.push(<Input key={`input-pushed-${new Date().getTime()}`}/>);
          setArray(newArr);
        }
        break;
      }
      default: break;
    }
  }

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      {array}
      <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
        <ActionOnArrayButton disabled={array.length === minLength} onClick={() => handleButtonClick(ArrayAction.remove)}>{`-`}</ActionOnArrayButton>
        <ActionOnArrayButton disabled={maxLength ? array.length === maxLength : false} onClick={() => handleButtonClick(ArrayAction.add)}>{`+`}</ActionOnArrayButton>
      </div>
    </div>
  );
}

export const FormItem = ({item}) => {
  const alignItemsStyle = item.schema.type !== FormItemType.array ? 'center' : 'normal';

  return (
    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: `${alignItemsStyle}`}}>
      <div>
        <InputLabel key={`${item.name}-label`}>{item.name}</InputLabel>
        {item.required && <RequiredLabel rightBelow={true}> required </RequiredLabel>}
      </div>
      <FormItemTypesSwitch item={item}/>
    </div>
  );
}

export const FormSection = ({title, items}) => {
  return (
    <>
      <div>
        <ItemTitle>{title}</ItemTitle>
        
        <TryOutPanel>
          {items.map(
            (item, idx) => <FormItem item={item} key={idx}/>
          )}
        </TryOutPanel>
        <HorizontalLineWrapper width="90%"></HorizontalLineWrapper>
      </div>
    </>
  );
}

export const QueryParamsSection = ({params}) => {
  const hasParams = params && params.length;

  if (!hasParams) {
    return null;
  }

  return (<FormSection title={``} items={params}/>);
}

export const RequestBodySection = ({body}) => {
  if (!body) {
    return null;
  }

  const schema = body.content!.active!.schema;
  const hasDiscriminator = schema!.oneOf;
  const hasOwnFields = schema!.fields && schema!.fields.length !== 0;
  const hasOwnItems = schema!.items && schema!.items.length !== 0;

  const fields = hasDiscriminator 
  ? schema!.oneOf![schema!.activeOneOf!].fields 
  : (hasOwnFields ? schema!.fields : (hasOwnItems ? schema!.items.fields : []));

  if (!fields || fields.length === 0) {
    return null;
  }

  return (<FormSection title={``} items={fields}/>);
}

export interface OperationProps {
  operation: OperationModel;
}

export interface OperationState {
  customResponse: any;
  requestBody: string;
  tabIndex: number;
  pendingRequest: boolean;
}

@observer
export class Operation extends React.Component<OperationProps, OperationState> {
  constructor(props) {
    super(props);

    this.state = {
      customResponse: ``,
      requestBody:  '',
      tabIndex: 0,
      pendingRequest: false,
    };
  }

  handleRequestBodyChange = (requestBody) => {
    requestBody = JSON.stringify(JSON.parse(requestBody));
    console.log(`handleRequestBodyChange`, requestBody)
    this.setState({requestBody});
  }

  mapStatusCodeToType = (code) => {
    let type = ``;

    switch (true) {
      case (code >= 100 && code < 200):
        type = `info`;
        break;
      case (code >= 200 && code < 300):
        type = `success`;
        break;
      case (code >= 300 && code < 400):
        type = `redirect`
        break;
      case (code >= 400 && code < 500):
        type = `error`;
        break;
      default:
        break;
    }

    return type;
  }

  handleApiCall = () => {
    const { operation } = this.props;
    const { httpVerb, path} = operation;
    console.log(httpVerb, path, this.state.requestBody);
    const randomCode = Math.floor(Math.random() * (599 - 100) + 100);
    const randomType = this.mapStatusCodeToType(randomCode) ;
    const customResponse = {
      content: JSON.parse(`{\"mocked\" : \"JSON Object\"}`),
      type: randomType,
      code: randomCode
    }
    this.setState({pendingRequest: true});
    setTimeout(() => {
      this.setState({customResponse, pendingRequest: false});
    }, 3000);

    // TO DO: tweak this
    
    // fetch(path, {
    //   method: httpVerb,
    //   headers: {'Content-Type': 'application/json'},
    //   body: this.state.requestBody // body data type must match "Content-Type" header
    // })
    // .then(response => response.json())
    // .then(response => {
      // response.type = this.mapStatusCodeToType(response.code)
    //})
    // .then(response => this.setState({customResponse: response}));
  };

  render() {
    const { operation } = this.props;

    const { name: summary, description, deprecated, externalDocs, isWebhook } = operation;
    const hasDescription = !!(description || externalDocs);

    return (
      <OptionsContext.Consumer>
        {(options) => (
          <OperationRow>
            <MiddlePanel>
              <H2>
                <ShareLink to={operation.id} />
                {summary} {deprecated && <Badge type="warning"> Deprecated </Badge>}
                {isWebhook && <Badge type="primary"> Webhook </Badge>}
              </H2>
              {options.pathInMiddlePanel && !isWebhook && (
                <Endpoint operation={operation} inverted={true} />
              )}
              {hasDescription && (
                <Description>
                  {description !== undefined && <Markdown source={description} />}
                  {externalDocs && <ExternalDocumentation externalDocs={externalDocs} />}
                  
                </Description>
                
              )}
                            <Extensions extensions={operation.extensions} />
                            <SecurityRequirements securities={operation.security} />
              <H2>
              {!options.pathInMiddlePanel && !isWebhook && <Endpoint operation={operation} />}
                      {operation.parameters && (operation.parameters.length > 0) && <QueryParamsSection params={operation.parameters}/>}
              </H2>
              
              <Parameters parameters={operation.parameters} body={operation.requestBody} />

              <ResponsesList responses={operation.responses} />
              <CallbacksList callbacks={operation.callbacks} />
            </MiddlePanel>
            <DarkRightPanel>
              <Details>Details</Details>
                <Tabs defaultIndex={0} onSelect={tabIndex => this.setState({tabIndex})}>
                  <TabList>
                  <Tab className={'tab-try-out'} key={'Try out'}>
                          {'Try It'}
                    </Tab>
                  <Tab className={'tab-examples'} key={'Examples'}>
                        {'Example'}
                    </Tab>
                  </TabList>
                  <TabPanel key={'Try out panel'}>
                    <>
                      <TryOutHeader> Header</TryOutHeader>
                      <TryOutHeader>Body</TryOutHeader>
                      {operation.requestBody && <RequestBodySection body={operation.requestBody}/>}
                      {/* <RequestSamples
                        operation={operation}
                        editable={true}
                        handleRequestBodyChange={this.handleRequestBodyChange}
                      /> */}
                      <ResponseSamples
                        customResponse={this.state.customResponse}
                      />
                    </>
                  </TabPanel>
                  <TabPanel key={'Examples panel'}>
                    <>
                      <Tabs defaultIndex={0}>
                        <TabList>
                          <Tab className={'tab-examples-request'} key={'Request'}>
                              {'Request'}
                          </Tab>
                          <Tab className={'tab-examples-response'} key={'Response'}>
                              {'Response'}
                          </Tab>
                        </TabList>
                        <TabPanel key={'Request'}>
                          <RequestSamples
                            operation={operation}
                            editable={false}
                            handleRequestBodyChange={this.handleRequestBodyChange}
                          />
                        </TabPanel>
                        <TabPanel key={'Response'}>
                          <ResponseSamples
                            operation={operation}
                          />
                        </TabPanel>
                      </Tabs>
                    </>
                  </TabPanel>
                </Tabs>
                {
                  this.state.tabIndex === 0 &&
                  <>
                    <Tabs defaultIndex={0}>
                      <RunButton disabled={this.state.pendingRequest} onClick={this.handleApiCall}>
                        {`Run`}
                      </RunButton>
                    </Tabs>
                  </>
                }

            </DarkRightPanel>
          </OperationRow>
        )}
      </OptionsContext.Consumer>
    );
  }
}
