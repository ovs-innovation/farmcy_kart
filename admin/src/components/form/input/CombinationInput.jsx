import { Input } from "@windmill/react-ui";
import React from "react";

const CombinationInput = ({
  id,
  value,
  name,
  variant,
  readOnly,
  isBulkUpdate,
  placeholder,
  handleQuantityPrice,
}) => {
  return (
    <>
      {isBulkUpdate && (
        <Input
          onChange={handleQuantityPrice}
          disabled={readOnly}
          value={value || 0}
          type="number"
          name={name}
          min="0"
          onKeyDown={(e) => (e.key === '-' || e.key === 'e' || (name === 'quantity' && e.key === '.')) && e.preventDefault()}
          pattern="^[0-9]+$"
          placeholder={placeholder}
          className={`mx-1 h-8 w-18 md:w-20 lg:w-20 p-2`}
        />
      )}
      {!isBulkUpdate && (
        <Input
          onBlur={(e) => handleQuantityPrice(e.target.value, name, id, variant)}
          disabled={readOnly}
          defaultValue={value}
          type="number"
          name={name}
          min="0"
          onKeyDown={(e) => (e.key === '-' || e.key === 'e' || (name === 'quantity' && e.key === '.')) && e.preventDefault()}
          pattern="^[0-9]+$"
          placeholder={placeholder}
          className={`mx-1 h-8 w-18 md:w-20 lg:w-20 p-2`}
        />
      )}
    </>
  );
};

export default CombinationInput;
