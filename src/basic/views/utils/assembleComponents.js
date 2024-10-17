export const assembleComponents = (parent, ...components) => {
  components.forEach((component) => parent.appendChild(component));
};
