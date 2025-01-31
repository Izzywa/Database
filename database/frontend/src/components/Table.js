import React from "react";

export default function Table(props) {

    function TableRow({item}){
        return(
            <>
            {
                Object.entries(props.tableOrder)
                .map( ([key, value]) => <td key={key}>{item[key]}</td>)
            }
            </>
        )
    }
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                    {
                        Object.entries(props.tableOrder)
                        .map( ([key, value]) => <th key={key}> {value}</th>)
                    }
                    </tr>
                </thead>
                <tbody>
                    {
                        props.tableList.map((item, key) => {
                            return (
                                <tr key={key} onClick={props.rowClickEvent} data-id={item.id}>
                                    <TableRow item={item}/>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}