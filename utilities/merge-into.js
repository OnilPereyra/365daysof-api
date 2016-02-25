module.exports = function mergeInto(destination, source) {
  const descriptors = Object
  .getOwnPropertyNames(source)
  .map( p => ({property: p, descriptor: Object.getOwnPropertyDescriptor(source, p)}) );

  descriptors.forEach( pd => Object.defineProperty(destination, pd.property, pd.descriptor) )

  return destination;
};
