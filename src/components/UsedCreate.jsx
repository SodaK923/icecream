import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabase";

const UsedCreate = () => {
    const now = new Date().toISOString();
    const navigate = useNavigate()

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [price, setPrice] = useState("");

    // 메인 사진, 서브사진 4장 총 5장 업로드 가능
    const [files, setFiles] = useState([]);

    // type-> 4: 벼룩해요 5: 드림해요 6. 구해요 7. 공구해요
    const [category, setCategory] = useState("");

    // input[type="file"]로 파일 선택 후
    const uploadFiles = async (file) => {
        const { data, error } = await supabase.storage
            .from('images') // 버킷 이름
            .upload(`folderName/${file.name}`, file)
        if (error) {
            console.log('업로드 실패:', error)
            return
        }
        console.log('업로드 성공:', data)
    }

    const handleCreate = async (e) => {
        e.preventDefault();
        const urls = await uploadFiles(files);
        const [main_img, detail_img1, detail_img2, detail_img3, detail_img4] = urls;


        const { data, error } = await supabase
            .from('trades')
            .insert([{
                title: title,
                content: content,
                price: Number(price),
                location: 'null',
                cnt: 0,
                likes: 0,
                main_img: main_img || null,
                detail_img1: detail_img1 || null,
                detail_img2: detail_img2 || null,
                detail_img3: detail_img3 || null,
                detail_img4: detail_img4 || null,
                category: Number(category),
                super_category: 3,
                limit_type: 'null',
                limit: 'null',
                state: 'null',
                create_date: now,
                update_date: now,
                sales_begin: 'null',
                sales_end: 'null'
            }])
            .select()
        if (error) {
            console.log('error', error);
        } if (data) {
            console.log(data)
            navigate('/거래');
        }
    }

    return (
        <div>
            <form onSubmit={handleCreate}>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">카테고리 선택</option>
                    <option value="4">벼룩해요</option>
                    <option value="5">드림해요</option>
                    <option value="6">구해요</option>
                    <option value="7">공구해요</option>
                </select>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" />
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="내용" />
                <input value={price} onChange={e => setPrice(e.target.value)} placeholder="가격" />
                {/* <input
                    type="file"
                    multiple
                    onChange={e => setFiles(Array.from(e.target.files))}
                /> */}


                <button type="submit">등록</button>
            </form>
        </div>
    )
}
export default UsedCreate;