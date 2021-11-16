import { ContactsOutlined } from "@material-ui/icons";
import React from "react";

const AvatorBox = (props) => {
    const id = props.id;
    return (
        <>
            <div onClick={() => props.onClick(id)}>
                <p>{id}</p>
            </div>
        </>
    );
}

export default AvatorBox;