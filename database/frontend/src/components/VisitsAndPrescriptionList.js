import React, { useEffect, useState } from "react";
import Paginator from "./Paginator";

export default function VisitsAndPrescriptionList(props) {
    const [page, setPage] = useState(1)
    const [numPages, setNumPages] = useState(1)
    const [vpList, setVpList] = useState([])

    useEffect(() => {
        fetch('/backend/vp/' + props.id + "?page=" + page)
        .then(response => {
            return response.json()
        }).then(result => {
            setVpList(result.result)
            setNumPages(result.num_pages)
        }).catch(error => console.log(error))
    }, [page])

    function NestedRow({item, row}) {
        if (item.length != 0) {
            return(
                <>
                <td>
                <table className="table table-sm">
                    <tbody>
                            {
                                item.map((newitem, newindex) => {
                                    return(
                                        <tr
                                        key={newindex}>
                                        <td>{newitem[row]}</td>
                                        </tr>
                                    )
                                })
                            }
                    </tbody>
                </table>
                </td>
                </>
            )
        } else {
            return <td>None</td>
        }
    }

    function handleMainRowClick(e) {
        const date = (e.target.closest("[data-date]").dataset.date)
        console.log(date)
    }

    return (
        <>
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Visits</th>
                        <th>Prescriptions</th>
                    </tr>
                </thead>
                <tbody className="tbody-vp">
                    {
                        vpList.map((item, index) => {
                            return(
                            <tr 
                            key={index}
                            data-date={item.date} 
                            onClick={handleMainRowClick}>
                                <td>
                                {item.date}</td>
                                <NestedRow item={item.visits} row={'note'}/>
                                <NestedRow item={item.prescription} row={'dose_str'}/>
                            </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
        <Paginator page={page}
        count={numPages}
        setPage={setPage}/>
        </>
    )
}