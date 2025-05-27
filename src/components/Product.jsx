import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import { Container, Row, Col, Card, Spinner, Alert, Carousel, Button, Badge } from 'react-bootstrap';
import { useUserTable } from "../hooks/useUserTable";

export function Product() {
  const user = useUserTable();
  const currentUserId = user?.info?.id ?? null;
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productUser, setProductUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false); // 좋아요 눌렀는지 여부
  const [isLiking, setIsLiking] = useState(false); // 처리 중 여부

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const { data: productData, error: productError } = await supabase
          .from('trades')
          .select('*')
          .eq('id', id)
          .single();

        if (productError || !productData) {
          setError('상품을 불러오는 데 실패했습니다.');
          return;
        }

        setProduct(productData);

        await supabase.rpc('increment_view_count', { trade_id: parseInt(id) });

        if (productData.users) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', productData.users)
            .single();

          if (!userError) {
            setProductUser(userData);
          }
        }
/*
        // 좋아요 상태 체크
        const { data: likedData } = await supabase
          .from('likes')
          .select('id')
          .eq('type', productData.category)
          .eq('type_id', productData.id)
          .eq('users', currentUserId);

        setIsLiked(likedData.length > 0);
        */
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('데이터를 불러오는 도중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
        
    };

    fetchProduct(); // 반드시 호출 필요!
  }, [id]);


  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
  if (!product) return <Alert variant="warning" className="mt-5 text-center">상품 정보가 없습니다.</Alert>;

  const detailImages = [product.detail_img1, product.detail_img2, product.detail_img3, product.detail_img4].filter(Boolean);

  const handleLikeToggle = async () => {
    if (!product) return;
    setIsLiking(true);

    try {
      if (isLiked) {
        // 좋아요 취소
        await supabase
          .from('likes')
          .delete()
          .eq('type', product.category)
          .eq('type_id', product.id)
          .eq('users', currentUserId);

        const { data: updatedProduct } = await supabase
          .from('trades')
          .update({ likes: product.likes - 1 })
          .eq('id', product.id)
          .select()
          .single();

        setProduct(updatedProduct);
        setIsLiked(false);
      } else {
        // 좋아요 추가
        await supabase
          .from('likes')
          .insert({ type: product.category, type_id: product.id, users: currentUserId });

        const { data: updatedProduct } = await supabase
          .from('trades')
          .update({ likes: product.likes + 1 })
          .eq('id', product.id)
          .select()
          .single();

        setProduct(updatedProduct);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <>
      <Container className="mt-5">
        <Card className="shadow-lg rounded-4 p-4">
          <Row className="gy-4">
            {/* 이미지 캐러셀 */}
            <Col md={6}>
              {detailImages.length > 0 ? (
                <Carousel variant="dark" fade>
                  {detailImages.map((img, idx) => (
                    <Carousel.Item key={idx}>
                      <img
                        className="d-block w-100 rounded-3"
                        src={img}
                        alt={`상세 이미지 ${idx + 1}`}
                        style={{ objectFit: 'cover', maxHeight: '420px' }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                product.main_img && (
                  <Card.Img
                    src={product.main_img}
                    alt="메인 이미지"
                    className="rounded-3 shadow-sm"
                    style={{ maxHeight: '420px', objectFit: 'cover' }}
                  />
                )
              )}
              {/* 사용자 정보 또는 기타 추가 정보 */}
              <div className="mt-3 text-center">
                <Badge bg="info" pill style={{ fontSize: '1rem' }}>
                  판매자: {productUser.name}
                </Badge>
              </div>
            </Col>

            {/* 상품 정보 */}
            <Col md={6}>
              <Card.Body>
                <h2 className="fw-bold mb-3">{product.title}</h2>
                <p className="text-secondary fs-5">{product.content}</p>
                <h3 className="text-success fw-bold mb-4">{Number(product.price).toLocaleString()}원</h3>

                <Row className="mb-3">
                  <Col xs={6}>
                    <p><strong>공동구매 시작</strong></p>
                    <p className="text-muted">{new Date(product.sales_begin).toLocaleString()}</p>
                  </Col>
                  <Col xs={6}>
                    <p><strong>공동구매 종료</strong></p>
                    <p className="text-muted">{new Date(product.sales_end).toLocaleString()}</p>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col xs={6}>
                    <p><strong>제한 유형</strong></p>
                    <p className="text-muted">{product.limit_type === 1 ? '인원제한' : '개수제한'}</p>
                  </Col>
                  <Col xs={6}>
                    <p><strong>제한 수량</strong></p>
                    <p className="text-muted">{product.limit} {product.limit_type === 1 ? '명' : '개'}</p>
                  </Col>
                </Row>

                <Row className="mb-3">
                  {/* <Col xs={6}>
                    <p className="mb-1"><i className="bi bi-eye-fill"></i> 조회수</p>
                    <p className="fw-semibold">{product.cnt}</p>
                  </Col>
                  <Col xs={6}>
                    <p className="mb-1"><i className="bi bi-heart-fill text-danger"></i> 좋아요</p>
                    <p className="fw-semibold">{product.likes}</p>
                  </Col> */}
                  <Col xs={6}>
                    <p className="mb-1"><i className="bi bi-eye-fill"></i> 조회수</p>
                    <p className="fw-semibold">{product.cnt}</p>
                  </Col>
                  <Col xs={6}>
                    <p className="mb-1"><i className="bi bi-heart-fill text-danger"></i> 좋아요</p>
                    <p className="fw-semibold">{product.likes}</p>
                    <Button
                      variant={isLiked ? 'danger' : 'outline-danger'}
                      size="sm"
                      onClick={handleLikeToggle}
                      disabled={isLiking}
                      className="mt-2"
                    >
                      {isLiked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
                    </Button>

                  </Col>
                </Row>

                <Button
                  variant="danger"
                  size="lg"
                  className="w-100 rounded-pill"
                  disabled={new Date() > new Date(product.sales_end)}
                >
                  {new Date() > new Date(product.sales_end) ? '공동구매 종료' : '참여하기'}
                </Button>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}
