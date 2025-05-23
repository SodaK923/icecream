import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from "../supabase/supabase";
import UsedItem from './UsedItem';


export function Trade() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            let { data, error } = await supabase
                .from('trades')
                .select('*,categories(name)');
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

    return (
        <div>
            <div>
                <Link to={'/거래/글작성'}>글작성</Link>
            </div>
            {posts.map((used) => (
                <UsedItem key={used.id} used={used}>
                    {/* <img src={used.main_img} style={{ width: "100px" }} /> */}
                </UsedItem>
            ))}
            
        </div>
    );
}