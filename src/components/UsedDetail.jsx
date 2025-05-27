import { useParams } from "react-router-dom";

export function UsedDetail(){
    const {id}=useParams();

    return(
        <div>
            {id}번 제품 상세
        </div>
    );
}