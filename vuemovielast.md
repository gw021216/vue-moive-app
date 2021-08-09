footer 

```vue
<template>
    <footer>
        <Logo />
        <a
         href="https://github.com/ParkYoungWoong"
         target="_blank">
         (c){{ new Date().getFullYear() }} JAEHONG
         </a>
    </footer>
</template>

<script>
import Logo from '~/components/Logo'

export default {
    components: {
        Logo
    }
}
</script>

<style lang="scss" scoped>
footer {
    padding: 70px 0;
    text-align: center;
    opacity: .3;
    .logo {
        display: block;
        margin-bottom: 4px;
    }
}
</style>
```
모든 페이지의 하단 부분에서 나오기위해 , 
App.vue 에 연결

단일 영화 상세 정보 가져오기

OMDP API 에서 Parameters 에 , By ID or Title 에서 영화의 상세정보를 가져올수있다.

삼항 연산자로 , id 값만 가져오기
```js
        async searchMovieWithId(context, payload) {
            try {
                const res = await _fetchMovie(payload)
            } catch (error) {

            }
        }
    }
}


function _fetchMovie(payload) {
    const { title, type, year, page, id } = payload
    const OMDB_API_KEY = '7035c60c'
    const url = id 
    ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}`
    : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`
```

특정한 영화를 선택하게 되면 , 그 선택된 영화의 아이디 값으로 주소를 만들어서 페이지 이동을 시키고 , 페이지에 접근을 했을때 아이디값을 주소 부분에서 알아낸다음에 SearchMovieId 실행

index.js 에서 movie 경로에 , 아이디 값 연결
```
export default {
    created() {
        this.$store.dispatch('movie/searchMovieWithId', { 
            id: this.$route.params.movieid
        }
        )}
}
</script>
```
```
export default createRouter({

    history: createWebHashHistory(),

    routes: [
        {
            path: '/',
            component: Home

        },
        {
            path: '/movie/:movieid',
            component: Movie
        },
        {
            path: '/about',
            component: About
        }
    ]
})
```

내용 수정
```
async searchMovieWithId({ state, commit }, payload) {
            if (state.loading) return

            commit('updateState', {
                theMovie: {},
                loading: true
            })

            try {
                const res = await _fetchMovie(payload)
                commit('updateState', {
                    theMovie: res.data
                })
            } catch (error) {
                commit('updateState', {
                    theMovie: {}
                })
            } finally {
                commit('update', {
                    loading: false
                })
            }
        }
```

스켈레톤 UI

실제로 만들 UI 의 뼈대가 실제 컨텐츠가 출력되기전에 
잠시 보여주는 

movie.vue 에서 스타일 정의
```
<template>
    <div class="container">
        <div class="skeletons">
            <div class="skeleton poster"></div>
            <div class="specs">

                <div class="skeleton title"></div>
                <div class="skeleton spec"></div>
                <div class="skeleton plot"></div>
                <div class="skeleton etc"></div>
                <div class="skeleton etc"></div>
                <div class="skeleton etc"></div>
                
            </div>
        </div>
    </div>
</template>
```
```
.skeletons {
    display: flex;
    .poster {
        flex-shrink: 0;
        width: 500px;
        height: 500px * 3 / 2;
        margin-right: 70px;
    }
    .specs {
        flex-grow: 1;
    }
    .skeleton {
        border-radius: 10px;
        background-color: $gray-200;
        &.title {
            width: 80%;
            height: 70px;
            
        }
        &.spec {
            width: 60%;
            height: 30px;
            margin-top: 20px;
        }
        &.plot {
            width: 100%;
            height: 250px;
            margin-top: 20px
        }
        &.etc {
            width: 50%;
            height: 50px;
            margin-top: 20px
        }
    }
}
</style>
```
사용자가 어느부분에 어떤내용이 출력될지 대략적으로 알게해주는 용도

Loader 

UI 중앙에 로딩애니메이션 추가 

기본 props 정의 , 스타일 추가
```
<template>
    <div 
        :style="{
            width: `${size}rem`,
            height: `${size}rem`,
            zIndex
        }"
        :class="{
        absolute,
        fixed
        }"
    class="spinner-border text-primary"></div>
</template>

<script>
export default {
    props: {
        size: {
            type: Number,
            defalut: 2
        },
        absolute: {
            type: Boolean,
            defalut: false
        },
        fixed: {
            type: Boolean,
            defalut: false
        },
        zIndex: {
            type: Number,
            defalut: 0
        }
    }
}
</script>

<style lang="scss" scoped>
.spinner-border {
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    &.absolute {
        position: absolute;
    }
    &.fixed {
        position: fixed;
    }
}
</style>
```
중앙 정렬 시키기 위해 , 값 수정
```
<Loader
        :size="3"
        :z-index="9"
        fixed />
```

영화 상세 페이지 정리

데이터를 가져온 후 , 구조 정리
```
        <div
         v-else
         class="movie-details">
            <div class="poster"></div>
            <div class="specs">
                <div class="title">
                    {{ theMovie.Title }}
                </div>
                <div class="labels">
                    <span>{{ theMovie.Released }}</span>
                    <span>{{ theMovie.Runtime }}</span>
                    <span>{{ theMovie.Country }}</span>
                </div>
                <div class="plot">
                    {{ theMovie.Plot }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Loader from '~/components/Loader'

export default {
    components: {
        Loader
    },
    computed: {
        theMovie() {
            return this.$store.state.movie.theMovie
        },
        loading() {
            return this.$store.state.movie.loading
        }
    },
    created() {
        
        this.$store.dispatch('movie/searchMovieWithId', { 
            id: this.$route.params.id
        }
        )}
}
</script>
```
포스터 출력
```
 <div :style="{ backgroundImage: `url(${theMovie.Poster})` }"
             class="poster"></div>
```
스타일 정리 
css content에 특수문자 작성 

Ratings 데이터 출력

```
<div class="ratings">
                    <h3>Ratings</h3>
                    <div class="rating-wrap">
                        <div
                        v-for="{ Source: name, Value: score } in theMovie.Ratings"
                        :key="name"
                        :title="name"
                        class="rating">
                        <img :src="`https://raw.githubusercontent.com/ParkYoungWoong/vue2-movie-app/master/src/assets/${name}.png`"
                         :alt="name">
                         <span>{{ score }}</span>
                        </div>
                    </div>
                </div>
```

더 높은 해상도의 영화 포스터 가져오기

AWS Lambda@edge 로 실시간 이미지 리사이징(updated)

이미지를 url 주소로 요청을 할때 사이즈를 명시해서 요청

메소드 추가 
```
methods: {
            requestDiffSizeImage(url, size = 700) {
              return url.replace('SX300', `SX${size}`)
            }
        }
```

Vue 플러그인 ( 이미지 로드 이벤트 )

Vue js 내부에서 플러그인으로 만들어서 등록을 할수있고 등록을 해놓으면 언제든지 $ 시작하는 특별한 함수나 객체를 사용할 수 있음

기본적인 data() , methods: 생성
```
<script>
export default {
    props: {
        movie: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            imageLoading: true
        }
    },
    methods: {
        init() {
            const img = document.createElement('img')
            img.src = this.movie.Poster
            img.addEventListener('load', () => {
                this.imageLoading = false
            })
        }
    }
}
</script>
```
다른 컴포넌트에서도 사용할수있게

src/plugins/loadimage.js

```
export default {
    install(app) {
        app.config.globalProperties.$loadImage = src => {
            return new Promise(resolve => {
                const img = document.createElement('img')
                img.src = src
                img.addEventListener('load', () => {
                    resolve()
                })
            })
        }
    }
}
```
플러그인 등록
```
import loadImage from './plugins/loadimage'

createApp(App)
.use(router) //$route, $router
.use(store) // $store
.use(loadImage) //$loadImage
.mount('#app')
```
플러그인 사용
1.
```
    methods: {
        async init() {
            await  this.$loadImage(this.movie.Poster)
            this.imageLoading = false
        }
    }
```
2.
```
methods: {
            requestDiffSizeImage(url, size = 700) {
               const src = url.replace('SX300', `SX${size}`)
               this.$loadImage(src)
                 .then(() => {
                     this.imageLoading = false
                 })
                return src
            }
        }
```

잘못된 URL 을 가지고 있는 경우에 예외 처리

Poster 의 정보가 N/A 일 경우 , 
N/A (Not Applicable, 해당사항 없음)
1.
```
methods: {
        async init() {
            const poster = this.movie.Poster
            if (!poster || poster === 'N/A') {
                this.imageLoading = false
            } else {
                await  this.$loadImage(poster)
                this.imageLoading = false
            }
            
        }
    }
}
```
2.
```
methods: {
            requestDiffSizeImage(url, size = 700) {
                if (!url || url === 'N/A') {
                    this.imageLoading = false
                    return ''
                }
               const src = url.replace('SX300', `SX${size}`)
               this.$loadImage(src)
                 .then(() => {
                     this.imageLoading = false
                 })
                return src
            }
        }
```
Nav 경로 일치 및 활성화

영화의 아이템을 선택했을떄 상세 페이지로 갈수있게
```
<RouterLink
     :to="`/movie/${movie.imdbID}`
```
Nav active 활성화
```
<RouterLink
                :to="nav.href"
                active-class="active"
                :class="{ active: isMatch(nav.path) }"
                 class="nav-link">
                 {{ nav.name }}
                </RouterLink>
```
```
methods: {
        isMatch(path) {
            if (!path) return false
            return path.test(this.$route.fullPath)
        }
    }
```
About 

About.js 의 모듈화
```
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
```
About.vue
```
<template>
    <div class="about">
        <div class="photo">
            <Loader
            v-if="imageLoading"
            absolute />
            <img 
            :src="image"
            :alt="name" />
        </div>
        <div class="name">
            {{  name }}
        </div>
        <div>{{ email }}</div>
        <div>{{ blog }}</div>
        <div>{{ phone }}</div>
    </div>
</template>

<script>
import Loader from '~/components/Loader'

export default {
  components: { Loader },
    data() {
        return {
            imageLoading: true
        }
    },
    computed: {
        image() {
            return this.$store.state.about.image
        },
        name() {
            return this.$store.state.about.name
        },
        blog() {
            return this.$store.state.about.blog
        },
        email() {
            return this.$store.state.about.email
        },
        phone() {
            return this.$store.state.about.phone
        },
    },
    mounted() {
        this.init()
    },
    methods: {
        async init() {
           await this.$loadImage(this.image)
           this.imageLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/scss/main";

.about {
    text-align: center;
    .photo {
        width: 250px;
        height: 250px;
        margin: 40px auto 20px;
        padding: 30px;
        border: 10px solid $gray-300;
        border-radius: 50%;
        box-sizing: border-box;
        background-color: $gray-200;
        position: relative;
        img {
            width: 100%;
        }
    }
    .name {
        font-size: 40px;
        font-family: "Oswald", sans-serif;
        margin-bottom: 20px;
    }
}
</style>
```
404 Page Not Found 제작

지정되지 않은 주소로 접근했을뗴 , 보여줄 페이지
```
        {
            path: '/:notfound(.*)',
            component: NotFound
        }
```
지정 되지않은 나머지 페이지들로 주소 연결했을떼 ,
404 페이지로 이동할수있게 정규표현식을 활용

부트스트랩 Breakpoint ( 반응형 )
media-breakpoint 이라는 mixin 사용
RouterLink 사용하지않고 $router 활용
```
toAbout() {
            this.$router.push('/about')
        }
```
viewport 기준으로 크기가 변경시
네비게이션 , Search , Movie 부분 스타일 바꾸기
```
 @include media-breakpoint-down(sm) {
        .nav {
            display: none;
        }
    }
```
```
@include media-breakpoint-down(lg) {
        display: block;
        input {
            margin-right: 0;
            margin-bottom: 10px;
        }
        .selects {
            margin-right: 0;
            margin-bottom: 10px;
            select {
                width: 100%;
            }
        }
        .btn {
            width: 100%;
        }
    }
```
```
@include media-breakpoint-down(xl) {
        .poster {
            width: 300px;
            height: 300px * 3 / 2;
            margin-right: 40px;

        }
    }
    @include media-breakpoint-down(lg) {
        display: block;
        .poster {
            margin-bottom: 40px;
        }
    }
    @include media-breakpoint-down(md) {
        .specs {
            .title {
                font-size: 50px;
            }
            .ratings {
                .rating-wrap {
                    display: block;
                    .rating {
                        margin-top: 10px;
                    }
                }
            }
        }
    }
}
```
모든 컴포넌트에서 전역 스타일 가져오기

webpack.config.js 에서 
```
        {
            loader: 'sass-loader',
            options: {
              additionalData: '@import "~/scss/main";'
            }
```
Vuex Helpers

반복되는 내용을 작성하고 , 관리하기위해 사용
```js
    computed: {
        ...mapState('about', [
            'image',
            'name',
            'email',
            'blog',
            'phone'
        ])
        // image() {
        //     return this.$store.state.about.image
        // },
        // name() {
        //     return this.$store.state.about.name
        // },
        // blog() {
        //     return this.$store.state.about.blog
        // },
        // email() {
        //     return this.$store.state.about.email
        // },
        // phone() {
        //     return this.$store.state.about.phone
        // },
    },
```
computed 에 mapState를 직접 할당하진말고 ,
다른 계산된 데이터를 사용할수도 있으니 전개연산자를 통해서 사용

Vuex 핵심 정리

Store 개념을 통해서 모든 데이터를 Store 내부에서 관리하고 , 그것을 각각의 컴포넌트들에서 손쉽게 가지고와서 활용할수 있는 구조를 만들수 있음

모듈을 위해서 사용하는 namespaced 라는 옵션을 제외하고, 
state, getters, mutations, actions
state (data) = 데이터형식
getters (computed) = state 을 계산된 형태로 사용할수있게
mutations (methods)
state 를 변경할수있는 권한을 가지고 있음
actions (methods, 비동기)
대부분의 로직은 acthions 에 작성하고 비동기도 활용하도록 사용
actions 는 state, getters, mutations 를 가져와서 활용할수있다.
그래서 첫번째 인수로 context라는 개념을 사용한다
context 를 객체분해 했을때 

context.state
context.getters
context.commit(mutations)
context.dispatch(actions)

{ state, commit } 이런식으로도 사용

Vue 컴포넌트에서 실제로 store 를 가져오기 위해서는

$store.state.모듈.상태
$store.getters.['모듈/게터']
$store.commit('모듈/변이')
$store.dispatch('모듈/액션')

Vuex 의 여러가지 Helper

computed 옵션에 사용
..mapState('모듈',[
    '상태1','상태2'
])
..mapGetters('모듈',[
    '게터1','게터2'
])

methoads 옵션에 사용
..mapMutations('모듈',[
    '변이1','변이2'
])
..mapActions('모듈',[
    '액션1','액션2'
])

검색 정보 초기화 및 페이지 전환 스크롤 위치 복구

페이지 이동을 할때 최대한 위에서 시작할수있게
```
scrollBehavior() {
        return { top:0 }
    },
```
검색 정보 초기화
```
resetMovies(state) {
            state.movies = []
            state.message = _defaultMessage
            state.loading = false
        }
```
```
created() {
        this.$store.commit('movie/resetMovies')
    }
```

Vue Router 정리

<RouterView>
페이지가 출력(렌더링)되는 영역 컴포넌트
변경하는 페이지가 출력되는 하나의 영역
달라지는 페이지의 내용들을 어떤 영역에서 출력할것인지를 Routerview 라는 컴포넌트를 사용하는 위치로 지정

ex) 모든 페이지에서 header 와 footer 가 동시에 나오고 달라지는 부분은 RouterView 컴포넌트 영역에서 페이지가 달라지고 있었음



<RouterLink>
페이지 이동을 위한 링크 컴포넌트
페이지 이동을 쉽고 편리하게 

$route
Route(페이지) 정보를 가지는 객체
정보를 조회하는 용도의 객체
여러가지 속성들이 들어있어서 속성들이 가지고있는 데이터를 조회하는 용도
fullPath(접근된 해당페이지의 전체경로) , 
params(접근된 페이지의 파라미터정보)

$router
Router(페이지) 조작을 위한 객체
여러가지 메소드들이 들어있어서 함수를 실행해서 동작을 일으키는
ex) push() 페이지를 이동시킴(조작)

https://google.com/blog/123?apikey=abcd0987&name=HEROPY

$route 속성에서 조회가능

google.com = 도메인 주소
/blog/123?apikey=abcd0987&name=HEROPY = fullPath
/blog/123 = params ( 실제 해당페이지의 경로만 추출가능 )
? 뒤쪽에 내용은 해당 페이지에 접근할떄 필요로하는 일종의 데이터 , 데이터를 주소부분에 포함시켜서 작성하는것을 쿼리스트링이라고 함
?apikey=abcd0987&name=HEROPY = query
key = value 형태로 특정한 데이터를 url 주소에 담아서 사용할때 쿼리스트링이라는 개념으로 이러한 특정데이터를 작성

Netlify 배포