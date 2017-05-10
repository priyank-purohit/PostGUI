import React from 'react';
import axios from 'axios';

let lib = require('../utils/library.js');

const defaultRules = lib.getQBRules();

export default class QueryBuilderWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rules: {},
            table: this.props.table,
            columns: this.props.columns
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
        this.setState({ table: newProps.table, columns: newProps.columns });
        if (newProps.table && newProps.columns) {
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

    isArray(what) {
        return Object.prototype.toString.call(what) === '[object Array]';
    }

    // this whole method will be redone when OR and complex logic is possible...
    extractRules(rules) {
        let plainArray = [];
        if (!this.isArray(rules)) {
            for (let key in rules) {
                if (rules.hasOwnProperty(key)) {
                    let val = rules[key];
                    if (key === "id") {
                        plainArray.push([rules['id'], rules['operator'], rules['value']]);
                    } else if (key === "rules") {
                        plainArray.push(this.extractRules(rules[key]));
                    }
                }
            }
        } else {
            for (let i = 0; i < rules.length; i++) {
                plainArray.push(this.extractRules(rules[i]));
            }
        }
        return plainArray;
    }

    flatten(array, mutable) {
        var toString = Object.prototype.toString;
        var arrayTypeStr = '[object Array]';

        var result = [];
        var nodes = (mutable && array) || array.slice();
        var node;

        if (!array.length) {
            return result;
        }

        node = nodes.pop();

        do {
            if (toString.call(node) === arrayTypeStr) {
                nodes.push.apply(nodes, node);
            } else {
                result.push(node);
            }
        } while (nodes.length && (node = nodes.pop()) !== undefined);

        result.reverse(); // we reverse result to restore the original order
        return result;
    }

    buildURL(rules) {
        console.log(JSON.stringify(rules));
        let url = lib.getFromConfig("baseUrl") + "/" + this.state.table + "?";
        for (let i = 0; i < rules.length; i = i + 3) {
            url += rules[i] + "=" + lib.translateOperatorToPostgrest(rules[i + 1]);
            if (rules[i + 2] != null) {
                url += "." + rules[i + 2];
            }
            if (i !== (rules.length - 3)) {
                url += "&";
            }
        }
        return url;
    }

    fetchOutput(url) {
        console.log("Making HTTP request to get url = " + url);
        axios.get(url, { params: {} })
            .then((response) => {
                console.log("RESPONSE = " + JSON.stringify(response.data));
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    processRules(rules) {
        let extractedRules = this.extractRules(rules);
        let flattenedRules = this.flatten(extractedRules);
        let url = this.buildURL(flattenedRules);

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

    handleSubmitClick() {
        let rules = window.$(this.refs.queryBuilder).queryBuilder('getRules');
        console.log(JSON.stringify(this.processRules(rules)));
    }

    render() {
        return (
            <div>
                <div id='query-builder' ref='queryBuilder'/>
                <button onClick={this.handleSubmitClick.bind(this)} id="submit" className="submitButton btn-primary">Submit</button>
                <div className='row'>
                    <div className='col-md-4'>
                        <button className='btn btn-success' onClick={this.handleGetRulesClick.bind(this)}>GET RULES FROM QUERY BUILDER</button>
                    </div>
                    <div className='col-md-4'>
                        <button className='btn btn-success' onClick={this.handleSetRulesClick.bind(this)}>SET RULES FROM REACT</button>
                    </div>
                </div>
                <pre>
                    Component state:
                    {JSON.stringify(this.state.rulesClean, undefined, 2)}
                </pre>
            </div>
        );
    }
};
