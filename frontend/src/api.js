export const fetchUsers = async () => {
    const response = await fetch('/api/users/');
    return response.json();
  };
  