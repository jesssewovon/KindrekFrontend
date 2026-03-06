import { Link } from 'react-router';

export default function About() {
  return (
    <div>
      <Link to="/">Go to Home</Link>
      <h1>About This Blog</h1>
      <p>This blog is built with React 19 and React Router v6.21.</p>
    </div>
  );
}