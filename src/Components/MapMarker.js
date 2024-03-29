import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: #000;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  &:hover {
    z-index: 1;
  }
`;

const MapMarker = ({ text, onClick }) => (
    <div className='easy-to-find'>
  <Wrapper
    alt={text}
    onClick={onClick}
  />
  </div>
);

MapMarker.defaultProps = {
  onClick: null,
};

MapMarker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default MapMarker;