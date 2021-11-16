import React from "react";
import { Box } from "@material-ui/core";

const AvatorBox = (props) => {
    const id = props.id;

    return (
        <Box onClick={() => props.onClick(id)}>
            <p>{id}</p>
        </Box>
    );
}

export default AvatorBox;