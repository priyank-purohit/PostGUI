import React, {Component} from 'react'
import Chip from '@material-ui/core/Chip'

import FeatureDiscoveryPrompt from './FeatureDiscoveryPrompt/FeatureDiscoveryPrompt'
import grey from '@material-ui/core/colors/grey'

export default class RightPaneChips extends Component {
  constructor(props) {
    super(props)

    // rows = number of rows in response
    // totalRows = number of rows in query result (i.e. full result count)
    // rowLimit = user set row limit
    // maxRows = app wide limit on max value for rowLimit
    this.state = {
      rows: props.rows ? props.rows : 0,
      totalRows: props.totalRows ? props.totalRows : 0,
      rowLimit: props.rowLimit ? props.rowLimit : 2500,
      maxRows: props.maxRows ? props.maxRows : 250000,
      tip: 'Tip: Hold shift and click to multi-sort!',
      tip2: 'Increase row-limit for full result.',
      title2: '',
      tip3: 'Use Batch Download option.',
      isTip1FdpOpen: false,
      isTip2FdpOpen: false,
      isTip3FdpOpen: false
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      rows: newProps.rows ? newProps.rows : 0,
      totalRows: newProps.totalRows ? newProps.totalRows : 0,
      rowLimit: newProps.rowLimit ? newProps.rowLimit : 2500,
      maxRows: newProps.maxRows ? newProps.maxRows : 100000
    })
  }
  render() {
    let rowCountChipLabel =
      'Displaying ' +
      String(this.props.rows || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
      ' rows'
    if (this.props.totalRows >= 0) {
      rowCountChipLabel =
        'Displaying ' +
        String(this.props.rows || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
        ' of ' +
        String(this.props.totalRows || 0).replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ','
        ) +
        ' rows'
    }
    return (
      <div style={styleSheet.row}>
        <FeatureDiscoveryPrompt
          onClose={() => this.setState({isTip1FdpOpen: false})}
          open={this.state.isTip1FdpOpen}
          backgroundColor={grey[600]}
          title='Rows in Data Table'
          subtractFromTopPos={60}
          opacity={0.95}
          description="Keep track of rows count to ensure full query result is displayed. Increase 'Row-limit' and enable 'Get exact row count' option to ensure full result."
        >
          <Chip
            color={'secondary'}
            variant='outlined'
            label={rowCountChipLabel}
            onMouseEnter={() => {
              this.timer = setTimeout(() => {
                this.setState({
                  isTip1FdpOpen: true
                })
              }, 250)
            }}
            onMouseLeave={() => {
              this.setState({isTip1FdpOpen: false})
              clearTimeout(this.timer)
            }}
            key={1}
            style={styleSheet.chip}
          />
        </FeatureDiscoveryPrompt>

        {this.state.rows === this.state.rowLimit &&
        this.state.rows !== this.state.maxRows ? (
          <FeatureDiscoveryPrompt
            onClose={() => this.setState({isTip2FdpOpen: false})}
            open={this.state.isTip2FdpOpen}
            backgroundColor={grey[600]}
            title='Increase Row-limit'
            subtractFromTopPos={75}
            opacity={0.95}
            description='A higher row-limit can show more rows of the query result.'
          >
            <Chip
              label={this.state.tip2}
              key={3}
              style={styleSheet.chip}
              onClick={() => {
                this.props.increaseRowLimit(this.state.maxRows)
              }}
              onMouseEnter={() => {
                this.timer = setTimeout(() => {
                  this.setState({
                    isTip2FdpOpen: true
                  })
                }, 250)
              }}
              onMouseLeave={() => {
                this.setState({isTip2FdpOpen: false})
                clearTimeout(this.timer)
              }}
            />
          </FeatureDiscoveryPrompt>
        ) : (
          <div />
        )}
        {this.state.rows === this.state.maxRows ? (
          <FeatureDiscoveryPrompt
            onClose={() => this.setState({isTip3FdpOpen: false})}
            open={this.state.isTip3FdpOpen}
            backgroundColor={grey[600]}
            title='Batch Download Option'
            subtractFromTopPos={75}
            opacity={0.95}
            description='Can download data in batches when the full query result contains more than 2.5 million rows.'
          >
            <Chip
              label={this.state.tip3}
              key={2}
              color='secondary'
              variant='outlined'
              style={styleSheet.chip}
              onMouseEnter={() => {
                this.timer = setTimeout(() => {
                  this.setState({
                    isTip3FdpOpen: true
                  })
                }, 250)
              }}
              onMouseLeave={() => {
                this.setState({isTip3FdpOpen: false})
                clearTimeout(this.timer)
              }}
            />
          </FeatureDiscoveryPrompt>
        ) : (
          <div />
        )}
        <Chip label={this.state.tip} key={4} style={styleSheet.chip} />
      </div>
    )
  }
}

const styleSheet = {
  chip: {
    margin: 5
  },
  row: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginTop: -30,
    marginRight: '1%'
  }
}
