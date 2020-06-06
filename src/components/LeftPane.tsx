import React from 'react';

import Divider from '@material-ui/core/Divider';

import DbPicker from './DbPicker';
import DbSchema from './DbSchema.js';


interface ILeftPaneProps {
  leftPaneVisibility: boolean
  dbIndex: number

  changeSearchTerm: Function
  changeDbIndex: Function
  changeTable: Function
  changeColumns: Function
  changeDbSchemaDefinitions: Function
  changeDbPkInfo: Function
  changeVisibleColumns: Function
  publicDBStatus: Function
}

interface ILeftPaneState {}

export const LeftPane: React.FunctionComponent<ILeftPaneProps> = (props) => {
  let rootClasses =
    props.leftPaneVisibility === true ? styleSheet.root : styleSheet.rootHide

  return (
    <div style={{...rootClasses}}>
      <DbPicker {...props} />
      <Divider />
      <DbSchema {...props} />
    </div>
  )
}

const styleSheet: any = {
  root: {
    width: '29%',
    height: '100%',
    float: 'left',
    opacity: 1,
    visibility: 'visible',
    transition: 'width 0.25s, visibility 0.2s, opacity 0.12s'
  },
  rootHide: {
    width: '0%',
    height: '100%',
    float: 'left',
    opacity: 0,
    visibility: 'hidden',
    transition: 'width 0.25s, visibility 0.2s, opacity 0.12s'
  },
  column: {
    marginLeft: 27
  },
  lowBottomPadding: {
    paddingBottom: 0
  }
}
