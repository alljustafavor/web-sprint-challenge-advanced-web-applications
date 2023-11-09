import React, { useState } from 'react';
import { NavLink, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';
import { axiosWithAuth } from './../axios/index';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate()
  const redirectToLogin = () => {
    navigate("/")
  };

  const redirectToArticles = () => {
    navigate('/articles')
  };

  const logout = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem('token');
      setMessage("Goodbye!");
    } else {
      setMessage("Already Logged Out");
    }
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    axios
      .post(loginUrl, {
        username: username,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        console.log(res)
        localStorage.setItem('token', res.data.token)
        redirectToArticles()
        setMessage(res.data.message)
      })
      .catch((err) => console.log(err))
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    // ✨ implement
  }

  const isAuthenticated = localStorage.getItem('token');

  return (
    <>
      <Spinner />
      <Message />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            isAuthenticated ? (
              <>
                <ArticleForm />
                <Articles />
              </>
            ) : (
              <Navigate to="/" />
            )
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2023</footer>
      </div>
    </>
  )
}
