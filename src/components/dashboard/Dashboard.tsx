import React, { CSSProperties, useEffect, useState } from 'react';
import axios from 'axios';
import Toolbar from '../toolbar/Toolbar';
import { ToastContainer, toast } from 'react-toastify';
import { formatTime } from '../../utils/formatTime';
import HashLoader from 'react-spinners/HashLoader';
import { useNavigate } from 'react-router-dom';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
};

const Dashboard: React.FC = () => {
  const baseURL = import.meta.env.VITE_PUBLIC_API_URL;

  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const handleCheckboxChange = (id: number) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const handleBlockUsers = async () => {
    try {
      await axios.post(
        `${baseURL}/api/users/block`,
        { userIds: selectedUsers },
        { withCredentials: true }
      );
      toast.success('Users blocked successfully');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.includes(user.id) ? { ...user, isBlocked: true } : user
        )
      );
      setSelectedUsers([]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to block users.');
    }
  };

  const handleUnblockUsers = async () => {
    try {
      await axios.post(
        `${baseURL}/api/users/unblock`,
        { userIds: selectedUsers },
        { withCredentials: true }
      );
      toast.success('Users unblocked successfully');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.includes(user.id) ? { ...user, isBlocked: false } : user
        )
      );
      setSelectedUsers([]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to unblock users.');
    }
  };

  const handleDeleteUsers = async () => {
    try {
      await axios.delete(`${baseURL}/api/users/delete`, {
        data: { userIds: selectedUsers },
        withCredentials: true,
      });

      const loggedInUserId = users.find((user) => user.isCurrent)?.id;
      if (selectedUsers.includes(loggedInUserId)) {
        await axios.post(
          `${baseURL}/api/logout`,
          {},
          { withCredentials: true }
        );
        toast.success('Your account has been deleted');
        navigate('/auth');
        return;
      }

      toast.success('Users deleted successfully');
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedUsers.includes(user.id))
      );
      setSelectedUsers([]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete users.');
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);

      try {
        const response = await axios.get(`${baseURL}/api/users`, {
          withCredentials: true,
        });

        const currentUserId = response.data.currentUserId;
        const usersWithFlag = response.data.users.map((user: any) => ({
          ...user,
          isCurrent: user.id === currentUserId,
        }));

        setUsers(usersWithFlag);
      } catch (err: any) {
        console.log(err.response?.data?.message || 'Failed to fetch users.');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container p-3">
      <div className="text-secondary text-end fs-6"></div>
      <Toolbar
        onBlock={handleBlockUsers}
        onUnblock={handleUnblockUsers}
        onDelete={handleDeleteUsers}
        onFilterChange={handleFilterChange}
      />

      <table className="table mt-4">
        <thead>
          <tr>
            <th scope="col">
              <input
                className="form-check-input customCheckbox"
                type="checkbox"
                value=""
                id="flexCheckIndeterminate"
                checked={selectedUsers.length === users.length}
                onChange={handleSelectAll}
              />
            </th>
            <th scope="col">Name</th>
            <th scope="col">Eamail</th>
            <th scope="col">Last seen</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user: any) => (
            <tr key={user.id}>
              <th scope="row">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id={`checkbox-${user.id}`}
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </th>
              <td
                className={`${
                  user.isBlocked ? 'text-secondary' : 'fw-semibold'
                }`}
              >
                {user.name || 'Unnamed'}
              </td>
              <td
                className={`${
                  user.isBlocked ? 'text-secondary' : 'fw-semibold'
                }`}
              >
                {user.email}
              </td>
              <td>{formatTime(user.lastLoginAt) || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoadingUsers && (
        <div className="mx-auto text-center itemc-center">
          <HashLoader
            color={'#009292'}
            loading={true}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
