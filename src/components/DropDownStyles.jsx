import React from 'react';

var colourMap = (propParams) => ({
  caretColor: propParams.selectProps.theme.minorhighlights,
  backgroundColor: propParams.selectProps.theme.background,
  // border: '1px solid #00f562',
  color: propParams.selectProps.theme.backgroundColor,
});

var borderMap = (propParams) => ({
  border: '1px solid ' + propParams.selectProps.theme.highlight,
  borderRadius: '0px',
});
const DropDownStyles = {
  clearIndicator: (p, t) => ({ ...p, ...colourMap(t) }),
  container: (p, t) => ({ ...p, ...colourMap(t) }),
  control: (p, t) => ({ ...p, ...colourMap(t), ...borderMap(t) }),
  dropdownIndicator: (p, t) => ({ ...p, ...colourMap(t) }),
  group: (p, t) => ({ ...p, ...colourMap(t) }),
  groupHeading: (p, t) => ({ ...p, ...colourMap(t) }),
  indicatorsContainer: (p, t) => ({ ...p, ...colourMap(t), ...borderMap(t) }),
  indicatorSeparator: (p, t) => ({ ...p, ...colourMap(t) }),

  loadingIndicator: (p, t) => ({ ...p, ...colourMap(t) }),
  loadingMessage: (p, t) => ({ ...p, ...colourMap(t) }),
  menu: (p, t) => ({ ...p, ...colourMap(t), ...borderMap(t) }),
  menuList: (p, t) => ({ ...p, ...colourMap(t) }),
  menuPortal: (p, t) => ({ ...p, ...colourMap(t) }),
  multiValue: (p, t) => ({ ...p, ...colourMap(t) }),
  multiValueLabel: (p, t) => ({ ...p, ...colourMap(t) }),
  multiValueRemove: (p, t) => ({ ...p, ...colourMap(t) }),
  noOptionsMessage: (p, t) => ({ ...p, ...colourMap(t) }),
  option: (p, t) => ({ ...p, ...colourMap(t) }),
  placeholder: (p, t) => ({ ...p, ...colourMap(t) }),
  singleValue: (p, t) => ({ ...p, ...colourMap(t) }),
  valueContainer: (p, t) => ({ ...p, ...colourMap(t) }),
  input: (p, t) => ({
    ...p,
    ...colourMap(t),
    backgroundColor: null,
    border: null,
  }),
};

export default DropDownStyles;
export {DropDownStyles}
