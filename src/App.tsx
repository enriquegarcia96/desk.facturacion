import { RouterProvider } from 'react-router';

import { appRouter } from './app.router';

const App = () => {
  return (
    <RouterProvider router={appRouter} />
  )
};

export default App;