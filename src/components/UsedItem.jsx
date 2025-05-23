import { supabase } from "../supabase/supabase";
// import '../css/used.css'

const UsedItem=({used})=>{
    
    return (
        <div className="usedItem">
            <div>
                <img src={used.main_img} style={{width: "100px", height: "100px"}}/>
            </div>
            <h1>{used.title}</h1>
            <p>{used.content}</p>
        </div>
    );
}
export default UsedItem;