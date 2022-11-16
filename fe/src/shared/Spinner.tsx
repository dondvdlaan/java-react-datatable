export const Spinner = (props: {item: String}) => {

    return(
        <div className="d-flex m-5">
            <span>Loading {props.item} </span> 
            <div className="spinner-border " role="status">
            </div>
        </div>

    )
}