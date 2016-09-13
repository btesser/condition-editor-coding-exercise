import React from 'react';
import {isEqual, isGreaterThan, isLessThan, hasAnyValue, hasNoValue, isAnyOf, contains} from './filters.jsx';
import * as datastore from '../../datastore';
const properties = datastore.getProperties();
const products = datastore.getProducts();
const operators = datastore.getOperators();

const typeOperators = {
  string: [
    'any',
    'none',
    'in',
    'contains'
  ],
  number: [
    'greater_than',
    'less_than',
    'any',
    'none'
  ],
  enumerated: [
    'any',
    'none',
    'in'
  ]
}
export default class DataTable extends React.Component {
  componentWillMount() {
    this.setState({products});
  }
  getOnChangeSelect = (id, type) => {
    return (event) => {
      this.onChangeSelect(event, id, type);
    };
  }
  onChangeSelect = ({target: {value}}, property_id, type) => {
    this.formValues[property_id] = {property: value, value: this.formValues[property_id].value, type};
    this.filter();
  };

  onChangeText = ({target: {value}}, property_id, type) => {
    this.formValues[property_id] = {property: this.formValues[property_id].property, value, type};
    console.log(this.formValues[property_id]);
    this.filter();
  };
  getOnChangeText = (id, type) => {
    return (event) => {
      this.onChangeText(event, id, type);
    }
  }
  formValues = properties.map(({type}) => {
    return {property: '', value: '', type};
  });

  filter() {
    const toReturn = [];

    products.forEach((product) => {
      let isEvery = this.formValues.every(({property, value, type}, i) => {
        const propVal = product.properties[i] && product.properties[i].value;
        switch (property) {
          case undefined:
            return true;
          case 'equals':
            return isEqual(propVal, value);
          case 'greater_than':
            return isGreaterThan(propVal, value);
          case 'less_than':
            return isLessThan(propVal, value);
          case 'any':
            return hasAnyValue(propVal);
          case 'none':
            return hasNoValue(propVal);
          case 'in':
            return isAnyOf(propVal, value);
          case 'contains':
            return contains(propVal, value);
          default:
            return true;
        }
      });
      if (isEvery) {
        toReturn.push(product);
      }
    });

    this.setState({products: toReturn});
    return toReturn;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>{
            properties.map(({id, name}) => (
              <th key={id}>{name}</th>
            ))
          }</tr>
          <tr>{
            properties.map(({id, name, type}) => {
                return (
                  <th><select onChange={this.getOnChangeSelect(id, type)}>
                    <option name="Empty" value="">-----</option>
                  {
                    typeOperators[type].map((id) => {
                      const {text} = datastore.getOperator(id);

                      return (
                        <option name={text} value={id}>{text}</option>
                    );
                  }
                  )
                  }</select>
                  <input type="text" onChange={this.getOnChangeText(id, type)}
                  />
                  </th>
                );
            })
          }
          </tr>
        </thead>
        <tbody>
          {
            this.state.products.map(product => (
              <tr>{
                product.properties.map(({property_id}) => (
                  <td key={`${product.id}-${property_id}`}>{product.properties[property_id].value}</td>
                ))
              }</tr>
            ))
          }
        </tbody>
      </table>
    );
  }
}
