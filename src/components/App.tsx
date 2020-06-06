import 'typeface-roboto';
import '../styles/index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { INITIAL_ROW_LIMIT } from '../data/constants';
import { IConfigDatabase } from '../data/models/configModel';
import Auth from './Auth.js';
import HistoryPane from './HistoryPane';
import { LeftPane } from './LeftPane';
import Navigation from './Navigation.js';
import RightPane from './RightPane.js';


let lib = require('../utils/library.ts')
let auth: Nullable<Auth> = null
interface IAppProps {}

interface IAppState {
  dbIndex: number
  table: string
  rowLimit: number
  exactCount: boolean
  rulesFromURL: Nullable<string>
  rulesFromHistoryPane: Nullable<string>
  columns: Array<string>
  newHistoryItem: Array<string>
  visibleColumns: Array<string>
  leftPaneVisibility: boolean
  historyPaneVisibility: boolean
  searchTerm: string
  dbSchemaDefinitions: Nullable<string>
  dbPkInfo: Nullable<string>
  userName: string
  token: Nullable<string>
  isLoggedIn: boolean
}

export default class Layout extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props)

    // Parse URL
    let parsedURL = this.parseURL()

    this.state = {
      dbIndex: parsedURL['db'] || 0,
      table: parsedURL['table'] || '',
      rowLimit: parsedURL['rowLimit'] || INITIAL_ROW_LIMIT,
      exactCount: parsedURL['exactCount'] || false,
      rulesFromURL: parsedURL['urlRules'] || null,
      rulesFromHistoryPane: null,
      columns: [],
      newHistoryItem: [],
      visibleColumns: [],
      leftPaneVisibility: true,
      historyPaneVisibility: false,
      searchTerm: '',
      dbSchemaDefinitions: null,
      dbPkInfo: null,
      userName: 'Unknown username',
      token: null,
      isLoggedIn: false
    }

    auth = new Auth(parsedURL['db'] || 0)

    this.setUserEmailPassword = this.setUserEmailPassword.bind(this)
    this.toggleLeftPane = this.toggleLeftPane.bind(this)
    this.toggleHistoryPane = this.toggleHistoryPane.bind(this)
    this.changeSearchTerm = this.changeSearchTerm.bind(this)
    this.changeDbIndex = this.changeDbIndex.bind(this)
    this.changeColumns = this.changeColumns.bind(this)
    this.changeDbSchemaDefinitions = this.changeDbSchemaDefinitions.bind(this)
    this.changeDbPkInfo = this.changeDbPkInfo.bind(this)
    this.changeVisibleColumns = this.changeVisibleColumns.bind(this)
    this.addToHistory = this.addToHistory.bind(this)
    this.closeHistoryPane = this.closeHistoryPane.bind(this)
    this.changeTable = this.changeTable.bind(this)
    this.changeRules = this.changeRules.bind(this)
  }

  // This should be called once, when app loads, to load a shared query via URL
  parseURL() {
    let url: string = '' + window.location.href

    let databaseRx: RegExp = /\/db\/\d\//g
    let tableRx: RegExp = /\/table\/\w+\/?/g
    let queryRx: RegExp = /query=.*/g
    let rowLimitRx: RegExp = /rowLimit=\d+/g
    let exactCountRx: RegExp = /exactCount=True|exactCount=False/g

    // Extract the db
    let dbExecResults: Nullable<RegExpExecArray> = databaseRx.exec(url)
    let db: number
    if (dbExecResults) {
      db = parseInt(
        dbExecResults[0].replace(/\/db\//g, '').replace(/\//g, ''),
        10
      )
    } else {
      db = 0
    }

    // Confirm DB exists
    let databasesMapped: Array<string> = []
    lib
      .getValueFromConfig('databases')
      .map(
        (obj: IConfigDatabase, index: number) =>
          (databasesMapped[index] = obj.title || 'Untitled database')
      )
    if (!databasesMapped[db]) {
      db = 0
    }

    // Extract the table
    let tableExecResults: Nullable<RegExpExecArray> = tableRx.exec(url)
    let table: Nullable<string>

    if (tableExecResults) {
      table = tableExecResults[0].replace(/\/table\//g, '').replace(/\//g, '')
    } else {
      table = null
    }

    // Extract the query
    let queryExecResults: Nullable<RegExpExecArray> = queryRx.exec(url)
    let query: Nullable<string>
    if (queryExecResults) {
      query = queryExecResults[0].replace('query=', '')
      query = decodeURIComponent(query)
      if (query) {
        query = JSON.parse(query)
      }
    } else {
      query = null
    }

    // Extract the rowLimit
    let rowLimitExecResults: Nullable<RegExpExecArray> = rowLimitRx.exec(url)
    let rowLimit: Nullable<number>
    if (rowLimitExecResults) {
      rowLimit = parseInt(rowLimitExecResults[0].replace(/rowLimit=/g, ''), 10)
    } else {
      rowLimit = null
    }

    // Extract the exactCount
    let exactCountExecResults: Nullable<RegExpExecArray> = exactCountRx.exec(
      url
    )
    let exactCount: boolean
    if (exactCountExecResults) {
      exactCount =
        exactCountExecResults[0].replace(/exactCount=/g, '') === 'True'
    } else {
      exactCount = false
    }

    return {
      db: db,
      table: table,
      urlRules: query,
      rowLimit: rowLimit,
      exactCount: exactCount
    }
  }

  toggleLeftPane() {
    this.setState({
      leftPaneVisibility: !this.state.leftPaneVisibility
    })
  }

  toggleHistoryPane() {
    this.setState({
      historyPaneVisibility: !this.state.historyPaneVisibility
    })
  }

  closeHistoryPane() {
    this.setState({
      historyPaneVisibility: false
    })
  }

  changeDbIndex(newIndex: number) {
    this.setState({
      dbIndex: newIndex,
      isLoggedIn: false,
      token: null,
      userName: 'Unknown username'
    })

    if (auth) {
      auth.setDb(newIndex)

      // Get new token usign existing credentials. Otherwise log out the user
      auth.getUserDetails().then((resp) => {
        if (resp.isLoggedIn) {
          this.setState({
            token: resp.jwtToken,
            userName: resp.name,
            isLoggedIn: true
          })
        } else {
          this.setState({
            isLoggedIn: false,
            token: null,
            userName: 'Unknown username'
          })
        }
      })
    }
  }

  changeSearchTerm(newTerm: string) {
    this.setState({searchTerm: newTerm})
  }

  changeTable(newTable: string) {
    this.setState({
      table: newTable
    })
  }

  changeRules(newRules: string) {
    this.setState({
      rulesFromHistoryPane: newRules
    })
  }

  changeDbSchemaDefinitions(newDefinitions: string) {
    this.setState({
      dbSchemaDefinitions: newDefinitions
    })
  }

  changeDbPkInfo(pkInfo: string) {
    this.setState({
      dbPkInfo: pkInfo
    })
  }

  changeColumns(newColumns: Array<string>) {
    this.setState({
      columns: newColumns
    })
  }

  addToHistory(newUrl: string, newRules: string) {
    this.setState({
      newHistoryItem: [newUrl.replace(/\?limit=\d*/g, ''), newRules]
    })
  }

  changeVisibleColumns(newVisibleColumns: Array<string>) {
    this.setState({
      visibleColumns: newVisibleColumns
    })
  }

  handleLogoutClick = () => {
    if (auth) {
      auth.logout()
    }
    this.setState({
      token: null,
      userName: 'Unknown username',
      isLoggedIn: false
    })
  }

  setUserEmailPassword(email: string, password: string) {
    if (auth) {
      auth.setCredentials(email, password)
      auth.getUserDetails().then((resp) => {
        if (resp.isLoggedIn) {
          this.setState({
            token: resp.jwtToken,
            userName: resp.name,
            isLoggedIn: true
          })
        } else {
          this.setState({
            isLoggedIn: false,
            token: null,
            userName: 'Unknown username'
          })
        }
        if (
          this.state.rulesFromURL &&
          lib.getDbConfig(this.state.dbIndex, 'publicDbAcessType') ===
            'private' &&
          resp.isLoggedIn
        ) {
          this.changeRules(this.state.rulesFromURL)
        }
      })
    }
  }

  componentDidMount() {
    if (
      this.state.rulesFromURL &&
      lib.getDbConfig(this.state.dbIndex, 'publicDbAcessType') !== 'private'
    ) {
      this.changeRules(this.state.rulesFromURL)
      // setTimeout( ()=> {
      // 	history.pushState('Shared Query', 'Shared Query', 'https://localhost:3000/');
      // }, 1000);
    }

    // TRY TO GET a token usign existing credentials
    if (auth) {
      auth.getUserDetails().then((resp) => {
        if (resp.isLoggedIn) {
          this.setState({
            token: resp.jwtToken,
            userName: resp.name,
            isLoggedIn: true
          })
        }
      })
    }
  }

  render() {
    let publicDBStatus =
      lib.getDbConfig(this.state.dbIndex, 'publicDbAcessType') || 'read'
    return (
      <>
        <Navigation
          {...this.state}
          changeSearchTerm={this.changeSearchTerm}
          toggleLeftPane={this.toggleLeftPane}
          toggleHistoryPane={this.toggleHistoryPane}
          setUserEmailPassword={this.setUserEmailPassword}
          publicDBStatus={publicDBStatus}
          handleLogoutClick={this.handleLogoutClick}
        />

        <div className='bodyDiv'>
          <LeftPane
            {...this.state}
            changeSearchTerm={this.changeSearchTerm}
            changeDbIndex={this.changeDbIndex}
            changeTable={this.changeTable}
            changeColumns={this.changeColumns}
            changeDbSchemaDefinitions={this.changeDbSchemaDefinitions}
            changeDbPkInfo={this.changeDbPkInfo}
            changeVisibleColumns={this.changeVisibleColumns}
            publicDBStatus={publicDBStatus}
          />
          <RightPane
            {...this.state}
            changeRules={this.changeRules}
            addToHistory={this.addToHistory}
            publicDBStatus={publicDBStatus}
          />
          <HistoryPane
            {...this.state}
            closeHistoryPane={this.closeHistoryPane}
            changeTable={this.changeTable}
            changeRules={this.changeRules}
            publicDBStatus={publicDBStatus}
          />
        </div>
      </>
    )
  }
}

const app = document.getElementById('root')
ReactDOM.render(<Layout />, app)

// Takes the query part of the URL used to make PostgREST API call and converts to an array object that can be traversed
/*parseURLRules(urlQuery) {
		if (urlQuery === null) {
			return null;
		}

		urlQuery = urlQuery.replace(/not.and=\(/g, "(not.and,").replace(/not.or=\(/g, "(not.or,");
		urlQuery = urlQuery.replace(/not.and\(/g, "(not.and,").replace(/not.or\(/g, "(not.or,");
		urlQuery = urlQuery.replace(/and=\(/g, "(and,").replace(/or=\(/g, "(or,");
		urlQuery = urlQuery.replace(/and\(/g, "(and,").replace(/or\(/g, "(or,");

		urlQuery = urlQuery.replace(/\(/g, "[").replace(/\)\s/g, "], ");
		urlQuery = urlQuery.replace(/\)/g, "]");
		urlQuery = urlQuery.replace(/\s+/, ", ");
		urlQuery = "[" + urlQuery + "]";
		urlQuery = urlQuery.replace(/[^[\],\s]+/g, "\"$&\"");
		urlQuery = urlQuery.replace(/" /g, "\", ");

		urlQuery = JSON.parse(urlQuery);
		if (urlQuery.length === 1 && urlQuery[0] instanceof Array) {
			urlQuery = urlQuery[0];
		}

		return this.recursiveRulesCreation(urlQuery);
	}*/

// Takes a tranversable array object and converts to jQB compliant JSON object
/*recursiveRulesCreation(arrayObj) {
		let rules = {};
		let rulesElement = [];
		for (let i = 0; i < arrayObj.length; i++) {
			if (i === 0) {
				// Condition + Not + Valid
				rules.condition = arrayObj[0].replace("not.","").toUpperCase();
				rules.not = arrayObj[0].replace(".and", "").replace(".or", "") === "not";
				rules.valid = true;
			} else {
				// Rules
				if (arrayObj[i] instanceof Array) {
					rulesElement.push(this.recursiveRulesCreation(arrayObj[i]));
				} else {
					let rule = arrayObj[i].split(".");
					rulesElement.push({
						id: rule[0],
						field: rule[0],
						operator: lib.translateOperatorTojQB(rule[1]),
						value: rule[2]
					});
				}
				rules.rules = rulesElement;
			}
		}
		return rules;
	}*/
