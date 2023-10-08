import React from "react";
import "../css/Property.css"

const Property = (props) => {

    return (
        <div className="property">
            <h1 className="property-name">{props.name}</h1>
            <h2 className="property-address">{props.address}</h2>
        </div>
    );
}

export default Property;