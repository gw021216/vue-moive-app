export default {
    namespaced: true,
    // store 에 하나의 모듈이 될수있도록 
    state: () => ({
         // 객체 데이터는 배열데이터와 같게 하나의 참조형 데이터 
        // 데이터의 불변성을 유지 하려면 함수로 만들어서 반환을 해줘야지
        // state 라는 속성에서 사용하는 데이터가 고유해짐
        name: 'Jaehong',
        email: 'gw021216@naver.com',
        blog: 'https://jaehong.blog',
        phone: '+82-10-1234-5678',
        image: 'https://heropy.blog/css/images/logo.png'
    })
       
    
}