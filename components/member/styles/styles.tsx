export const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'black',
      color: 'white',
      borderColor: 'gray',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'white',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'black',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#333' : 'black',
      color: 'white',
      cursor: 'pointer',
    }),
  };