import {ENTITIES} from '../scene/entites';

export default function validateParams(services, params, schema, errors, parentPath) {

  errors = errors || [];
  parentPath = parentPath || ROOT_PATH; 

  for (let field of Object.keys(schema)) {
    let md = schema[field];
    if (!md) {
      continue;
    }
    let value = params[field];
    if (value === undefined) {
      if (!md.optional) {
        errors.push({path: [...parentPath, field], message: 'required'});
      }
    } else {
      if (md.type === 'number') {
        if (typeof value !== 'number') {
          errors.push({path: [...parentPath, field], message: 'not a number type'});
        } else {
          if (md.min !== undefined ) {
            if (value < md.min) {
              errors.push({path: [...parentPath, field], message: 'less than allowed'});
            }
          }
          if (md.max !== undefined ) {
            if (value > md.max) {
              errors.push({path: [...parentPath, field], message: 'greater than allowed'});
            }
          }
        }
      } else if (md.type === 'string') {
        if (typeof value !== 'string') {
          errors.push({path: [...parentPath, field], message: 'not a string type'});
        }
      } else if (md.type === 'enum') {
        if (md.values.indexOf(value) === -1) {
          errors.push({path: [...parentPath, field], message: 'invalid value'});
        }
      } else if (ENTITIES.indexOf(md.type) !== -1) {
        if (typeof value !== 'string') {
          errors.push({path: [...parentPath, field], message: 'not a valid model reference'});
        }
        let ref = value.trim();
        if (!ref && !md.optional) {
          errors.push({path: [...parentPath, field], message: 'required'});
        }
        let model = services.cadRegistry.findEntity(md.type, ref);
        if (!model) {
          errors.push({path: [...parentPath, field], message: 'referrers to nonexistent ' + md.entity});
        }
      } else if (md.type === 'array') {
        if (!Array.isArray(value)) {
          errors.push({path: [...parentPath, field], message: 'not an array type'});
        }
        value.forEach((item , i) => {
          validateParams(services, item, md.schema, errors, [...parentPath, i]);
        });
      }
    }
    return errors;
  }
}

const ROOT_PATH = [];