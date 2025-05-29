import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from "../supabase/supabase";
import UsedItem from './UsedItem';


export function UsedShare() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            let { data, error } = await supabase
                .from('trades')
                .select('*,categories(name), users(name)')
                .eq('category_id', 5)
                .eq('super_category_id', 3)
                .order('create_date', { ascending: false });
            if (error) {
                console.log("error: ", error);
                console.log("data: ", data);
            }
            if(data) {
                setPosts(data);
            }
        }
        fetchPosts();
    }, []);
    const handleCreate=()=>{
        navigate('/trade/write');
    }

    return (
        <div>
            <button onClick={handleCreate} style={{cursor: 'pointer'}}>글작성</button>
            {posts.map((used) => (
                <UsedItem key={used.id} used={used}>
                    {/* <img src={used.main_img} style={{ width: "100px" }} /> */}
                </UsedItem>
            ))}
            
        </div>
    );
}