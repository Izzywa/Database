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

    return (
        <>
        <div className="table-container">
        {
            vpList.map((item, index) => {
                return(
                    <p key={index}> {item.date}</p>
                )
            })
        }
        </div>
        <Paginator page={page}
        count={numPages}
        setPage={setPage}/>
        </>
    )
}