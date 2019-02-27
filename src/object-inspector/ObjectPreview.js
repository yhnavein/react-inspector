import React from 'react';
import PropTypes from 'prop-types';

import ObjectValue from '../object/ObjectValue';
import ObjectName from '../object/ObjectName';

import { hasOwnProperty } from '../utils/objectPrototype';

/* NOTE: Chrome console.log is italic */
const styles = {
  objectDescription: {
    fontStyle: 'italic',
  },
  preview: {
    fontStyle: 'italic',
  },
};

/* intersperse arr with separator */
function intersperse(arr, sep) {
  if (arr.length === 0) {
    return [];
  }

  return arr.slice(1).reduce((xs, x) => xs.concat([sep, x]), [arr[0]]);
}

/**
 * A preview of the object
 */
const ObjectPreview = ({ data, maxProperties = 5 }) => {
  const object = data;

  if (
    typeof object !== 'object' ||
    object === null ||
    object instanceof Date ||
    object instanceof RegExp
  ) {
    return <ObjectValue object={object} />;
  }

  if (Array.isArray(object)) {
    const previewArray = object
      .slice(0, maxProperties)
      .map((element, index) => <ObjectValue key={index} object={element} />);
    if (object.length > maxProperties) {
      previewArray.push(<span key="ellipsis">…</span>);
    }
    const arrayLength = object.length;
    return (
      <React.Fragment>
        <span style={styles.objectDescription}>
          {arrayLength === 0 ? `` : `(${arrayLength})\xa0`}
        </span>
        <span style={styles.preview}>[{intersperse(previewArray, ', ')}]</span>
      </React.Fragment>
    );
  } else {
    let propertyNodes = [];
    for (let propertyName in object) {
      const propertyValue = object[propertyName];
      if (hasOwnProperty.call(object, propertyName)) {
        let ellipsis;
        if (
          propertyNodes.length === maxProperties - 1 &&
          Object.keys(object).length > maxProperties
        ) {
          ellipsis = <span key={'ellipsis'}>…</span>;
        }
        propertyNodes.push(
          <span key={propertyName}>
            <ObjectName name={propertyName || `""`} />
            :&nbsp;
            <ObjectValue object={propertyValue} />
            {ellipsis}
          </span>
        );
        if (ellipsis) break;
      }
    }

    const objectConstructorName = object.constructor ? object.constructor.name : 'Object';

    return (
      <React.Fragment>
        <span style={styles.objectDescription}>
          {objectConstructorName === 'Object' ? '' : `${objectConstructorName} `}
        </span>
        <span style={styles.preview}>
          {'{'}
          {intersperse(propertyNodes, ', ')}
          {'}'}
        </span>
      </React.Fragment>
    );
  }
};

ObjectPreview.propTypes = {
  /**
   * max number of properties shown in the property view
   */
  maxProperties: PropTypes.number,
};

export default ObjectPreview;
