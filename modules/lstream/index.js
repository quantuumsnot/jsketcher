import {CombineStream} from './combine';
import {StateStream} from './state';
import {Emitter} from './emitter';
import {FilterStream, MapStream} from './base';
import {ExternalStateStream} from './external';
import {MergeStream} from './merge';
import {NeverStream} from './never';
import {ConstantStream} from './constant';

export function stream() {
  return new Emitter();
}

export function combine(...streams) {
  return new CombineStream(streams);
}

export function merge(...streams) {
  return new MergeStream(streams);
}

export function state(initialValue) {
  return new StateStream(initialValue);
}

export function externalState(get, set) {
  return new ExternalStateStream(get, set);
}

export function never() {
  return NeverStream.INSTANCE;
}

export function constant(value) {
  return new ConstantStream(value);
}

export const map = (stream, fn) => new MapStream(stream, fn);

export const filter = (stream, predicate) => new FilterStream(stream, predicate);
 
export const merger = states => states.reduce((acc, v) => Object.assign(acc, v), {});
