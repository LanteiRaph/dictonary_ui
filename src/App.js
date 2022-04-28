import "./App.css";
import React, {useState } from "react";
import Header from "./components/Header";

import { getTranslation } from "./service/search";

function App() {
  //Compile the diffrent state that we needed to manage the application.
  const [translations, setTranslations] = useState([]);
  const [word, setWord] = useState('');
  const [error, setError] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [instead, setInstead] = useState();
  const [closeWord, setCloseWord] = useState();

  //handle the repsonse from the server for user experince
  const handleRespnse = (response) => {
    //Check for error in the responce
    if (response.search_word.unmatched) {
      //set the error to true
      setError(true);
      //set the error msg
      setErrorMsg(response.values[0]);
      //return
      return;
    }
    //Check if the given value was matched to a close word
    if (response.search_word.instead) {
      //set insted to True
      setInstead(true);
      //set the close word
      setCloseWord(response.search_word.close_match);
      //set the translations to the values
      setTranslations(response.values);
      //return
      return;
    }
    //no error and the word was a match
    if (response.search_word.matched) {
      //Clear any previouse
      setCloseWord('')
      setError(false)
      setInstead(false)
      //set the translation
      setTranslations(response.values);
      //return
      return;
    }
  };

  const handlesubmit = (e) => {
    //Prevent the dault action from taking place
    e.preventDefault();
    //Translate the word
    translate();
  };

  //tansalte the given word
  const translate = () => {
    //Make the api request for the translation
    getTranslation(word)
      .then((res) => {
        //Handle the return response
        handleRespnse(res);
      })
      .catch((e) => console.log(e));
  };

  //set the word for translation
  const handleChange = (e) => {
    const value = e.target.value;
    setWord(value);
    //Clear the input
    e.target.value = "";
  };

  //Create list items for display
  const listItems = translations.map((meaning, i) => {
    return (
      <li key={i} className="list-group-item mrgtop">
        {meaning}
      </li>
    );
  });

  return (
    <div className="container-fluid">
      <Header />
      <div className="container">
        <div className="row">
          <div className="col">
            <form className="m-4">
              <div className="form-group">
                <label>Enter Word</label>
                <input
                  type="text"
                  name="search-word"
                  className="form-control"
                  onChange={(e) => handleChange(e)}
                  value={word}
                  required
                />
              </div>
              <button className="btn btn-primary" onClick={handlesubmit}>
                Submit
              </button>
            </form>
          </div>
          <div className="col mrg">
            {translations.length > 0 ? (
              <div>
                {instead ? (
                  <div>
                    Showing Result for <b>{closeWord}</b> instead of <b>{word}</b>
                  </div>
                ) : (
                  <div>Results</div>
                )}
                <ul className="list-group">{listItems}</ul>
              </div>
            ) : (
              <div>
                {error ? <div> {errorMsg} </div> : <div>Search Results</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
