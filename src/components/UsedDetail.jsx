import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabase";
import { Carousel } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export function UsedDetail() {
    const { item } = useParams();
    const navigate = useNavigate();

    const [detail, setDetail] = useState(null);
    //const { info: userInfo } = useUserTable();

    // 아이템 가져옴
    useEffect(() => {
        const fetchDetails = async () => {
            const { data, error } = await supabase
                .from('trades')
                .select('*, users(name)')
                .eq('id', item)
                .single();
            if (error) {
                console.log('error: ', error);
            }
            if (data) {
                setDetail(data);
            }
        }
        fetchDetails();
    }, [item]);


    // 조회수 증가
    useEffect(() => {
        if(!item) return;
        const increaseView = async () => {
            const { data, error } = await supabase
                .from('trades')
                .select('cnt')
                .eq('id', item)
                .single();
            if (error) {
                console.log('increaseView error: ', error);
                return;
            }
            if (data) {
                // 조회수 증가
                await supabase
                    .from('trades')
                    .update({ cnt: data.cnt + 1 })
                    .eq('id', item);
                
                // 증가된 조회수 반영
                const {data: updateData} = await supabase
                .from('trades')
                .select('*, users(name)')
                .eq('id', item)
                .single()
                if(updateData){
                    setDetail(updateData);
                }
            }
        }
        increaseView();
    }, [item]);


    // 글 삭제
    const deleteDetails = async () => {
        // 취소(false)를 눌러야 true가 되므로 !confirm
        if(!confirm('게시글을 삭제할까요?')) {
            return;
        }
        const { data, error } = await supabase
            .from('trades')
            .delete()
            .eq('id', item)
            .select();
        if (error) {
            alert('삭제에 실패했습니다.');
            console.log('delete error', error);
        }
        if (data) {
            alert('게시글이 삭제되었습니다.');
            navigate('/trade');
        }
    }

    // todo: 글 수정
    const handleUpdate=()=>{
        navigate('update');
    }

    if (!detail) return <div>로딩중</div>;

    const images = [detail.main_img, detail.detail_img1, detail.detail_img2, detail.detail_img3, detail.detail_img4].filter(Boolean);


    // 날짜 계산
    const getDateDiff = (date) => {
        const created = new Date(date);
        created.setHours(created.getHours() + 9);
        const now = new Date();
        const diffMs = now - created; // 밀리초 차이
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffDay > 0) return `${diffDay}일 전`;
        if (diffHour > 0) return `${diffHour}시간 전`;
        if (diffMin > 0) return `${diffMin}분 전`;
        return "방금 전";
    }

    return (
        <div>
            <div style={{ maxWidth: "500px" }}>
                <Carousel>
                    {images.length === 0 ? (
                        <Carousel.Item>
                            <div className="text-center p-5">이미지가 없습니다.</div>
                        </Carousel.Item>
                    ) : (
                        images.map((img, idx) => (
                            <Carousel.Item key={idx}>
                                <img
                                    src={img}
                                    alt={`상세 이미지 ${idx + 1}`}
                                    className="d-block mx-auto"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "1rem"
                                    }}
                                />
                            </Carousel.Item>
                        ))
                    )}
                </Carousel>
            </div>
            <div>
                <div>{getDateDiff(detail.create_date)}</div>
                <div>제목: {detail.title}</div>
                <div>내용: {detail.content}</div>
                <div>작성자: {detail.users?.name ?? '알 수 없음'}</div>
                <div>조회수: {detail?.cnt ?? 0}</div>
                <div>
                    {detail.category_id === 5 ? (<div>나눔</div>) : (<div>{Number(detail.price).toLocaleString()}원</div>)}
                </div>
            </div>
            <button onClick={handleUpdate}>글수정</button>
            <button onClick={deleteDetails}>삭제</button>
        </div>
    );
} 
