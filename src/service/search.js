import axios from 'axios'


const getTranslation = async (word) => {
    //http://127.0.0.1:105/search/subsidiary/
    //make an api call with te given word
    const result = await axios.get(`http://127.0.0.1:105/search/${word}`)
    //respond back with the result given.
    return await result.data
}


export {getTranslation}