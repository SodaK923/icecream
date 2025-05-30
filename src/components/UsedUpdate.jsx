import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/supabase";
import { useImage } from "../hooks/useImage";
//import { getUser } from '../utils/getUser';
import { useUserTable } from "../hooks/useUserTable";
import { useRegion } from "../hooks/useRegion";

export function UsedUpdate() {
    const now = new Date().toISOString();
    const navigate = useNavigate();
    const { item } = useParams();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [price, setPrice] = useState("");
    const [exPics, setExPics] = useState([]);


    // type-> 4: 벼룩해요 5: 드림해요 6. 구해요 7. 공구해요
    const [category, setCategory] = useState("");

    // useImage 훅
    const { images, setImages, getImages } = useImage();
    const [fileCount, setFileCount] = useState(0);

    // useUserTable 훅
    const { info: userInfo, loading, error } = useUserTable();

    const { city, district } = useRegion();
    const location = `${city} ${district}`;


    useEffect(() => {
        console.log("userInfo:", userInfo, "loading:", loading);
        if (!userInfo && !loading) {
            alert('로그인해야 글작성이 가능합니다.');
            navigate('/login');
        }
    }, [loading, userInfo]);


    // 드림해요-> 가격 내용 비움
    useEffect(() => {
        if (category === "5") setPrice("");
    }, [category]);


    // 기존 내용 불러옴
    useEffect(() => {
        const fetchForm = async () => {
            const { data, error } = await supabase
                .from('trades')
                .select('*, categories(name)')
                .eq('id', item)
                .single();
            if (error) {
                console.log("error: ", error);
                console.log("data: ", data);
            }
            if (data) {
                setTitle(data.title)
                setContent(data.content)
                setPrice(data.price),
                    setCategory(String(data.category_id)),
                    // ↓↓↓ 기존 이미지들 배열로 만듦
                    setExPics([
                        data.main_img,
                        data.detail_img1,
                        data.detail_img2,
                        data.detail_img3,
                        data.detail_img4
                    ].filter(Boolean)); // 비어있는 건 빼고
            }
        }
        fetchForm();
    }, [item]);



    // fileCount: 사용자가 < input type = "file" multiple > 에서 고른 파일의 개수
    // images.length: 실제로 서버에 업로드 끝난 이미지 개수(useImage 훅에서 관리)
    // 이미지 업로드 개수 제한 함수
    const handleFileChange = (e) => {
        const files = e.target.files;
        console.log(files);
        if (files.length > 5) {
            alert("사진은 최대 5장까지만 업로드할 수 있습니다.");
            e.target.value = ""; // 선택 취소
            return;
        }

        setFileCount(files.length);
        setImages(e); // 기존대로
        setExPics([]);
    }


    const handleUpdate = async (e) => {
        e.preventDefault();

        // if (loading) {
        //     alert("유저 정보를 불러오는 중입니다. 잠시만 기다려 주세요.");
        //     return;
        // }
        if (!userInfo) {
            alert("로그인해야 글작성이 가능합니다.");
            navigate('/login');
            return;

        }

        if (!category) {
            alert("카테고리를 선택해주세요.");
            return;
        }
        if (!title || !content) {
            alert("제목과 내용을 모두 작성해주세요.");
            return;
        }
        if (category !== "5" && !price) { // '나눔' 아니면 가격 필요
            alert("가격을 입력해주세요.");
            return;
        }

        const { data, error } = await supabase
            .from('trades')
            .update({
                title,
                content,
                price: category === "5" ? 0 : Number(price),
                category_id: Number(category),
                main_img: images[0] ? getImages(images[0]) : null,
                detail_img1: images[1] ? getImages(images[1]) : null,
                detail_img2: images[2] ? getImages(images[2]) : null,
                detail_img3: images[3] ? getImages(images[3]) : null,
                detail_img4: images[4] ? getImages(images[4]) : null
                //update_date: now,
                //location
            })
            .eq('id', item)
            .select();
        if (error) {
            console.log('error', error);
        } if (data) {
            //console.log(data)
            // todo: 글작성한 카테고리로 자동 이동하게 하기
            navigate('/trade/sell');
        }
    }


    return (
        <div>
            <form>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">카테고리 선택</option>
                    <option value="4">벼룩해요</option>
                    <option value="5">드림해요</option>
                    <option value="6">구해요</option>
                    {/* <option value="7">공구해요</option> */}
                </select>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" />
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="내용" />
                <input
                    value={category === "5" ? 0 : price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder={category === "5" ? "나눔" : "가격"}
                    disabled={category === "5"}
                />
                <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                {/* 사용자가 선택한 이미지와 업로드된 이미지 개수가 같아야함 */}
                {fileCount !== images.length && (
                    <div>이미지 업로드 중입니다...</div>
                )}
                {/* 기존이미지 업로드 */}
                <div>
                    {exPics.length > 0 ? (
                        exPics.map((img, i) => (
                            <img key={i} src={img} alt={`기존 이미지 ${i + 1}`} style={{ width: '100px' }} />
                            // src={getImages(img)}가 아니라, DB에 URL이 저장돼 있으면 그냥 img만
                            // 만약 DB에는 상대경로만 있으면 src={getImages(img)}
                        ))
                    ) : (
                        <div>기존 이미지 없음</div>
                    )}
                </div>

                {/* 업로드하는 사진 보여줌 */}
                {/* <div>
                    {images.length > 0 && images.map((img, idx) => (
                        <img key={idx} src={getImages(img)} alt={`이미지${idx + 1}`} style={{ width: 100, height: 100 }} />
                    ))}
                </div> */}
                {/* 파일 개수가 맞을 때까지 등록버튼 꺼짐 */}
                {/* <button onClick={handleCreate} disabled={fileCount !== images.length || images.length === 0}>등록</button> */}
                <button onClick={handleUpdate}>수정</button>
            </form>
        </div>
    )
}
