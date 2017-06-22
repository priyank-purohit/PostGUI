import React from 'react';
import axios from 'axios';
import DataTable from './DataTable';

let lib = require('../utils/library.js');

const defaultRules = lib.getQBRules();

export default class QueryBuilderWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rules: {},
            table: this.props.table,
            columns: this.props.columns,
            selectColumns: this.props.selectColumns,
            response: []
        };
    }

    componentDidMount() {
        const element = this.refs.queryBuilder;
        this.initializeQueryBuilder(element);
    }

    componentWillUnmount() {
        window.$(this.refs.queryBuilder).queryBuilder('destroy');
    }

    // Creates the QB on first render with default table (error msg for now)
    initializeQueryBuilder(element, newRules) {
        const filters = lib.getQBFilters("", []);
        const rules = newRules ? newRules : defaultRules;
        window.$(element).queryBuilder({ filters, rules });
    }

    // Called when new props are received by the QB component
    componentWillReceiveProps(newProps) {
        this.setState({ table: newProps.table, columns: newProps.columns, selectColumns: newProps.selectColumns });
        console.log(newProps.table + "==" + this.state.table + " = " + (newProps.table == this.state.table));
        if (newProps.table && newProps.columns && (newProps.table != this.state.table || newProps.columns != this.state.columns)) {
            const element = this.refs.queryBuilder;
            this.rebuildQueryBuilder(element, newProps.table, newProps.columns);
        }
    }

    // Destroys the old one, and creates a new QB based on the selected view's attributes
    rebuildQueryBuilder(element, table, columns, newRules) {
        window.$(this.refs.queryBuilder).queryBuilder('destroy');

        const rules = newRules ? newRules : defaultRules;
        const filters = lib.getQBFilters(table, columns);

        window.$(element).queryBuilder({ filters, rules });
    }

    // Returns true if what is an array object
    isArray(what) {
        return Object.prototype.toString.call(what) === '[object Array]';
    }

    recursiveRulesExtraction(condition, rules) {
        console.log("RULES  length = " + rules.length);
        let select = condition.toLowerCase() + "(";
        for (let i = 0; i < rules.length; i++) {
            // iterating over the first rules
            if (rules[i]['condition'] === "OR" || rules[i]['condition'] === "AND") {
                console.log("Recursing!");
                if (i == (rules.length - 1)) {
                    select += this.recursiveRulesExtraction(rules[i]['condition'], rules[i]['rules']);
                } else {
                    select += this.recursiveRulesExtraction(rules[i]['condition'], rules[i]['rules']) + ",";
                }
            } else {
                console.log("ADDING....");
                if (i == (rules.length - 1)) {
                    select += rules[i]['id'] + "." + lib.translateOperatorToPostgrest(rules[i]['operator']) + "." + rules[i]['value'];
                } else {
                    select += rules[i]['id'] + "." + lib.translateOperatorToPostgrest(rules[i]['operator']) + "." + rules[i]['value'] + ",";
                }
            }
        }
        select += ")"
        return select;
    }

    // Based on the extracted rules, it builds a PostgREST compliant URL for API call
    buildURL(rules) {
        let url = lib.getFromConfig("baseUrl") + "/" + this.state.table;

        // if it is valid, proceed
        if (rules && rules['valid'] && rules['valid'] === true) {
            url += "?"
        }

        if (rules && rules['valid'] && rules['valid'] === true) {
            let firstCondition = rules['condition'];
            let firstRules = rules['rules'];
            let conds = this.recursiveRulesExtraction(firstCondition + "=", firstRules);
            console.log("CONDITIONS = " + conds);
            url += conds;

            // Add SELECT columns... i.e. which columsn to retrieve
            url += "&select=" + this.state.selectColumns;
        } else {
            // Add SELECT columns... but this time, only selected columns, NO FILTERS
            url += "?select=" + this.state.selectColumns;
        }

        return url;
    }

    // Makes an API call to the PostgREST server specified in confic.json
    fetchOutput(url) {
        console.log("GET " + url);
        axios.get(url, { params: {} })
            .then((response) => {
                this.setState({
                    response: response.data
                });
                this.forceUpdate();
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    // Processes the raw jQB rules output, extracts rules, keeps only the 
    // relevant rules, and makes API call to get the requested information
    processRules(rules) {
        //console.log("Rules = " + JSON.stringify(rules));
        let url = this.buildURL(rules);

        if (url !== null) {
            this.fetchOutput(url);
        }

        return url;
    }

    // get data from QB and pass it as react component state
    handleGetRulesClick() {
        const rules = window.$(this.refs.queryBuilder).queryBuilder('getRules');
        this.setState({ rules: rules });
        this.forceUpdate();
    }

    // reinitialize jQuery Query Builder based on react state
    handleSetRulesClick() {
        // To Do: get rid of this...
        const newRules = lib.getQBRulesDELETEME();
        this.setState({ rules: newRules });
        window.$(this.refs.queryBuilder).queryBuilder('setRules', newRules);
    }

    // When user presses the submit button, makes the APi call
    handleSubmitClick() {
        let rules = window.$(this.refs.queryBuilder).queryBuilder('getRules');
        this.processRules(rules);
    }

    render() {
        return (
            <div>
                <div id='query-builder' ref='queryBuilder'/>
                <button onClick={this.handleSubmitClick.bind(this)} id="submit" className="submitButton btn-primary">Submit Query</button>
                <br/>
                <DataTable response={this.state.response} />
                <br/>
            </div>
        );
    }
};
