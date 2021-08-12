import movieStore from '~/store/movie'
import _clonDeep from 'lodash/cloneDeep'
import axios from 'axios'
import { expect } from '@jest/globals'

describe('store/movie.js', () => {
    let store

    beforeEach(() => {
        store = _clonDeep(movieStore)
        // store 에서 데이터 를 수정을 했을떼 movieStore 에도 영향을 끼치고, 오염시킴
        // 그래서 복사된 데이터를 사용
        store.state = store.state()
        // state 는 함수이기 때문에 , 함수처럼 실행해서 거기서 나온 객체데이터를 다시 사용
        store.commit = (name, payload) => {
            store.mutations[name](store.state, payload)          
        }
        // commit 이라는 메소드가 정의 되어있지않기 때문에 정의
        store.dispatch = (name, payload) => {
            const context = {
                state: store.state,
                commit: store.commit,
                dispatch: store.dispatch
            }
            return store.actions[name](context, payload)
        }
        // dispatch 라는 메소드를 만들때는 actions 를 리턴키워드로 반환해줘야함
    })

    test('영화 데이터를 초기화합니다', () => {
        store.commit('updateState', {
            moives: [{ imdbID: '1' }],
            message: 'Hello world',
            loading: true
        })
        store.commit('resetMovies')
        expect(store.state.movies).toEqual([])
        expect(store.state.message).toBe('Search for the movie title!')
        expect(store.state.loading).toBe(false)
    })

    test('영화 목록을 잘 가져온 경우 데이터를 확인합니다', async () => {
        const res = {
            data: {
                totalResults: '1',
                Search: [
                    {
                        imdbID: '1',
                        Title: 'Hello',
                        Poster: 'hello.jpg',
                        Year: '2021'
                    }
                ]
            }
        }
        axios.post = jest.fn().mockResolvedValue(res)
        await store.dispatch('searchMovies')
        expect(store.state.movies).toEqual(res.data.Search)
    })

    test('영화 목록을 가져오지 못한 경우 에러 메세지를 확인합니다', async () => {
        const errorMessage = 'Network Error.'
        axios.post = jest.fn().mockRejectedValue(new Error(errorMessage))
        await store.dispatch('searchMovies')
        expect(store.state.message).toBe(errorMessage)
    })

    test('영화 아이템이 중복된 경우 고유하게 처리합니다', async () => {
        const res = {
            data: {
                totalResults: '1',
                Search: [
                    {
                        imdbID: '1',
                        Title: 'Hello',
                        Poster: 'hello.jpg',
                        Year: '2021'
                    },
                    {
                        imdbID: '1',
                        Title: 'Hello',
                        Poster: 'hello.jpg',
                        Year: '2021'
                    },
                    {
                        imdbID: '1',
                        Title: 'Hello',
                        Poster: 'hello.jpg',
                        Year: '2021'
                    }
                ]
            }
        }
        axios.post = jest.fn().mockResolvedValue(res)
        await store.dispatch('searchMovies')
        expect(store.state.movies.length).toBe(1)
    })

    test('단일 영화의 상세 정보를 잘 가져온 경우 데이터를 확인합니다', async () => {
        const res = {

            data: {
                imdbID: '1',
                Title: 'Frozen',
                Poster: 'frozen.jpg',
                Year: '2021'
            }
        }
        axios.post = jest.fn().mockResolvedValue(res)
        await store.dispatch('searchMovieWithId')
        expect(store.state.theMovie).toEqual(res.data)
    })
})