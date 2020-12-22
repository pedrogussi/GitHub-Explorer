/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, FormEvent } from 'react';

import { FiChevronRight } from 'react-icons/fi';

import { Link } from 'react-router-dom';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import {
  Title, Form, Repositories, Error,
} from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storegedRepositories = localStorage.getItem('@github-explorer:repositories');

    if (storegedRepositories) {
      return JSON.parse(storegedRepositories);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('@github-explorer:repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepositories(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    // console.log(newRepo);

    event.preventDefault();

    if (!newRepo) {
      setInputError('Type a valid owner/repo name');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      // console.log(response.data);
      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Error trying to search the repository');
    }
  }

  return (
    <>
      <img src={logoImg} alt="logo" />
      <Title>Explore GitHub Repositories</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepositories}>
        <input
          value={newRepo}
          // eslint-disable-next-line prettier/prettier
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Type the Repo"
        />
        <button type="submit">Search</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repository) => (
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};
export default Dashboard;
