import React from "react";

export default function Table(props) {

    function TableRow({item}){
        return(
            <>
            {
                Object.entries(props.tableOrder)
                .map( ([key, value]) => {
                    if (item[key] !== null && item[key].map) {
                        return (
                            <td key={key}>
                            <table><tbody>
                            {
                                item[key].map((newitem, newkey) => {
                                    return(
                                        <tr key={newkey}>
                                        <td>{newitem}</td>
                                        </tr>
                                    )
                                })
                                }
                                </tbody>
                                </table>
                                </td>
                        )
                        
                    } else {
                        return(
                        <td key={key}>{item[key]}</td>
                        )
                    }
            })
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