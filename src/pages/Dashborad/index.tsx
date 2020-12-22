/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import React, { useState, FormEvent } from 'react';

import { FiChevronRight } from 'react-icons/fi';

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
  const [repositories, setRepositories] = useState<Repository[]>([]);

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
          <a key={repository.full_name} href="test">
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repositories>
    </>
  );
};
export default Dashboard;
