const apiFetch = async (url, options = {}) => {
  let token = null;
  const bankAuthStr = localStorage.getItem('bankAuth');
  if (bankAuthStr) {
    try {
      const bankAuth = JSON.parse(bankAuthStr);
      token = bankAuth.token;
    } catch (e) {
      console.error('Error parsing bankAuth from localStorage');
    }
  }
  
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Si recibimos 401 o 403 y no estamos en login, podríamos desloguear al usuario
  if ((response.status === 401 || response.status === 403) && !url.includes('/login')) {
    localStorage.removeItem('bankAuth');
    window.location.href = '/login';
  }

  return response;
};

export default apiFetch;
