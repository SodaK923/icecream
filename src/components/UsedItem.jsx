import { supabase } from "../supabase/supabase";
import { Link } from "react-router-dom";
// import '../css/used.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Container, Row, Col, Card, Spinner, Alert, Carousel, Button, Badge } from 'react-bootstrap';

export function UsedItem({ used }){

    return (
        <Link to={`/trade/${used.id}`} className="text-decoration-none">
        <Container className="mt-3">
            <Card className="rounded-4 p-3">
                <Row className="gy-4 align-items-center">  {/* 세로 가운데 정렬 */}
                    {/* 왼쪽: 이미지 */}
                    <Col md={2} xs={12} className="text-center">
                        <img src={used.main_img} alt="thumnail" className="rounded" style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover',
                            objectPosition: 'center'
                        }} />
                    </Col>
                    {/* 오른쪽: 글씨 */}
                    <Col md={10} xs={12}>
                        <p className="text-muted mb-1">글쓴이: {used.users.name}</p>
                        <p className="text-muted mb-1">{used.categories?.name}</p>
                        <h4 className="fw-bold mb-1 mt-2">{used.title}</h4>
                        <p className="mb-2">{used.content}</p>
                        <p className="mb-0">
                            {used.category_id === 5 ? (
                                <span className="badge bg-success">나눔</span>
                            ) : (
                                <span>{Number(used.price).toLocaleString()}원</span>
                            )}
                        </p>
                    </Col>

                </Row>
            </Card>
        </Container>
        </Link>
    );
}
export default UsedItem;

// return (
//     <Container className="mt-3">
//         <Card className="rounded-4 p-4">
//             <Row className="gy-4">
//                 <Col md={6}>
//                     <p>{used.categories?.name}</p>
//                     <div>
//                         <img src={used.main_img} style={{ width: "100px"}} />
//                     </div>
//                     <h4>{used.title}</h4>
//                     <p>{used.content}</p>
//                     <p>{used.category_id===5 ? (<span>나눔</span>):(<span>{used.price}원</span>)}</p>
//                     {/* <p>{used.create_date}</p> */}
//                     {/* <p>{used.likes}</p> */}
//                 </Col>
//             </Row>
//         </Card>
//     </Container>
// );
