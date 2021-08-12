describe('영화 검색(겨울왕국2)', () => {
    it('검색 페이지로 접근합니다', () => {
        cy.visit('/')
        cy.get('header .nav-link.active')
            .contains('Search')
            // nav-link 부분에 .active 가 붙은경우 , 'Search' 포함되어져있는지 테스트
    })
    it('영화를 검색합니다', () => {
        cy.get('input.form-control')
            .type('frozen') // input 요소에 타이핑
        cy.get('select.form-select:nth-child(2)')
            .select('30') // 데이터를 선택
        cy.get('button.btn')
            .contains('Apply')
            .click()
        // 정보를 요청해서 가져오는 거기때문에 시간이 걸림
        cy.wait(2000) // 어느정도 기다릴지를 명시
        cy.get('.movie')
            .should('have.length', 30) // 30 개 까지 출력됬는지 확인
    })
    it('겨울왕구2 영화 아이템을 선택합니다', () => {
        cy.get('.movie .title')
            .contains('Frozen II')
            .click()
    })
    it('영화 상제 정보를 확인합니다', () => {
        cy.url() // 현재 접속한 페이지의 url 주소확인
            .should('include', '/movie/tt4520988')
            cy.wait(1000)
            cy.get('header .nav-link.active')
                .contains('Movie')// movie 버튼 활성화 확인
            cy.get('.title')
                .contains('Frozen II')
    })
})

// 새로고침 버튼을 통해 , 과정을 볼수있다.