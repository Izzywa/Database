import React from "react";

export default function allergiesList(props) {
    const [OfficialName, setOfficialName] = useState(true)
    return (
        <>
        {
            allergiesList.length == 0 ? <p>No Allergies</p>
            :
            <div className="py-2">
                <h6>Antibiotic {OfficialName ? 'Official Name' : 'Trade Name'}</h6>
                <Grid container>
                    {allergiesList.map((item, index) => {
                        return(
                            <Grid 
                            size={{ xs: 12, md: 6}}
                            key={index}
                            >
                                <p className="allergy-ab">
                                        - {String(item).charAt(0).toUpperCase()
                                        + String(item).slice(1)}</p>
                                </Grid>
                        )
                    })}
                </Grid>
                <Paginator
                count={numPages}
                page={page}
                changeHandler={handlePaginationChange}
                />
            </div>
        }
        <button 
        onClick={handleAllergyName}
        className="btn btn-info my-1">
            {OfficialName ? 'Trade Name': 'Official Name'}
        </button>
        </>
    )
}