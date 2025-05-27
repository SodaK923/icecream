import { useParams } from "react-router-dom";

export function UsedDetail(){
    const {item}=useParams();

    return(
        <div>
            {item}번 제품 상세
        </div>
    );
}