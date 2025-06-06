import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { getUser } from '../utils/getUser';
import { supabase } from "../supabase/supabase";

export const useImage = () => {
    // 이미지의 경로들
    const [imageList, setImageList] = useState([]);

    // supabase 스토리지에 여러 장 이미지를 webp로 업로드
    const setWebp = async (e) => {
        const { user } = await getUser();
        const files = Array.from(e.target.files);
        if (!files.length || !user) return;

        let newImagePaths = [];

        for (const file of files) {
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                alert('JPG, PNG, WEBP 형식의 이미지만 업로드할 수 있습니다.');
                continue;
            }
            try {
                const webp = await imageCompression(file, {
                    maxSizeMB: 1, // 최대 용량 (1MB 이하로 압축)
                    maxWidthOrHeight: 1480, // 최대 크기
                    useWebWorker: true, // ui가 안 멈추게
                    fileType: 'image/webp', // WebP로 변환
                });
                // 버킷에 업로드
                const { data, error } = await supabase.storage
                    .from('images')
                    .upload(
                        `${user.id}/${Date.now()}_${file.name}.webp`, // 파일 이름도 구분
                        webp,
                        { contentType: 'image/webp', upsert: true }
                    );
                if (error) throw error;
                newImagePaths.push(data.path);
            } catch (error) {
                console.warn('압축 실패:', error);
            }
        }

        // 여러 장을 한 번에 imageList에 추가
        setImageList((prev) => [...prev, ...newImagePaths]);
    };

    const getImages = (path) => {
        return `https://mkoiswzigibhylmtkzdh.supabase.co/storage/v1/object/public/images/${path}`;
    };

    return {
        /** 이미지의 스토리지 경로 */
        images: imageList,
        /** supabase 스토리지에 webp로 업로드 */
        setImages: setWebp,
        /** 스토리지 경로로 가져오기 */
        getImages,
    };
};




// import { useState } from 'react';
// import imageCompression from 'browser-image-compression';
// import { getUser } from '../utils/getUser';
// import { supabase } from "../supabase/supabase";

// export const useImage = () => {
//     // 이미지의 경로들
//     const [ imageList, setImageList  ] = useState([])

//     //supabase 스토리지에 webp로 업로드
//     const setWebp = async (e) =>{
//         const { user } = await getUser();
//         const file = e.target.files[0];
//         //const file = Array.from(e.target.files);
//         // 파일이 없거나, 로그인을한 유저가 아니거나
//         if (!file || !user) return;
//         if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
//             alert('JPG, PNG, WEBP 형식의 이미지만 업로드할 수 있습니다.');
//             return;
//         }
//         // 실제 압축 실행
//         try {
//             const webp = await imageCompression(file, {
//                 maxSizeMB: 1, // 최대 용량 (1MB 이하로 압축)
//                 maxWidthOrHeight: 1480, // 최대 크기
//                 useWebWorker: true, // ui 가 안 멈추게 
//                 fileType: 'image/webp', // WebP로 변환
//             });
//             // 버킷에 업로드
//             const { data, error } = await supabase.storage
//                 .from('images')
//                 .upload(
//                     `${user.id}/${Date.now()}.webp`, // 경로는 유저의 아이디/현재 시간
//                     webp, { contentType: 'image/webp', upsert: true,}
//                 );
//             if (error) throw error;
//             setImageList ((prev)=>[...prev, data.path]) // 업로드한 이미지 경로를 저장,
//             return getImages(data.path);
//         } catch (error) {
//             console.warn('압축 실패:', error);
//         }
//     }
//     const getImages = (path) => {
//         return `https://mkoiswzigibhylmtkzdh.supabase.co/storage/v1/object/public/images/${path}`;
//     }

//     return { 
//         /** 이미지의 스토리지 경로 */
//         images: imageList,
//         /** supabase 스토리지에 webp로 업로드 */
//         setImages: setWebp,  
//         /** 스토리지 경로로 가져오기 */     
//         getImages,
//     }
// }