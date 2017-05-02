import React from 'react';

let lib = require('../utils/library.js');

const defaultRules = lib.getQBRules();

function initializeQueryBuilder(element, newRules) {
    const filters = lib.getQBFilters();
    const rules = newRules ? newRules : defaultRules;
    window.$(element).queryBuilder({ filters, rules });
}

export default class QueryBuilderWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rules: {}
        };
    }
    componentDidMount() {
        const element = this.refs.queryBuilder;
        initializeQueryBuilder(element);
    }

    componentWillUnmount() {
        window.$(this.refs.queryBuilder).queryBuilder('destroy');
    }
    shouldComponentUpdate() {
            return false;
        }
        // get data from jQuery Query Builder and pass to the react component
    handleGetRulesClick() {
            const rules = window.$(this.refs.queryBuilder).queryBuilder('getRules');
            this.setState({ rules: rules });
            this.forceUpdate();
        }
        // reinitialize jQuery Query Builder based on react state
    handleSetRulesClick() {
        const newRules = {...defaultRules };
        newRules.rules[0].value += 10;
        window.$(this.refs.queryBuilder).queryBuilder('setRules', newRules);
        this.setState({ rules: newRules });
    }

    render() {
        return (
            <div>
                <div id='query-builder' ref='queryBuilder'/>
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
                    {JSON.stringify(this.state.rules, undefined, 2)}
                </pre>
            </div>
        );
    }
};
