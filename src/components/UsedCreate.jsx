import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabase";

const UsedCreate=()=>{
    const now=new Date().toISOString();
    const navigate=useNavigate()

    const [title, setTitle]=useState("");
    const [content, setContent]=useState("");
    const [price, setPrice]=useState("");

    // 메인 사진, 서브사진 4장 총 5장 업로드 가능
    const [files, setFiles]=useState([]);

    // type-> 4: 벼룩해요 5: 드림해요 6. 구해요 7. 공구해요
    const [category, setCategory]=useState("");

    const handleCreate=async (e)=>{
        e.preventDefault();

        const {data, error}=await supabase
        .from('trades')
        .insert([{
            title: title, 
            content: content, 
            price, 
            files, 
            category, 
            create_date: now, 
            update_date: now
        }])
        .select()
        if(error){
            console.log('error', error);
        }if(data){
            console.log(data)
            navigate('/거래');
        }
    }

    return (
        <div>
            생성페이지
        </div>
    );
}
export default UsedCreate;