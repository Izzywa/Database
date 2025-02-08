import React from "react";
import Table from "./Table";

export default function VisitList(props) {
    const visitOrder = {
        'note': 'Notes'
    }
    return (
        <>
        <div>
            <button className="btn btn-info m-2">
                Add Note
            </button>
        </div>
        <div className="table-container">
        <Table tableOrder={visitOrder}
        tableList={props.visits}
        rowClickEvent={null}/>
        </div>
        </>
    )
}