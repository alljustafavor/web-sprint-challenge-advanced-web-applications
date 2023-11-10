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
  const [currentArticle, setCurrentArticle] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);


  const navigate = useNavigate()
  const redirectToLogin = () => {
    navigate("/");
  };

  const redirectToArticles = () => {
    navigate('/articles');
  };

  const logout = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem('token');
      setMessage("Goodbye!");
    } else {
      setMessage("Already Logged Out");
    }
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    setSpinnerOn(true)
    axios
      .post(loginUrl, {
        username: username,
        password: password
      })
      .then((res) => {
        setSpinnerOn(false);
        localStorage.setItem('token', res.data.token);
        redirectToArticles();
        setMessage(res.data.message);
      })
      .catch((err) => console.log(err))
    setSpinnerOn(false)
  }

  const getArticles = () => {
    setSpinnerOn(true);
    axiosWithAuth()
      .get(articlesUrl)
      .then((res) => {
        setMessage(res.data.message);
        setSpinnerOn(false);
        setArticles(res.data.articles);
      })
      .catch((err) => {
        console.log(err);
        setSpinnerOn(false);
        setMessage(err.data.message);
      });
  };

  const postArticle = (article) => {
    setSpinnerOn(true);
    axiosWithAuth()
      .post(articlesUrl, article)
      .then((res) => {
        setSpinnerOn(false);
        setCurrentArticleId(res.data.article.article_id);
        setMessage(res.data.message);
        setArticles(prevArticles => [...prevArticles, res.data.article]);
      })
      .catch((err) => {
        setSpinnerOn(false);
        console.log(err);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    setSpinnerOn(true);
    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((res) => {
        setMessage(res.data.message);
        setSpinnerOn(false);
        setArticles((prevArticles) => prevArticles.filter((art) => art.article_id !== article_id));
        setArticles((prevArticles) => [...prevArticles, res.data.article]);
        setMessage(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteArticle = article_id => {
    setSpinnerOn(true);
    axiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then((res) => {
        setSpinnerOn(false);
        setMessage(res.data.message);
        setArticles(prevArticles => prevArticles.filter(art => art.article_id !== article_id));
      })
      .catch(err => {
        setSpinnerOn(false);
        console.log(err);
      });
  }

  const editArticle = (article) => {
    setCurrentArticle(article);
  }


  const isAuth = localStorage.getItem('token');

  return (
    <>
      <Spinner />
      <Message message={message} />
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
            isAuth ? (
              <>
                <ArticleForm currentArticle={currentArticle} postArticle={postArticle} updateArticle={updateArticle} />
                <Articles articles={articles} getArticles={getArticles} updateArticle={updateArticle} deleteArticle={deleteArticle} editArticle={editArticle} isAuth={isAuth} />
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
