import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api'

export const searchAnime = async (name) => {
    const response = await axios.get(`${BASE_URL}/anime/search?name=${encodeURIComponent(name)}`)
    return response.data
}

export const getEpisodeAnalysis = async (id) => {
    const response = await axios.get(`${BASE_URL}/anime/${id}/episodes/analysis`)
    return response.data
}

export const getMangaInfo = async (id) => {
    const response = await axios.get(`${BASE_URL}/anime/${id}/manga-info`)
    return response.data
}