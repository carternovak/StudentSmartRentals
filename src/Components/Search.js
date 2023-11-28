import React from "react";
import { Form, InputGroup } from "react-bootstrap";

function Search({
  searchQuery,
  handleSearchInputChange,
  searchResults,
  handleKeyPress,
  placeholderText,
}) {
  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleKeyPress();
    }
  };
  return (
    <Form>
      <InputGroup className="w-100">
        <Form.Control
          type="text"
          onChange={handleSearchInputChange}
          placeholder={placeholderText ? placeholderText : "Search apartments"}
          value={searchQuery}
          className="w-100"
          onKeyDown={onKeyDown}
        />
      </InputGroup>
    </Form>
  );
}

export default Search;
