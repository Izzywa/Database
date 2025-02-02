import React from "react";
import Pagination from '@mui/material/Pagination';

export default function Paginator(props) {
    return(
        <div className="my-2">
            <Pagination 
            showFirstButton 
            showLastButton
            siblingCount={0}
            boundaryCount={2}
            onChange={props.changeHandler}
            size="small"
            page={props.page}
            count={props.count} 
            color="primary" />
        </div>
    )
}