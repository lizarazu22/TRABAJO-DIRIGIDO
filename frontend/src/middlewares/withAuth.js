import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent, allowedRoles = []) => {
  const Wrapper = (props) => {
    const router = useRouter();

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        router.replace('/login');
      } else if (allowedRoles.length && !allowedRoles.includes(user.rol)) {
        router.replace('/');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
