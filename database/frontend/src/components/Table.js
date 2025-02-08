import React, {Fragment} from "react";


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
                            <table className="table table-sm">
                                <tbody>
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
                            const colSpan = Object.keys(props.tableOrder).length
                            return (
                                <Fragment key={key}>
                                <tr
                                onClick={props.rowClickEvent} 
                                data-id={item.id}>
                                    <TableRow item={item}/>
                                    {
                                        item.deleted == 1 ? 
                                        <td style={{color: "red"}}> Marked as deleted</td>
                                        :null
                                    }
                                </tr>
                                </Fragment>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}