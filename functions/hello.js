exports.handler = async function (event, context) {
    return {
        statusCode: 200, // 정상적인 응답을 의미
        body: JSON.stringify({
            name: 'Jaehong',
            age: 100,
            email: 'nono@naver.com'
        }) // Serverless 함수로 응답시켜줄 데이터 명시
           // 문자데이터만 할당가능
           // JSON.stringify({}) 를 사용해서 객체 데이터를 문자로 변환시켜서 할당가능

    }
}